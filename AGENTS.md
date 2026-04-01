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
- UI 변경 작업은 스크린샷 검증 항목을 반드시 포함한다.
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
3. 테스트 전략을 먼저 작성한다.
4. 구현한다.
5. 검증한다.
6. 관련 문서를 업데이트한다.
7. execution log를 기록한다.

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

## Definition of done
작업 완료로 보려면 아래를 만족해야 한다.

- 타입 오류 없음
- lint 통과
- 테스트 통과
- 관련 문서 업데이트 완료
- UI 변경 시 스크린샷 확인 완료
- 추천 로직 변경 시 관련 spec과 architecture 반영 완료
- 저장/계산/교체 로직 변경 시 주요 시나리오 검증 완료

## Product-specific guardrails
이 프로젝트에서 특히 중요한 제약은 아래와 같다.

- 감독이 쿼터별 포메이션을 먼저 고른다.
- 서비스는 그 포메이션에 맞는 선발 11명 배치를 추천한다.
- 추천안은 3개이며, 각각 공평성 / 평균 점수 균형 / 주포지션 일치율 관점이 다르다.
- 비로그인 사용자는 경기 1개만 localStorage에 저장할 수 있다.
- 로그인 사용자는 경기 3개까지 저장할 수 있다.
- 저장 대상은 최종 수정본 1개다.
- 이미지 내보내기는 PNG이며 필드 배치만 포함한다.