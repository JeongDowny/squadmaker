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
npm run test
```

## Harness structure

- `data/harness/scenarios.json`
  - 제품 시나리오, priority/owner/status, expected results, verification target, linked docs source of truth
- `scripts/validate-harness.mjs`
  - 저장소 레벨 하네스 검증
- `app/harness/page.tsx`
  - 앱 레벨 하네스 대시보드
- `docs/exec-plans/active/harness-foundation.md`
  - 현재 하네스 도입 작업 계획과 검증 전략
- `.github/workflows/harness-ci.yml`
  - 하네스 명령 집합을 실행하는 CI gate

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
