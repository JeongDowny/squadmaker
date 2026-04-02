# service-intro-landing.md

## Title
서비스 소개 랜딩페이지 구현

## Goal
축구 동호회 회장 또는 감독이 첫 방문 시 서비스의 문제 정의, 핵심 가치, 사용 흐름, 결과 화면 예시를 빠르게 이해할 수 있는 루트 랜딩페이지를 구현한다.

## Why this matters
- 현재 저장소는 하네스 기반 구조는 있지만, 제품을 처음 접하는 사용자를 위한 서비스 소개 랜딩 경험은 아직 약하다.
- `new-user-onboarding.md` 기준으로 첫 화면에서 서비스 목적과 첫 결과 경험을 빠르게 이해시켜야 한다.
- 실제 추천 엔진 구현 전에도 예시 팀 체험과 결과 화면의 방향을 static mock으로 먼저 고정해 둘 필요가 있다.

## Scope
이번 작업에 포함:
- `/` 랜딩페이지 재구성
- 서비스 예시 중심의 랜딩 섹션 정리
- 쿼터 탭 전환이 가능한 전술 보드 mock 구현
- 전체 선수 출전 요약이 포함된 예시 패널 구현
- 기본 CTA 구성

이번 작업에 포함하지 않음:
- 추천 엔진 실제 구현
- 저장 기능 구현
- 로그인 기능 구현
- DB 연동
- 규칙 문서 수정

## Source of truth
- `AGENTS.md`
- `docs/PRODUCT_SENSE.md`
- `docs/ARCHITECTURE.md`
- `docs/DOMAIN.md`
- `docs/DESIGN.md`
- `docs/FRONTEND.md`
- `docs/product-specs/new-user-onboarding.md`
- `docs/product-specs/active/mvp-build.md`

## UI direction
- 전체 인상은 깔끔한 SaaS 톤을 유지한다.
- 예시 결과 섹션은 잔디 느낌을 가미한 전술 보드 스타일로 구현한다.
- 정보 우선순위는 필드 배치, 출전 쿼터 수, 평균 점수 순서를 따른다.
- 모바일에서는 세로 흐름을 기본으로 유지하고, 데스크톱에서는 설명 영역과 mock 영역을 분리한다.

## Content requirements
- 서비스 이름은 `SqaudMaker` 표기를 따른다.
- 랜딩은 서비스 예시와 사용 흐름 중심으로 정리하고 문제/가치 나열 섹션은 축소한다.
- 사용 흐름에 경기 생성, 선수 입력/선택, 포메이션 선택, 추천안 확인, 수정 및 저장을 포함한다.
- 예시 화면에는 1Q~4Q 탭, 추천안 정보, 전술 보드형 필드, 선수 배치, 전체 선수 출전 쿼터 요약을 포함한다.
- 전술 보드는 공격수가 위쪽, 골키퍼가 아래쪽을 향하는 방향으로 보이게 한다.

## Test strategy
### Automated checks
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

### Manual checks
- 루트 랜딩이 서비스 예시 중심으로 정리되어 보인다.
- 예시 섹션에서 1Q~4Q 탭 전환이 가능하다.
- 각 쿼터마다 포메이션과 필드 배치가 다르게 보인다.
- 예시 섹션에서 추천안 정보와 전체 선수 출전 쿼터 요약이 보인다.
- 기본 CTA가 랜딩 상단과 하단에서 노출된다.
- 모바일 폭에서 섹션 순서가 무너지지 않고 읽을 수 있다.
- 데스크톱 폭에서 예시 보드와 설명 영역이 과도하게 겹치지 않는다.

### Screenshot verification checklist
- 데스크톱 viewport 기준 `/` 화면 스크린샷 1장 생성
- 모바일 viewport 기준 `/` 화면 스크린샷 1장 생성
- 생성한 스크린샷을 기준으로 `docs/DESIGN.md`와 비교 검토
- 정보 위계, CTA 가시성, 전술 보드 가독성 확인
- 문제 발견 시 최소 1회 이상 수정 반복 후 다시 스크린샷 확인

## Exit criteria
- `/`가 서비스 소개 랜딩 역할을 수행한다.
- 랜딩에 static mock 기반 예시 결과 화면이 포함된다.
- lint, typecheck, test, build가 통과한다.
- execution log가 기록된다.
