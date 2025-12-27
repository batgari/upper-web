# Upper - 의사 검색 서비스

지역별, 진료과별 의사 검색 및 상세 정보 제공 서비스

## 프로젝트 개요

Upper는 사용자가 지역과 진료과에 따라 의사를 쉽게 검색하고, 상세 정보를 확인할 수 있는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend/Database**: Supabase (Auth, PostgreSQL)
- **Storage**: Supabase Storage

## 핵심 기능

- 의사 목록 필터링 (진료 분야, 세부 시술/치료 분야, 지역, 경력 등)
- 의사 상세 페이지 (사진, 소속 병원, 소속 병원 위치/연락처, 프로필, 진료 시간 등)
- 검색 기능 (지역, 이름, 진료 분야, 세부 시술/치료 분야 등으로 검색)
- 관리자 페이지: 의사/병원 데이터 등록/수정

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `.env.local` 파일에 Supabase 정보 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Supabase SQL Editor에서 `supabase-schema.sql` 파일 실행:
   - Supabase Dashboard > SQL Editor로 이동
   - `supabase-schema.sql` 파일 내용을 복사하여 실행

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```
upper/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── doctors/           # 의사 검색 페이지
│   │   ├── page.tsx
│   │   └── [id]/          # 의사 상세 페이지 (추후 구현)
│   └── admin/             # 관리자 페이지
│       └── page.tsx
├── components/            # 재사용 가능한 컴포넌트
│   └── Navbar.tsx
├── lib/                   # 유틸리티 함수 및 설정
│   └── supabase.ts        # Supabase 클라이언트
├── types/                 # TypeScript 타입 정의
│   ├── database.ts        # Supabase 데이터베이스 타입
│   └── index.ts           # 공통 타입
├── supabase-schema.sql    # 데이터베이스 스키마
└── plan.md                # 프로젝트 계획서
```

## 데이터베이스 스키마

### hospitals 테이블
- `id`: UUID (Primary Key)
- `name`: 병원 이름
- `address`: 주소
- `phone`: 전화번호
- `region`: 지역

### doctors 테이블
- `id`: UUID (Primary Key)
- `name`: 의사 이름
- `specialty`: 전공 (진료과)
- `sub_specialty`: 세부 전공
- `hospital_id`: 소속 병원 ID (Foreign Key)
- `photo_url`: 프로필 사진 URL
- `bio`: 소개글
- `experience_years`: 경력 (년)
- `region`: 지역
- `available_hours`: 진료 시간

## 다음 단계

- [ ] 의사 상세 페이지 구현
- [ ] Supabase 데이터 연동
- [ ] 관리자 페이지 CRUD 기능 구현
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 인증 시스템 추가
- [ ] 검색 및 필터링 기능 완성
- [ ] 반응형 디자인 개선

## 라이선스

MIT
