# Squadmaker

축구 동호회 회장 또는 감독이 경기 전 쿼터별 선발 배치를 빠르게 설계하고 수정할 수 있도록 돕는 웹 서비스다.

현재 저장소는 MVP 구현 전 단계의 foundation 작업으로, 문서 기준과 제품 시나리오를 묶는 두 가지 하네스를 포함한다.

- `repository-level harness`
  - 하네스 시나리오 JSON
  - 문서/명령/포메이션 검증 스크립트
- `application-level harness`
  - `/harness` 대시보드
  - 주요 제품 시나리오와 수동 검증 체크리스트

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run harness:repo
npm run harness:scenarios
npm run harness:seed
npm run harness:prompt-log -- --pr PR-001 --title "prompt log title"
npm run harness:capture
npm run harness:report
npm run test:e2e
npm run test:visual
npm run test
```

## Harness structure

- `src/app/`
  - Next.js App Router 엔트리와 레이아웃
- `src/features/landing/*`
  - 서비스 랜딩과 전술 보드 mock
- `src/features/harness/*`
  - `/harness` 대시보드와 서버용 하네스 로더
- `harness/config/repository-harness.json`
  - repository/application harness 공용 source of truth
- `harness/`
  - 실행용 시나리오, fixture, eval, report 구조
- `scripts/validate.mjs`
  - repository harness manifest와 `harness/scenarios` 검증을 함께 수행
- `scripts/seed-harness-data.mjs`
  - fixture 기반 seed summary 생성
- `scripts/scaffold-prompt-log.mjs`
  - 날짜별 prompt log와 PR 섹션 템플릿 생성
- `scripts/summarize-report.mjs`
  - latest report와 생성된 스크린샷 요약
- `playwright.config.ts`
  - 랜딩과 하네스 라우트의 브라우저 검증 설정
- `tests/e2e/*`
  - 핵심 라우트/콘텐츠 가시성 검증
- `tests/visual/*`
  - 데스크톱/모바일 스크린샷 생성
- `src/app/harness/page.tsx`
  - 앱 레벨 하네스 대시보드
- `docs/exec-plans/active/harness-foundation.md`
  - 현재 하네스 도입 작업 계획과 검증 전략
- `docs/exec-plans/active/harness-workflow-scaffolding.md`
  - 실행-검증 루프 스캐폴딩 계획
- `docs/exec-plans/active/harness-migration-playwright.md`
  - `src` 마이그레이션과 Playwright 도입 계획
- `docs/exec-plans/active/prompt-log-scaffolding.md`
  - execution log와 연결되는 prompt log 운영 계획
- `.github/workflows/harness-ci.yml`
  - 하네스 명령 집합을 실행하는 CI gate
- `.codex/`
  - 하네스 루프용 에이전트와 스킬 설정

## Getting started

```bash
npm run dev
```

브라우저에서 아래 경로를 확인한다.

- `http://localhost:3000/`
- `http://localhost:3000/harness`

## Source documents

작업 전 우선순위는 아래 문서를 따른다.

- `AGENTS.md`
- `docs/PRODUCT_SENSE.md`
- `docs/ARCHITECTURE.md`
- `docs/exec-plans/active/*`
- `docs/FRONTEND.md`
- `docs/DESIGN.md`

## Notes

- 추천 계산은 브라우저에서 수행한다.
- 저장 정책은 비로그인 1경기, 로그인 3경기다.
- 저장 대상은 추천안이 아니라 최종 수정본이다.
- 현재는 앱 코드를 `src/` 아래에 두고, 루트 `harness/`에서 실행-검증 자산을 관리한다.
- 비사소한 변경은 `docs/execution-logs/`와 `docs/prompt-logs/`를 함께 남긴다.
