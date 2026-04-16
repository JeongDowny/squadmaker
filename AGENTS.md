# AGENTS.md

## Project summary
이 프로젝트는 축구 동호회 회장 또는 감독이 경기 전 쿼터별 선발 배치를 빠르게 짜고 수정할 수 있도록 돕는 웹 서비스다.

핵심 목표는 다음 3가지를 동시에 만족하는 것이다.
1. 선수별 출전 쿼터 수를 가능한 공평하게 분배한다.
2. 쿼터별 평균 실력 점수 편차를 크게 벌어지지 않게 유지한다.
3. 각 선수의 포지션 적합성을 최대한 반영한다.

## Source of truth priority
문서 우선순위는 아래 순서를 따른다.

1. AGENTS.md
2. docs/PRODUCT_SENSE.md
3. docs/ARCHITECTURE.md
4. docs/exec-plans/active/*
5. docs/FRONTEND.md
6. docs/DESIGN.md
7. docs/DOMAIN.md
8. docs/product-specs/*
9. docs/RELIABILITY.md
10. docs/SECURITY.md
11. docs/references/*
12. docs/generated/*

충돌 시 더 상위 문서를 따른다.

## Required reading before coding
비사소한 코드 수정 전 반드시 아래 순서대로 확인한다.

1. AGENTS.md
2. docs/PRODUCT_SENSE.md
3. docs/ARCHITECTURE.md
4. 관련 active exec-plan
5. 관련 product spec
6. FRONTEND.md 또는 DESIGN.md
7. SECURITY.md / RELIABILITY.md 필요 시 확인

## Non-negotiable rules
- 기술 스택을 임의로 변경하지 않는다.
- 디자인 시스템 없이 컴포넌트를 제멋대로 만들지 않는다.
- 추천 로직은 문서 업데이트 없이 수정하지 않는다.
- 보안 관련 파일은 명시적 필요 없이 수정하지 않는다.
- 사소한 수정이 아닌 경우, 구현 전에 목적과 검증 계획을 먼저 정리한다.
- UI 변경 작업에만 스크린샷 검증 항목을 반드시 포함한다.
  - 랜딩페이지 구현 후 데스크톱 스크린샷 1장, 모바일 스크린샷 1장을 생성한다.
  - 스크린샷을 기준으로 `docs/DESIGN.md`와 비교 검토한다.
  - 정보 위계, CTA 가시성, 전술 보드 가독성을 확인한다.
  - 문제가 있으면 최소 1회 이상 수정 반복 후 다시 확인한다.
- 모바일 사용성을 깨는 변경을 허용하지 않는다.
- 로그인/비로그인 저장 정책을 임의로 바꾸지 않는다.

## Allowed minor changes without exec-plan
아래 작업은 exec-plan 없이 진행 가능하다.
- 오타 수정
- 문서 문장 다듬기
- import 정리
- 주석 정리
- 동작 변경이 없는 단순 타입 정리

단, 의미 있는 동작 변화가 생기면 exec-plan이 필요하다.

## Required workflow for non-trivial changes
사소하지 않은 변경은 아래 순서를 따른다.

1. 관련 문서를 읽고 현재 규칙을 확인한다.
2. 필요한 경우 `docs/exec-plans/active/`에 작업 계획 문서를 만들거나 갱신한다.
3. `docs/prompt-logs/`에 사용자 원문 프롬프트와 작업용 정리 프롬프트를 기록한다.
4. 테스트 전략을 먼저 작성한다.
5. 구현한다.
6. 검증한다.
   - UI 변경이면 데스크톱/모바일 스크린샷을 생성하고 `docs/DESIGN.md` 기준으로 비교 검토한다.
   - 정보 위계, CTA 가시성, 전술 보드 가독성을 확인하고 문제 있으면 최소 1회 이상 수정 반복한다.
7. 관련 문서를 업데이트한다.
8. execution log와 연결된 prompt log를 함께 기록한다.

## Prompt log policy
모든 비사소한 코드 수정은 `docs/prompt-logs/`에 날짜별 문서로 기록한다.

경로 예시:
- `docs/prompt-logs/2026-04-01.md`

각 날짜 파일 안에서는 execution log와 같은 PR 단위로 섹션을 나눈다.

기본 템플릿:
- 사용자 원문 프롬프트
- 작업용 정리 프롬프트
- 제약 / 참고 문서
- 연결 execution log
- 비고

원칙:
- 사용자 원문은 가능한 한 그대로 남긴다.
- 구현 과정에서 재정리한 작업용 프롬프트가 있으면 함께 남긴다.
- 민감 정보나 불필요한 비밀값은 기록하지 않는다.
- prompt log와 execution log는 같은 날짜 / PR 섹션으로 서로 연결한다.

## Execution log policy
모든 비사소한 코드 수정은 `docs/execution-logs/`에 날짜별 문서로 기록한다.

경로 예시:
- `docs/execution-logs/2026-04-01.md`

각 날짜 파일 안에서는 PR 단위로 섹션을 나눈다.

기본 템플릿:
- 문제
- 판단 근거
- 실행 내용
- 검증 방법
- 실행 전 결과
- 실행 후 결과
- 회고 / 남은 이슈

추가 원칙:
- 같은 날짜 / PR 섹션의 `docs/prompt-logs/*.md` 경로를 함께 남긴다.
- execution log만으로도 작업 결과를 이해할 수 있어야 하고, prompt log를 따라가면 작업 입력을 복원할 수 있어야 한다.

## Definition of done
작업 완료로 보려면 아래를 만족해야 한다.

- 타입 오류 없음
- lint 통과
- 테스트 통과
- 관련 문서 업데이트 완료
- 비사소한 변경 시 execution log와 prompt log 기록 완료
- UI 변경 시에만 데스크톱/모바일 스크린샷 생성 및 `docs/DESIGN.md` 기준 비교 검토 완료
- UI 변경 시 정보 위계, CTA 가시성, 전술 보드 가독성 확인 완료
- UI 변경 시 문제 발견 시 최소 1회 이상 수정 반복 완료
- 추천 로직 변경 시 관련 spec과 architecture 반영 완료
- 저장/계산/교체 로직 변경 시 주요 시나리오 검증 완료

## Product-specific guardrails
이 프로젝트에서 특히 중요한 제약은 아래와 같다.

- 감독이 쿼터별 포메이션을 먼저 고른다.
- 서비스는 그 포메이션에 맞는 선발 11명 배치를 추천한다.
- 현재 v1 추천안은 출전 쿼터 수 공평성을 우선하는 단일 추천안이다.
- 평균 점수 균형과 주포지션 일치율 기반 다중 추천안은 후속 확장 범위로 둔다.
- 비로그인 사용자는 경기 3개까지 localStorage에 저장할 수 있다.
- 로그인 사용자는 경기 3개까지 저장할 수 있다.
- 저장 대상은 최종 수정본 1개다.
- 이미지 내보내기는 PNG이며 필드 배치만 포함한다.
