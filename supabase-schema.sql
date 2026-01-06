-- Upper Database Schema

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
  specialty TEXT NOT NULL,
  sub_specialty TEXT,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  photo_url TEXT,
  bio TEXT,
  experience_years INTEGER,
  available_hours TEXT
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_region ON hospitals(region);

-- 권한 부여
GRANT ALL ON users TO anon, authenticated, service_role;
GRANT ALL ON hospitals TO anon, authenticated, service_role;
GRANT ALL ON doctors TO anon, authenticated, service_role;

-- 사용자 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email), 'user');
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 관리자 계정 설정 (이메일을 본인 계정으로 변경하세요)
-- INSERT INTO users (id, email, name, role)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'Admin'), 'admin'
-- FROM auth.users
-- WHERE email = 'your-email@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
