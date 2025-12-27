[프로젝트 개요]
 - 목적: 지역별/진료과별 의사 검색 및 상세 정보 제공 서비스
 - 이름: Upper

[기술 스택]
 - Frontend: Next.js (App Router 권장), React, TypeScript, Tailwind CSS, Lucide React (아이콘)
 - Backend/Database: Supabase (Auth, PostgreSQL)
 - File: Supabase Storage

[핵심 기능]
- 의사 목록 필터링 (진료 분야, 세부 시술/치료 분야, 지역, 경력 등)
- 의사 상세 페이지 (사진, 소속 병원, 소속 병원 위치/연락처, 프로필, 진료 시간 등)
- 검색 기능 (지역, 이름, 진료 분야, 세부 시술/치료 분야 등으로 검색)
- 관리자 페이지: 의사/병원 데이터 등록/수정

[DB 테이블]
- doctor: 이름, 전공, 병원 위치, 사진 URL, 소개글 등
- hospital: 이름, 주소, 전화번호 등