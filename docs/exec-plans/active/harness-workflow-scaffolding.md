# harness-workflow-scaffolding.md

## Title
하네스 실행-검증 루프 스캐폴딩

## Goal
현재 `app/`, `components/`, `lib/` 구조는 유지하면서, 별도 `harness/`, `.codex/`, `tests/`, `scripts/` 계층을 추가해 실행과 검증을 반복할 수 있는 운영 뼈대를 만든다.

## Scope
- `harness/scenarios`, `fixtures`, `evals`, `reports` 추가
- `.codex/agents`, `.codex/skills`, `.codex/config.toml` 추가
- `tests/unit`, `integration`, `e2e`, `visual` 스캐폴딩 추가
- Node 기반 하네스 스크립트 추가
- 제한된 실행 환경에서도 바로 돌 수 있도록 package script를 `node` 실행 경로로 연결
- README와 docs index에 새 구조와 명령 반영

## Out of scope
- `src/` 전체 마이그레이션
- 실제 Playwright 또는 브라우저 자동화 도입
- 추천 엔진 구현

## Test strategy
- `npm run harness:repo`
- `npm run harness:scenarios`
- `npm run test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Exit criteria
- 새 하네스 구조가 저장소에 존재한다.
- 실행 가능한 스크립트가 package scripts에 연결된다.
- README와 docs가 새 운영 구조를 설명한다.
- execution log가 기록된다.
