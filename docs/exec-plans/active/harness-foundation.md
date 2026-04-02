# harness-foundation.md

## Title
repository-level / application-level harness foundation

## Goal
이 저장소에 문서 기준과 코드 기준을 동시에 만족하는 하네스 구조를 추가한다.

핵심 목표:
- 저장소 레벨에서 하네스 시나리오와 검증 규칙을 한 곳에서 관리한다.
- 애플리케이션 레벨에서 사람이 직접 확인할 수 있는 `/harness` 화면을 제공한다.
- 제품 문서의 핵심 규칙을 향후 구현 작업이 반복적으로 검증할 수 있는 형태로 정리한다.
- 구현 단위를 handoff 가능한 계약 형태로 쪼갠다.

## Why this matters
현재 저장소는 기본 Next.js 초기 상태에 가깝고, 제품 문서는 이미 비교적 상세하다.

이 상태에서는 다음 문제가 있다.
- 문서에 있는 제품 규칙이 코드 구조에 아직 연결되어 있지 않다.
- 어떤 시나리오를 기준으로 구현/검증해야 하는지 저장소 차원에서 드러나지 않는다.
- UI 작업 시 사람이 확인할 수 있는 기준 화면이 없다.

하네스 구조를 먼저 두면 이후 MVP 구현에서 문서-시나리오-검증 루프를 빠르게 반복할 수 있다.

## Scope
이번 작업에 포함:
- `docs/exec-plans/active/` 구조 추가 및 현재 작업 계획 문서화
- 하네스 시나리오 JSON 정의
- 저장소 레벨 검증 스크립트 추가
- `/harness` 화면 추가
- 랜딩 페이지를 제품/하네스 진입점으로 교체
- 관련 문서 및 execution log 업데이트

이번 작업에 포함하지 않음:
- 실제 추천 엔진 구현
- 실제 저장 기능 구현
- 실제 선수 입력 폼 구현
- 자동 브라우저 E2E 도입

## Decisions
### Repository-level harness
- 단일 JSON 문서를 source of truth로 둔다.
- 검증 스크립트는 다음을 확인한다.
  - 필수 top-level 필드 존재
  - scenario id 중복 없음
  - linked docs 경로 실존
  - linked exec-plan 경로 실존
  - 명시된 npm command가 `package.json` 스크립트와 연결되는지
  - 포메이션 값이 MVP 지원 목록 안에 있는지
  - stage / scenario type / handoff 필드가 허용된 값인지
  - handoff 의존성, 산출물, ready 조건이 비어 있지 않은지
  - scenario priority / owner / status / expected results / verification target이 비어 있지 않은지
  - existing verification target 경로가 실제로 존재하는지
  - CI workflow와 required command 목록이 일치하는지

### Implementation metadata
- 각 시나리오는 아래 운영 메타데이터를 가져야 한다.
  - `priority`
  - `owner`
  - `status`
  - `expectedResults`
  - `verification`
- 목적은 "무엇부터 구현할지", "누가 맡는지", "무엇이 완료 기준인지", "어디를 검증해야 하는지"를 동시에 보이게 하는 것이다.

### Handoff contract
- 각 시나리오는 구현자가 다음 작업자에게 넘길 수 있는 최소 handoff 정보를 포함한다.
- 최소 필드:
  - `dependsOn`
  - `deliverables`
  - `readyWhen`
  - `nextWorkstream`
- 목적은 "무엇이 끝났는지"와 "다음 작업이 무엇을 전제로 시작하는지"를 명시하는 것이다.

### Application-level harness
- `/harness`는 서버 컴포넌트 기반 read-only 대시보드로 구현한다.
- 시나리오별 입력, 기대 동작, 수동 체크리스트를 카드 형태로 보여준다.
- 모바일/데스크톱 검증 항목을 함께 노출한다.
- happy path 뿐 아니라 warning / failure path도 함께 노출한다.

## Test strategy
구현 전에 아래 검증 전략을 기준으로 진행한다.

### Automated checks
- `npm run lint`
- `npm run typecheck`
- `npm run test:harness`
- `npm run build`

### Harness-specific checks
- `npm run harness:repo`가 성공해야 한다.
- `/harness`가 TypeScript 오류 없이 렌더 가능한 구조여야 한다.
- 하네스 문서가 "기능 테스트 전체"를 의미하지 않는다는 점을 명시해야 한다.

### Manual checks
- 랜딩 페이지에서 `/harness` 진입 가능
- `/harness`에서 repository/application harness 개요 확인 가능
- 각 시나리오 카드에 입력/기대 결과/수동 체크리스트가 모두 노출됨
- 각 시나리오 카드에 handoff 정보가 노출됨
- 각 시나리오 카드에 priority / owner / status / expected results / verification target이 노출됨
- 모바일 폭에서도 카드가 한 열로 무너지지 않고 읽을 수 있음

### Screenshot verification checklist
- 데스크톱 viewport 기준 `/` 또는 해당 UI 변경 화면 스크린샷 1장 생성
- 모바일 viewport 기준 `/` 또는 해당 UI 변경 화면 스크린샷 1장 생성
- 생성한 스크린샷을 기준으로 `docs/DESIGN.md`와 비교 검토
- 정보 위계, CTA 가시성, 전술 보드 가독성 확인
- 문제 발견 시 최소 1회 이상 수정 반복 후 다시 스크린샷 확인

## Risks
- 실제 기능이 아직 없는 상태라 application harness가 문서 대시보드처럼 보일 수 있다.
- 하네스 데이터가 문서와 따로 놀면 유지 비용이 생길 수 있다.
- validator가 약하면 하네스가 "읽기 좋은 문서" 이상으로 작동하지 못한다.

## Mitigation
- linked docs를 하네스 시나리오에 직접 연결한다.
- repository harness에서 문서 경로와 스크립트 연결을 강제한다.
- 향후 실제 기능 구현 시 같은 시나리오 데이터를 기반으로 확장 가능하게 둔다.
- failure path와 handoff 계약을 하네스 스키마에 포함한다.

## Exit criteria
- `docs/exec-plans/active/harness-foundation.md`가 존재한다.
- 하네스 JSON과 검증 스크립트가 추가된다.
- `/harness` 화면이 추가된다.
- README 및 관련 문서가 하네스 구조를 설명한다.
- lint, typecheck, build, harness test 결과가 기록된다.
- CI gate workflow가 존재하고 하네스 명령 집합을 실행한다.
