-- Upper Database Schema
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
  specialty TEXT NOT NULL,
  sub_specialty TEXT,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  photo_url TEXT,
  bio TEXT,
  experience_years INTEGER,
  region TEXT NOT NULL,
  available_hours TEXT
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_region ON doctors(region);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_region ON hospitals(region);

-- Row Level Security (RLS) 활성화
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Enable read access for all users" ON hospitals
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON doctors
  FOR SELECT USING (true);

-- 관리자만 쓰기 가능하도록 정책 설정 (추후 인증 추가 시 수정)
CREATE POLICY "Enable insert for authenticated users only" ON hospitals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON hospitals
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON hospitals
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON doctors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON doctors
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON doctors
  FOR DELETE USING (auth.role() = 'authenticated');

-- 샘플 데이터 (선택사항)
-- INSERT INTO hospitals (name, address, phone, region) VALUES
--   ('서울대학교병원', '서울특별시 종로구 대학로 101', '02-2072-2114', '서울'),
--   ('삼성서울병원', '서울특별시 강남구 일원로 81', '02-3410-2114', '서울');

-- INSERT INTO doctors (name, specialty, sub_specialty, hospital_id, bio, experience_years, region) VALUES
--   ('김철수', '내과', '심장내과', (SELECT id FROM hospitals WHERE name = '서울대학교병원' LIMIT 1), '심장 질환 전문의', 15, '서울'),
--   ('이영희', '피부과', '미용피부과', (SELECT id FROM hospitals WHERE name = '삼성서울병원' LIMIT 1), '피부 미용 전문의', 10, '서울');
