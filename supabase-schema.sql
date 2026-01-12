-- Upper Database Schema
-- 통합 스키마 파일 (2026-01-12 기준)

-- =====================================================
-- 테이블 생성
-- =====================================================

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' NOT NULL
);

-- 병원 테이블
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  region TEXT NOT NULL
);

-- 의사 테이블
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  photo_url TEXT,
  experience_years INTEGER,
  available_hours TEXT,
  -- 추가 필드
  aspired_beauty TEXT[] DEFAULT '{}',           -- 추구하는 beauty
  care_philosophy TEXT,                          -- 진료 철학
  clinical_experience TEXT[] DEFAULT '{}',       -- 임상 경력
  specialist_experience TEXT[] DEFAULT '{}',     -- 전문의 취득 후 임상 경력
  specialized_area TEXT[] DEFAULT '{}',          -- 전문 분야 (최대 30글자)
  languages TEXT[] DEFAULT '{}'                  -- 언어 (최대 30글자)
);

-- =====================================================
-- 인덱스 생성
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_region ON hospitals(region);

-- 배열 검색용 GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_doctors_specialized_area ON doctors USING GIN (specialized_area);
CREATE INDEX IF NOT EXISTS idx_doctors_languages ON doctors USING GIN (languages);

-- =====================================================
-- 권한 부여
-- =====================================================

GRANT ALL ON users TO anon, authenticated, service_role;
GRANT ALL ON hospitals TO anon, authenticated, service_role;
GRANT ALL ON doctors TO anon, authenticated, service_role;

-- =====================================================
-- 샘플 데이터
-- =====================================================

-- 병원 데이터
INSERT INTO hospitals (id, name, address, phone, region) VALUES
  ('11111111-1111-1111-1111-111111111111', '서울 에스테틱 클리닉', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '서울'),
  ('22222222-2222-2222-2222-222222222222', '부산 뷰티 의원', '부산광역시 해운대구 해운대로 456', '051-9876-5432', '부산'),
  ('33333333-3333-3333-3333-333333333333', '강남 피부과', '서울특별시 강남구 압구정로 789', '02-5555-6666', '서울')
ON CONFLICT (id) DO NOTHING;

-- 의사 데이터
INSERT INTO doctors (
  id, name, aspired_beauty, care_philosophy, clinical_experience,
  specialist_experience, specialized_area, languages, hospital_id,
  experience_years
) VALUES
-- 의사 1: 김민수
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '김민수',
  ARRAY['자연스러운 동안 피부', '건강한 피부 톤'],
  '환자 개개인의 피부 특성을 존중하며, 과하지 않은 자연스러운 결과를 추구합니다.',
  ARRAY['서울대학교병원 피부과 전공의', '강남세브란스병원 피부과 전임의'],
  ARRAY['눈가 안티에이징 시술 500례 이상', '다크서클 필러 시술 300례 이상'],
  ARRAY['EYEAREA_DARKCIRCLES', 'EYEAREA_WRINKLES', 'EYEAREA_UNDEREYEHOLLOWS'],
  ARRAY['ENGLISH', 'JAPANESE'],
  '11111111-1111-1111-1111-111111111111',
  12
),
-- 의사 2: 이서연
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '이서연',
  ARRAY['V라인 얼굴형', '탄력있는 피부'],
  '최신 의료 기술과 풍부한 경험을 바탕으로 최적의 결과를 제공합니다.',
  ARRAY['연세대학교 세브란스병원 성형외과', '삼성서울병원 피부과'],
  ARRAY['턱선 리프팅 시술 400례', '사각턱 보톡스 시술 600례'],
  ARRAY['JAWLINE_SAGGING', 'JAWLINE_SQUAREJAW', 'JAWLINE_DOUBLECHIN'],
  ARRAY['ENGLISH', 'CHINESE'],
  '11111111-1111-1111-1111-111111111111',
  8
),
-- 의사 3: 박준혁
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '박준혁',
  ARRAY['밝고 환한 인상', '깨끗한 피부'],
  '환자와의 충분한 상담을 통해 맞춤형 시술 계획을 수립합니다.',
  ARRAY['고려대학교병원 피부과', '아산병원 레이저센터'],
  ARRAY['다크서클 레이저 치료 700례', '눈밑 지방 재배치 200례'],
  ARRAY['EYEAREA_DARKCIRCLES', 'EYEAREA_UNDEREYEHOLLOWS'],
  ARRAY['ENGLISH'],
  '22222222-2222-2222-2222-222222222222',
  15
),
-- 의사 4: 최유진
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '최유진',
  ARRAY['젊고 생기있는 표정', '부드러운 인상'],
  '안전을 최우선으로, 환자 만족을 목표로 합니다.',
  ARRAY['이화여자대학교 목동병원', '차병원 피부과'],
  ARRAY['팔자주름 필러 시술 800례', '입가 주름 보톡스 500례'],
  ARRAY['MOUTHAREA_NASOLABIALFOLDS', 'MOUTHAREA_WRINKLES', 'MOUTHAREA_PERIORALWRINKLES'],
  ARRAY['ENGLISH', 'FRENCH'],
  '22222222-2222-2222-2222-222222222222',
  10
),
-- 의사 5: 정태영
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '정태영',
  ARRAY['조화로운 얼굴 비율', '자연스러운 볼륨'],
  '해부학적 지식을 바탕으로 안전하고 효과적인 시술을 시행합니다.',
  ARRAY['서울아산병원 성형외과', '분당서울대병원'],
  ARRAY['이중턱 지방분해 주사 300례', '턱선 윤곽 시술 400례'],
  ARRAY['JAWLINE_DOUBLECHIN', 'JAWLINE_SAGGING'],
  ARRAY['ENGLISH', 'RUSSIAN'],
  '33333333-3333-3333-3333-333333333333',
  9
),
-- 의사 6: 한소희
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '한소희',
  ARRAY['맑고 투명한 눈가', '생기있는 눈매'],
  '한 분 한 분 정성을 다해 최선의 결과를 약속드립니다.',
  ARRAY['카톨릭대학교 서울성모병원', '강남 유명 피부과 원장 역임'],
  ARRAY['눈가 주름 보톡스 1000례 이상', '눈밑 필러 시술 600례'],
  ARRAY['EYEAREA_WRINKLES', 'EYEAREA_UNDEREYEHOLLOWS', 'EYEAREA_DARKCIRCLES'],
  ARRAY['ENGLISH', 'VIETNAMESE', 'THAI'],
  '33333333-3333-3333-3333-333333333333',
  14
),
-- 의사 7: 강민재
(
  '77777777-7777-7777-7777-777777777777',
  '강민재',
  ARRAY['균형잡힌 얼굴', '자연스러운 리프팅'],
  '최소 침습적 방법으로 최대 효과를 추구합니다.',
  ARRAY['성균관대학교 삼성서울병원', '피부과 전문의 취득 후 강남 개원'],
  ARRAY['사각턱 보톡스 시술 900례', '팔자주름 필러 700례'],
  ARRAY['JAWLINE_SQUAREJAW', 'MOUTHAREA_NASOLABIALFOLDS'],
  ARRAY['ENGLISH', 'CHINESE', 'JAPANESE'],
  '11111111-1111-1111-1111-111111111111',
  11
),
-- 의사 8: 윤세라
(
  '88888888-8888-8888-8888-888888888888',
  '윤세라',
  ARRAY['동안 피부', '건강한 광채'],
  '환자분의 라이프스타일을 고려한 맞춤 시술을 제안합니다.',
  ARRAY['경희대학교병원 피부과', '유럽 피부과학회 연수'],
  ARRAY['입주변 잔주름 레이저 400례', '입가 리프팅 300례'],
  ARRAY['MOUTHAREA_PERIORALWRINKLES', 'MOUTHAREA_WRINKLES'],
  ARRAY['ENGLISH', 'GERMAN', 'FRENCH'],
  '22222222-2222-2222-2222-222222222222',
  7
),
-- 의사 9: 임동훈
(
  '99999999-9999-9999-9999-999999999999',
  '임동훈',
  ARRAY['선명한 턱선', '세련된 얼굴형'],
  '과학적 근거에 기반한 치료를 제공합니다.',
  ARRAY['전남대학교병원 성형외과', '대한성형외과학회 정회원'],
  ARRAY['턱선 처짐 개선 시술 500례', '이중턱 제거 시술 350례'],
  ARRAY['JAWLINE_SAGGING', 'JAWLINE_DOUBLECHIN', 'JAWLINE_SQUAREJAW'],
  ARRAY['ENGLISH', 'SPANISH'],
  '33333333-3333-3333-3333-333333333333',
  13
),
-- 의사 10: 오지현
(
  '10101010-1010-1010-1010-101010101010',
  '오지현',
  ARRAY['화사한 눈가', '또렷한 눈매'],
  '환자분과의 소통을 가장 중요하게 생각합니다.',
  ARRAY['인하대학교병원 안과', '서울 유명 성형외과 눈 전문'],
  ARRAY['눈밑 꺼짐 필러 시술 450례', '다크서클 복합 치료 600례'],
  ARRAY['EYEAREA_UNDEREYEHOLLOWS', 'EYEAREA_DARKCIRCLES', 'EYEAREA_WRINKLES'],
  ARRAY['ENGLISH', 'ARABIC'],
  '11111111-1111-1111-1111-111111111111',
  6
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 배열 검색 쿼리 예시
-- =====================================================
-- 특정 전문 분야를 가진 의사 검색
-- SELECT * FROM doctors WHERE 'EYEAREA_DARKCIRCLES' = ANY(specialized_area);

-- 특정 언어를 구사하는 의사 검색
-- SELECT * FROM doctors WHERE 'ENGLISH' = ANY(languages);

-- 여러 전문 분야를 모두 가진 의사 검색
-- SELECT * FROM doctors WHERE specialized_area @> ARRAY['EYEAREA_DARKCIRCLES', 'EYEAREA_WRINKLES'];
