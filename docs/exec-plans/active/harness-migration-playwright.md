# harness-migration-playwright.md

## Title
하네스 중심 저장소 구조 마이그레이션과 Playwright 검증 도입

## Goal
현재 작은 Next.js 앱 구조를 하네스 프로그래밍에 더 적합한 형태로 재편하고, `test` 명령에서 실제 브라우저 검증이 수행되도록 Playwright를 도입한다.

## Why this matters
- 현재 앱 코드는 루트 `app/`, `components/`, `lib/`에 흩어져 있고, 하네스 운영 자산은 `harness/`와 `data/harness/`로 나뉘어 있어 source of truth가 이중화돼 있다.
- 하네스 프로그래밍에서는 문서, 시나리오, 실제 화면 검증이 같은 구조 안에서 반복 가능해야 한다.
- 현재 `test`는 메타데이터 검증만 수행하므로, 실제 라우트 렌더링과 핵심 UI 가시성을 브라우저에서 확인하지 못한다.

## Target structure
- `src/app/*`
- `src/features/landing/*`
- `src/features/harness/*`
- `src/lib/*`
- `harness/repository-harness.json`
- `harness/scenarios/*`
- `tests/e2e/*`
- `tests/visual/*`
- `playwright.config.ts`

## Scope
- 앱 코드를 `src/` 아래로 이동
- 랜딩/하네스 화면 코드를 feature 단위로 정리
- `data/harness/scenarios.json`를 루트 `harness/config/repository-harness.json`로 이전하고 참조 경로 통합
- `/harness` 화면이 루트 하네스 문서를 직접 읽도록 수정
- Playwright 설정, e2e/visual 테스트, 스크린샷 출력 경로 추가
- `test`에 Playwright 실행 포함
- 관련 문서, README, execution log 업데이트

## Out of scope
- 추천 엔진 구현
- 저장 기능 구현
- 로그인/DB 연동
- 추천 점수 규칙 변경

## Test strategy
### Automated checks
- `npm run harness:repo`
- `npm run harness:scenarios`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

### Playwright checks
- `/` 랜딩 핵심 CTA, 예시 전술 보드, 쿼터 탭 노출 확인
- `/harness` 진입과 시나리오 카드 노출 확인
- 데스크톱 랜딩 스크린샷 1장 생성
- 모바일 랜딩 스크린샷 1장 생성

### Manual review
- 새 구조가 하네스 자산과 앱 코드를 분리해 읽기 쉬운지 확인
- `/harness`가 루트 하네스 문서와 같은 시나리오를 보여주는지 확인
- 스크린샷 기준으로 정보 위계, CTA 가시성, 전술 보드 가독성 검토

## Exit criteria
- 앱 코드가 `src/` 기준으로 정리된다.
- 루트 하네스 문서와 앱 하네스 화면의 source of truth가 통합된다.
- `npm run test`에서 Playwright 브라우저 검증이 수행된다.
- 랜딩 데스크톱/모바일 스크린샷이 생성된다.
- execution log에 구조 변경과 제안 사항이 기록된다.
