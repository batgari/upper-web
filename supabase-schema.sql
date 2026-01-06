-- Upper Database Schema

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin'))
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
  specialty TEXT NOT NULL,
  sub_specialty TEXT,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  photo_url TEXT,
  bio TEXT,
  experience_years INTEGER,
  available_hours TEXT
);

-- 기존 테이블에서 region 컬럼 제거 (마이그레이션)
ALTER TABLE doctors DROP COLUMN IF EXISTS region;

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_region ON hospitals(region);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- users 테이블 정책
-- 모든 사용자가 자신의 프로필을 읽을 수 있음
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- 사용자가 자신의 프로필을 업데이트할 수 있음 (role은 변경 불가)
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- hospitals 테이블 정책
-- 모든 사용자가 읽기 가능
CREATE POLICY "Enable read access for all users" ON hospitals
  FOR SELECT USING (true);

-- 어드민만 생성/수정/삭제 가능
CREATE POLICY "Enable insert for admins only" ON hospitals
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable update for admins only" ON hospitals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable delete for admins only" ON hospitals
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- doctors 테이블 정책
-- 모든 사용자가 읽기 가능
CREATE POLICY "Enable read access for all users" ON doctors
  FOR SELECT USING (true);

-- 어드민만 생성/수정/삭제 가능
CREATE POLICY "Enable insert for admins only" ON doctors
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable update for admins only" ON doctors
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable delete for admins only" ON doctors
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 사용자 자동 생성 트리거
-- 새로운 사용자가 가입하면 자동으로 users 테이블에 추가
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 샘플 데이터 (선택사항)
-- INSERT INTO hospitals (name, address, phone, region) VALUES
--   ('서울대학교병원', '서울특별시 종로구 대학로 101', '02-2072-2114', '서울'),
--   ('삼성서울병원', '서울특별시 강남구 일원로 81', '02-3410-2114', '서울');

-- INSERT INTO doctors (name, specialty, sub_specialty, hospital_id, bio, experience_years) VALUES
--   ('김철수', '내과', '심장내과', (SELECT id FROM hospitals WHERE name = '서울대학교병원' LIMIT 1), '심장 질환 전문의', 15),
--   ('이영희', '피부과', '미용피부과', (SELECT id FROM hospitals WHERE name = '삼성서울병원' LIMIT 1), '피부 미용 전문의', 10);
