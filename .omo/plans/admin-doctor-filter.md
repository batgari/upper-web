# 어드민 의사 목록 페이지 필터링 기능 추가

## TL;DR
> Summary:      어드민 의사 관리 페이지에 이름 검색, 지역 필터, 전문 분야 필터를 추가한다. `DoctorRepository.search()`가 이미 존재하므로 UI 레이어만 구현하면 된다.
> Deliverables:
> - `app/admin/doctor/page.tsx`에 검색/필터 UI 추가
> - 필터 상태에 따라 `DoctorRepository.search()` 또는 `fetchAll()` 호출 분기
> Effort: Quick
> Risk: Low - 기존 `search()` 메서드 재사용, 단일 파일 수정

## Scope
### Must have
- 이름 텍스트 검색 입력창
- 지역 드롭다운 필터 (`hospital.region` 기반)
- 전문 분야 드롭다운 필터 (`CareArea` / `CareCategory` 기반)
- 필터 초기화 버튼
- 필터 적용 시 결과 건수 표시

### Must NOT have
- URL 쿼리 파라미터 동기화 (어드민 페이지는 불필요)
- 페이지네이션 (현재 없음, 이번 범위 외)
- 공개 의사 목록(`app/doctor/page.tsx`) 수정

## Verification strategy
- Test decision: none (순수 UI 상태 변경, 기존 repository 메서드 검증 불필요)
- QA policy: 브라우저에서 각 필터 시나리오 직접 확인
- Evidence: `.omo/evidence/task-1-admin-doctor-filter.md` (QA 체크리스트)

## Execution strategy
### Parallel execution waves

Wave 1 (no dependencies):
- Task 1: 어드민 의사 목록 페이지에 필터 UI 및 로직 추가

Wave 2 (after Wave 1):
- Task 2: QA 시나리오 실행 및 증거 파일 작성

Critical path: Task 1 → Task 2

### Dependency matrix
| Task | Depends on | Blocks | Can parallelize with |
|------|------------|--------|----------------------|
| 1    | none       | 2      | -                    |
| 2    | 1          | -      | -                    |

## Todos

- [ ] 1. 어드민 의사 목록 페이지 필터 UI 및 로직 구현

  What to do:
  1. `app/admin/doctor/page.tsx`에 필터 상태 추가
     - `searchQuery: string` (이름 검색)
     - `selectedRegion: string` (지역 필터, '' = 전체)
     - `selectedCareArea: string` (전문 분야 필터, '' = 전체)
  2. `fetchDoctors` 함수를 필터 상태 기반으로 수정
     - 모든 필터가 비어 있으면 `DoctorRepository.fetchAll()` 호출
     - 하나라도 값이 있으면 `DoctorRepository.search({ region, careArea, query })` 호출
  3. 지역 목록을 `hospitals` 상태에서 동적으로 추출 (`[...new Set(hospitals.map(h => h.region))]`)
  4. 전문 분야 목록은 `CareArea.getAll()`과 `CareCategory.getAll()` 사용 (단, 간단하게 `CareArea.getAll()`만 사용해도 무방)
  5. 필터 UI를 헤더 아래, 테이블 위에 배치
     - 검색창: `<input type="text" placeholder="의사 이름 검색..." />`
     - 지역 드롭다운: `<select>` with `<option value="">전체 지역</option>`
     - 전문 분야 드롭다운: `<select>` with `<option value="">전체 분야</option>`
     - 초기화 버튼: 필터가 하나라도 적용됐을 때만 표시
  6. 결과 건수를 필터 UI 아래에 `{doctors.length}명의 의사`로 표시
  7. useEffect 의존성 배열에 `[searchQuery, selectedRegion, selectedCareArea]` 추가

  Must NOT do:
  - `app/doctor/page.tsx` (공개 페이지) 수정 금지
  - `DoctorRepository`에 새 메서드 추가 금지 (기존 `search()` 충분)
  - URL 파라미터 동기화 금지
  - 디바운스 추가 금지 (어드민 사용량 적어 불필요)

  Parallelization: Can parallel: NO | Wave 1 | Blocks: [2] | Blocked by: []

  References:
  - Pattern: `app/admin/doctor/page.tsx:1-248` - 현재 어드민 의사 목록 구조 (수정 대상)
  - Pattern: `app/doctor/page.tsx:14-79` - 공개 의사 목록의 필터 상태/로직 참고
  - API/Type: `app/admin/doctor/repository/DoctorRepository.ts:19-45` - `search(filters)` 구현
  - API/Type: `app/admin/doctor/model/DoctorTypes.ts:9-13` - `DoctorSearchFilters` 타입
  - API/Type: `app/common/model/CareArea.ts` - `CareArea.getAll()`, `CareArea.getLabel()`
  - API/Type: `app/admin/hospital/repository/HospitalRepository.ts` - `fetchAll()` (지역 추출용)
  - Pattern: `app/admin/doctor/page.tsx:107-118` - 헤더 영역 (필터 UI 삽입 위치)

  Acceptance criteria:
  - [ ] 이름 검색창에 텍스트 입력 시 해당 이름이 포함된 의사만 표시됨
  - [ ] 지역 드롭다운 변경 시 해당 지역 병원 소속 의사만 표시됨
  - [ ] 전문 분야 드롭다운 변경 시 해당 분야 의사만 표시됨
  - [ ] 복합 필터(이름 + 지역, 지역 + 분야 등) 조합이 정상 동작함
  - [ ] 초기화 버튼 클릭 시 모든 필터가 초기화되고 전체 목록이 표시됨
  - [ ] 필터 결과 0건일 때 빈 상태 메시지("등록된 의사가 없습니다.") 표시됨
  - [ ] 데스크톱 테이블 뷰, 모바일 카드 뷰 모두 정상 동작함

  QA scenarios:
  ```
  Scenario: 이름으로 의사 검색
    Tool:     browser (Chrome)
    Steps:    /admin/doctor 접속 → 검색창에 존재하는 의사 이름 일부 입력
    Expected: 입력한 문자열이 포함된 의사만 테이블/카드에 표시됨
    Evidence: .omo/evidence/task-1-admin-doctor-filter.md

  Scenario: 지역 필터 적용
    Tool:     browser (Chrome)
    Steps:    /admin/doctor 접속 → 지역 드롭다운에서 특정 지역 선택
    Expected: 해당 지역 병원 소속 의사만 표시됨
    Evidence: .omo/evidence/task-1-admin-doctor-filter.md

  Scenario: 전문 분야 필터 적용
    Tool:     browser (Chrome)
    Steps:    /admin/doctor 접속 → 전문 분야 드롭다운에서 항목 선택
    Expected: 해당 전문 분야를 가진 의사만 표시됨
    Evidence: .omo/evidence/task-1-admin-doctor-filter.md

  Scenario: 결과 없는 필터 조합
    Tool:     browser (Chrome)
    Steps:    존재하지 않는 이름 입력 또는 의사가 없는 지역/분야 선택
    Expected: "등록된 의사가 없습니다." 메시지 표시, 에러 없음
    Evidence: .omo/evidence/task-1-admin-doctor-filter.md

  Scenario: 필터 초기화
    Tool:     browser (Chrome)
    Steps:    필터 적용 후 → 초기화 버튼 클릭
    Expected: 모든 필터가 초기화되고 전체 의사 목록이 다시 표시됨
    Evidence: .omo/evidence/task-1-admin-doctor-filter.md
  ```

  Commit: YES | Message: `feat(admin/doctor): 의사 목록 필터링 기능 추가` | Files: [app/admin/doctor/page.tsx]

---

- [ ] 2. QA 시나리오 실행 및 증거 파일 작성

  What to do:
  1. Task 1 구현 완료 후 개발 서버 실행 (`npm run dev`)
  2. 위의 QA 시나리오 5개를 직접 실행
  3. 결과를 `.omo/evidence/task-1-admin-doctor-filter.md`에 기록

  Must NOT do:
  - 실패한 시나리오를 PASS로 기록 금지

  Parallelization: Can parallel: NO | Wave 2 | Blocks: [] | Blocked by: [1]

  References:
  - Task 1의 구현 결과물

  Acceptance criteria:
  - [ ] `.omo/evidence/task-1-admin-doctor-filter.md` 파일 존재
  - [ ] 5개 QA 시나리오 모두 PASS 기록

  QA scenarios:
  ```
  Scenario: 증거 파일 존재 확인
    Tool:     bash
    Steps:    ls .omo/evidence/task-1-admin-doctor-filter.md
    Expected: 파일이 존재함 (exit code 0)
    Evidence: .omo/evidence/task-1-admin-doctor-filter.md
  ```

  Commit: NO

---

## Final verification wave (MANDATORY)
- [ ] F1. Plan compliance audit - Task 1 완료, 모든 acceptance criteria 충족
- [ ] F2. Code quality review - TypeScript 타입 오류 없음, 기존 코드 스타일 유지
- [ ] F3. Real manual QA - 5개 시나리오 모두 PASS, evidence 파일 존재
- [ ] F4. Scope fidelity - `app/doctor/page.tsx` 미수정, repository 변경 없음

## Commit strategy
- Task 1 완료 후 단일 커밋: `feat(admin/doctor): 의사 목록 필터링 기능 추가`
- Conventional Commits 형식 준수
- Plan: `.omo/plans/admin-doctor-filter.md`

## Success criteria
- Must-Have 3가지(이름 검색, 지역 필터, 전문 분야 필터) 모두 동작
- QA 시나리오 5개 PASS
- 수정 파일: `app/admin/doctor/page.tsx` 1개만
