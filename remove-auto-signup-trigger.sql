-- 자동 회원가입 트리거 제거
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 트리거 제거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 함수도 제거 (선택사항, 필요시 주석 해제)
-- DROP FUNCTION IF EXISTS public.handle_new_user();

-- 확인: 트리거가 제거되었는지 확인
SELECT
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
-- 결과가 없으면 성공적으로 제거됨
