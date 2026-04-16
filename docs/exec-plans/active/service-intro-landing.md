# service-intro-landing.md

## Title
서비스 소개 랜딩페이지 구현

## Goal
축구 동호회 회장 또는 감독이 첫 방문 시 서비스 대상, 핵심 문제, 결과 화면 예시를 빠르게 이해할 수 있는 정돈된 SaaS 스타일 루트 랜딩페이지를 구현한다.

## Why this matters
- 현재 랜딩은 예시 화면 자산은 갖고 있지만, 첫 화면에서 서비스 대상과 핵심 문제를 이해시키는 구조가 약하다.
- `new-user-onboarding.md` 기준으로 첫 방문 사용자는 설명을 길게 읽기보다 무엇을 해결하는 서비스인지와 첫 결과 화면을 빠르게 이해해야 한다.
- 실제 추천 엔진 구현 전에도 결과 화면 showcase를 먼저 정돈해 두면 이후 입력, 추천, 저장 흐름을 연결하기 쉬워진다.

## Scope
이번 작업에 포함:
- `/` 랜딩페이지 재구성
- hero / 문제 정의 / product preview / 사용 흐름 / CTA 섹션 리팩토링
- 쿼터 탭 전환이 가능한 전술 보드 mock 유지 및 showcase형 압축
- 출전 요약 패널을 랜딩용 showcase 밀도에 맞게 재구성
- 중간 또는 하단 CTA를 더 자연스럽고 분명한 구조로 정리

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
- 전체 인상은 정돈된 SaaS 톤을 유지하되, 필드 예시 영역에만 잔디 느낌을 남긴다.
- 정보 리듬은 문제 인식 -> 결과 화면 preview -> 핵심 확인 포인트 -> 사용 흐름 -> CTA 순서를 따른다.
- 결과 예시는 실제 앱 전체를 길게 보여주기보다 핵심 화면 한두 개만 선별해 강조한다.
- 모바일에서는 세로 흐름을 기본으로 유지하고, 데스크톱에서는 hero와 preview의 스캔성이 먼저 살아야 한다.
- hero에서는 대상 사용자, 해결 문제, 핵심 가치, 시작 CTA가 첫 화면 안에서 더 빨리 읽혀야 한다.
- CTA는 하단에만 두지 않고 preview 흐름 중간에도 자연스럽게 드러나야 한다.

## Keep / change analysis
유지할 요소:
- `SquadMaker` 제품명
- 전술 보드 느낌의 서비스 예시 UI
- 쿼터 탭, 추천안, 출전 쿼터 요약이라는 제품 아이덴티티
- SaaS 기반의 밝은 톤과 잔디색 포인트 조합

바꿀 요소:
- 예시만 먼저 던지는 hero를 서비스 대상과 문제를 더 빨리 읽히는 hero로 수정
- preview가 긴 앱 dump처럼 보이는 흐름을 landing showcase 구조로 압축
- 사용 흐름 섹션을 짧고 모듈형 카드 구조로 재정리
- CTA를 더 자연스럽고 분명한 전환 섹션으로 재배치

## Content requirements
- 서비스 이름은 `SquadMaker` 표기를 따른다.
- 첫 화면에서 서비스 대상과 핵심 문제를 빠르게 이해할 수 있어야 한다.
- hero 바로 아래에서 product preview가 이어져야 한다.
- 사용 흐름에는 경기 생성, 선수 입력/선택, 포메이션 선택, 추천안 확인, 수정 및 저장을 짧은 카드 구조로 포함한다.
- 예시 화면에는 1Q~4Q 탭, 공평성 우선 추천안 정보, 전술 보드형 필드, 선수 배치, 출전 쿼터 요약을 포함한다.
- 출전 요약은 제품 아이덴티티는 유지하되 랜딩 showcase로서 과도하게 길어지지 않게 압축한다.
- 전술 보드는 공격수가 위쪽, 골키퍼가 아래쪽을 향하는 방향으로 보이게 한다.
- CTA는 중간 또는 하단에서 더 분명하게 읽히게 두되, 현재 기능 연결은 mock 상태로 유지한다.

## Test strategy
### Automated checks
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

### Manual checks
- 루트 랜딩에서 서비스 대상과 핵심 문제가 첫 화면 안에서 빠르게 읽힌다.
- hero에서 핵심 가치와 `/matches/new` 진입 CTA가 바로 보인다.
- hero 바로 아래에서 product preview가 분명하게 이어진다.
- 예시 섹션에서 1Q~4Q 탭 전환이 가능하다.
- 각 쿼터마다 포메이션과 필드 배치가 다르게 보인다.
- 예시 섹션이 긴 앱 dump보다 핵심 결과 showcase처럼 보인다.
- 예시 섹션에서 공평성 우선 추천안 정보와 출전 요약이 함께 보인다.
- 중간 CTA와 하단 CTA가 모두 자연스럽게 읽히고 `/matches/new`로 연결된다.
- hero, preview, flow, CTA가 데스크톱에서 명확히 분리되어 보인다.
- CTA가 더 자연스럽고 분명한 전환 섹션으로 읽힌다.
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
