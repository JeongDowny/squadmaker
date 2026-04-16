# match-editor-first-screen.md

## Title
시작하기 이후 첫 경기 배치 / 선수 관리 화면 구현

## Goal
랜딩페이지의 `시작하기`를 실제 서비스 진입점으로 바꾸고, 자동 생성된 경기 id 기준으로 `/matches/:matchId` 화면에 진입해 경기 제목/날짜 수정, 필드 우선 레이아웃, 선수 풀 인라인 입력을 할 수 있게 만든다.

## Why this matters
- 현재 랜딩 CTA는 mock 상태라 실제 서비스 첫 화면으로 이어지지 않는다.
- `PRODUCT_SENSE.md`, `FRONTEND.md`, `DESIGN.md` 기준으로 이 제품의 핵심은 긴 입력 폼보다 필드 배치와 선수 관리가 먼저 보이는 편집 화면이다.
- 추천 엔진 구현 전에도 match setup과 result editor 사이를 잇는 실제 작업 화면이 있어야 이후 단계 연결이 쉬워진다.

## Scope
이번 작업에 포함:
- `/matches/new` 자동 생성 진입과 `/matches/[matchId]` 라우트 추가
- 경기 제목 / 경기 날짜 기본값과 수정 UI
- 필드 우선 레이아웃과 오른쪽 선수 풀 UI
- 선수 추가 버튼, 인라인 카드, 주포지션 / 부포지션 / 실력 점수 입력 구조
- 포지션 정렬 규칙과 기본 mock 데이터
- 추천 단계로 이어질 mock CTA
- e2e / visual 검증과 execution log / prompt log 기록

이번 작업에 포함하지 않음:
- 추천안 A/B/C 실제 계산
- 저장 기능
- 로그인
- DB 연동
- 별도 players 페이지 완성
- 규칙 문서 수정

## Source of truth
- `AGENTS.md`
- `docs/PRODUCT_SENSE.md`
- `docs/ARCHITECTURE.md`
- `docs/DOMAIN.md`
- `docs/FRONTEND.md`
- `docs/DESIGN.md`
- `docs/product-specs/new-user-onboarding.md`
- `docs/product-specs/formation-recommendation.md`
- `docs/product-specs/quarter-lineup-editor.md`
- `docs/product-specs/active/mvp-build.md`

## Key decisions
- 랜딩 `시작하기`는 `/matches/new`로 연결하고, 이 라우트가 즉시 `/matches/:matchId`로 redirect한다.
- match editor는 server page + client form 구조로 나눈다.
- `react-hook-form`과 `useFieldArray`로 선수 카드 반복 입력을 관리한다.
- 첫 화면은 입력 폼 나열보다 필드 보드와 선수 풀의 편집 구조를 먼저 보여준다.
- 추천 CTA는 disabled가 아니라 다음 단계 안내 패널과 함께 mock action 상태로 노출한다.

## UI direction
- 상단은 소개형 hero 대신 경기 이름, 날짜, 현재 match id, 활성 쿼터 상태를 빠르게 수정하는 압축형 편집 바로 다듬는다.
- 본문은 데스크톱에서 `필드 > 선수 풀`, 모바일에서 `필드 -> 선수 풀` 순으로 읽힌다.
- 필드 영역은 결과 화면의 전술 보드 톤을 미리 가져오되, 아직 선수 배치가 없는 준비 화면이라는 점을 분명히 보여준다.
- 선수 패널은 단순 입력 카드 나열보다 현재 경기 관리 패널처럼 보이게 밀도와 여백을 정리한다.
- 추천 placeholder는 필드 편집 흐름을 방해하지 않는 보조 스트립 톤으로 낮춘다.

## Test strategy
### Automated checks
- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e`
- `npm run test:visual`

### Manual checks
- `/`에서 `시작하기` 클릭 시 `/matches/:matchId`로 진입한다.
- 경기 제목 기본값이 `2026-04-04 경기` 형식으로 들어간다.
- 경기 날짜 기본값이 오늘 날짜로 들어간다.
- 경기 제목과 날짜를 수정할 수 있다.
- 상단 경기 정보 바가 이전보다 작고 압축적으로 보인다.
- 선수 추가 버튼으로 인라인 카드가 생긴다.
- 선수 카드가 포지션 우선순위 기준으로 정렬된다.
- 우측 패널이 입력 카드 나열보다 관리 패널처럼 읽힌다.
- 추천 CTA가 다음 단계 placeholder로 보이되 존재감이 과하지 않다.
- 모바일에서도 필드가 먼저 읽히고 선수 카드 입력이 무너지지 않는다.

### Screenshot verification checklist
- 데스크톱 viewport 기준 `/matches/:matchId` 스크린샷 1장 생성
- 모바일 viewport 기준 `/matches/:matchId` 스크린샷 1장 생성
- 생성한 스크린샷을 기준으로 `docs/DESIGN.md`와 비교 검토
- 정보 위계, CTA 가시성, 전술 보드 가독성 확인
- 문제 발견 시 최소 1회 이상 수정 반복 후 다시 스크린샷 확인

## Exit criteria
- 랜딩 `시작하기`가 실제 match editor로 연결된다.
- `/matches/:matchId` 화면에서 경기 제목 / 날짜 / 선수 풀을 편집할 수 있다.
- 필드 우선 레이아웃과 mock recommendation CTA가 보인다.
- lint, typecheck, e2e, visual 검증이 통과한다.
- prompt log와 execution log가 기록된다.

## Refinement note
- 다음 리팩터링에서는 소개형 설명 비중을 줄이고, 상단 경기 정보 바를 압축해 실제 서비스 편집 화면에 가까운 밀도로 다듬는다.
- 필드와 우측 선수 패널 비율, 카드 밀도, typography hierarchy를 조정해 mock 시안보다 운영 화면 같은 인상을 강화한다.

## 2026-04-06 refinement: compact manual placement editor

### Goal
`/matches/:matchId` 화면을 준비용 placeholder보다 실제 수동 편집 화면에 가깝게 다듬는다.

### Scope
이번 refinement에 포함:
- 랜딩 복귀 버튼, 상단 활성 쿼터/입력 완료/실력 점수 metric, 현재 편집 상태 패널 제거
- 선수 패널 설명과 summary metric 제거
- 선수 카드는 기본 상태에서 선수 이름과 주포지션만 표시
- 선수 카드 클릭 시 주포지션, 부포지션, 실력 점수 입력을 펼쳐 기존처럼 수정 가능하게 유지
- 필드 보드를 실제 축구장에 더 가까운 형태로 재구성
- 포메이션 슬롯 좌표를 실제 축구 포메이션처럼 줄 단위로 재정렬
- 추천 대기 placeholder 대신 현재 선수 풀의 선수를 슬롯에 배치
- 데스크톱 드래그 앤 드롭과 클릭 기반 선수/슬롯 배치 지원
- 필드 보드 크기와 전체 좌우 폭을 축소해 더 압축된 편집 화면으로 조정

이번 refinement에 포함하지 않음:
- 추천안 A/B/C 계산 로직 구현
- 저장 기능
- 로그인/DB 연동
- 저장 정책 변경
- 포메이션 자유 커스텀

### Test strategy
Automated checks:
- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e`
- `npm run test:visual`

Manual checks:
- `/`에서 `시작하기` 클릭 시 `/matches/:matchId`로 진입한다.
- 삭제 요청된 상단 metric, 현재 편집 상태, 랜딩 복귀 버튼, 추천 대기 문구가 보이지 않는다.
- 선수 카드는 기본 상태에서 이름과 주포지션만 보인다.
- 선수 카드를 클릭하면 주포지션, 부포지션, 실력 점수를 수정할 수 있다.
- 필드 슬롯에는 실제 선수가 배치되어 보인다.
- 선수 카드에서 필드 슬롯으로 드래그 앤 드롭해 배치를 바꿀 수 있다.
- 드래그가 없어도 선수 카드 선택 후 필드 슬롯 클릭으로 배치할 수 있다.
- 데스크톱/모바일에서 필드가 먼저 읽히고 전체 좌우 폭이 과도하게 넓지 않다.

Screenshot verification checklist:
- 데스크톱 viewport 기준 `/matches/:matchId` 스크린샷 1장 생성
- 모바일 viewport 기준 `/matches/:matchId` 스크린샷 1장 생성
- `docs/DESIGN.md` 기준으로 정보 위계, CTA 가시성, 전술 보드 가독성 확인
- 문제 발견 시 최소 1회 이상 수정 반복 후 다시 확인

## 2026-04-06 refinement: empty setup and A/B/C recommendation

### Goal
`/matches/:matchId`를 mock 선수가 미리 배치된 화면이 아니라 빈 경기 설정 화면으로 시작하게 만들고, 사용자가 쿼터/포메이션/선수를 입력한 뒤 문서 기준 A/B/C 추천안을 생성할 수 있게 한다.

### Scope
이번 refinement에 포함:
- 새 매치 기본값을 선수 0명, 쿼터 0개로 변경
- 상단 `Match Editor` / match id 표시 제거
- 쿼터 추가와 쿼터별 포메이션 선택 UI 추가
- 선수 카드 클릭은 상세 입력 펼치기만 수행하고 필드 교체 선택 동작 제거
- 추천안 A/B/C 브라우저 계산 유틸 추가
- 추천 후 A/B/C 카드, 현재 쿼터 필드, 기본 지표 표시
- 포메이션 슬롯 카드가 경기장 안에 맞도록 크기와 좌표 조정

이번 refinement에 포함하지 않음:
- 저장 기능
- 로그인/DB 연동
- PNG 내보내기
- 포메이션 자유 커스텀

### Test strategy
Automated checks:
- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e`
- `npm run test:visual`

Manual checks:
- 새 매치 진입 시 선수 0명, 쿼터 0개로 시작한다.
- `Match Editor`와 match id 표시가 보이지 않는다.
- 쿼터 추가 후 포메이션을 선택할 수 있다.
- 선수 추가 후 카드 클릭은 상세 수정만 열고 필드 교체 상태를 만들지 않는다.
- 11명 이상 선수와 1개 이상 쿼터가 있으면 A/B/C 추천안을 생성할 수 있다.
- 추천안 선택 시 필드에 실제 선수명이 표시된다.
- 포메이션 슬롯 카드가 경기장 경계 안에서 읽힌다.

## 2026-04-06 refinement: single fairness recommendation and management shell

### Goal
현재 matches 화면을 A/B/C/실력 점수 기반 추천보다 단순한 출전 쿼터 수 균등 추천 v1으로 바꾸고, 선수 제외와 경기/팀 관리 진입 구조를 추가한다.

### Scope
이번 refinement에 포함:
- 추천안 A/B/C UI와 계산 제거
- 실력 점수 입력과 추천 계산 제거
- 단일 `출전 균등 추천` 생성
- 추천 후에도 쿼터별 포메이션 변경 가능 및 변경 즉시 재계산
- 선수 목록에 이름, 주포지션, 출전 쿼터 수 표시
- 선수 순번/ID 표시 제거
- 경기 제외/참가 토글 추가
- 공통 네비게이션 추가
- `/matches` 경기 관리 MVP 화면 추가
- `/players` 팀 관리 MVP 화면 추가
- 랜딩을 1-2줄 설명과 스크린샷형 이용 흐름, 마지막 경기 관리 CTA 중심으로 재구성

이번 refinement에 포함하지 않음:
- DB 저장
- 로그인
- localStorage 영속 저장
- PNG 내보내기
- 실력 점수 기반 균형 추천

### Test strategy
Automated checks:
- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e`
- `npm run test:visual`

Manual checks:
- 추천 버튼은 단일 `출전 균등 추천`만 보인다.
- 선수 카드에는 이름, 주포지션, 출전 쿼터 수, 참가/제외 상태만 우선 보인다.
- 실력 점수 입력은 보이지 않는다.
- 제외된 선수는 추천 필드에 배치되지 않는다.
- 추천 후 포메이션 변경 시 필드 슬롯이 새 포메이션 기준으로 갱신된다.
- 네비게이션에서 경기 관리, 팀 관리로 이동할 수 있다.
- 랜딩은 짧은 설명, 스크린샷형 흐름, 마지막 경기 관리 CTA 중심으로 읽힌다.

## 2026-04-06 refinement: persistent workspace and Supabase bridge

### Goal
경기/팀 관리와 경기 편집 화면을 localStorage 기반으로 영속 저장하고, 팀 선수 풀과 경기 참가 선수 관리를 연동하며, Supabase Auth + Prisma 기반 클라우드 저장 경로를 추가한다.

### Scope
이번 refinement에 포함:
- localStorage 선수 풀과 경기 목록 저장
- localStorage 경기 저장 제한을 3개로 변경
- 경기 생성 후 목록 카드 클릭으로 편집 화면 진입
- 팀 관리 선수 정보와 경기 내 선수 관리 동기화
- 추천 결과를 `lineups` 저장 상태로 전환
- 필드 슬롯 드래그 앤 드롭 기반 수동 배치 수정
- 모바일/접근성용 클릭 기반 슬롯 선택 fallback
- Supabase Google 로그인/로그아웃 골격
- Prisma schema와 서버 액션 기반 클라우드 불러오기/저장 골격

이번 refinement에 포함하지 않음:
- PNG 내보내기
- Supabase 프로젝트 생성 또는 실제 Google provider 콘솔 설정
- CI에서 실제 Supabase DB 연결을 요구하는 테스트

### Test strategy
Automated checks:
- `npx prisma generate`
- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e`
- `npm run test:visual`

Manual checks:
- 경기 관리에서 경기 생성 후 목록 카드를 눌러 편집 화면으로 이동한다.
- 새로고침 후 localStorage 경기/팀 데이터가 유지된다.
- 팀 관리에서 만든 선수가 새 경기의 선수 관리에 표시된다.
- 추천 후 필드 슬롯을 드래그해 선수 배치를 바꿀 수 있다.
- Supabase 환경변수가 없으면 클라우드 버튼은 안내 메시지를 표시하고 localStorage 흐름은 유지된다.
- Supabase 환경변수가 있으면 Google 로그인 후 클라우드 저장/불러오기를 확인한다.
