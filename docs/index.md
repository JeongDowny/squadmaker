# docs/index.md

## Purpose
이 문서는 프로젝트 문서의 진입점이다.

이 저장소의 문서는 크게 아래 목적을 가진다.

- 제품이 무엇인지 정의한다
- 시스템 구조를 설명한다
- 구현 규칙을 고정한다
- 기능별 스펙을 정리한다
- 실행 계획과 변경 이력을 기록한다

새로 작업을 시작할 때는 이 문서에서 필요한 문서를 찾아 읽는다.

## Reading order
작업을 시작할 때 기본 읽기 순서는 아래와 같다.

1. `../AGENTS.md`
2. `../ARCHITECTURE.md`
3. `PRODUCT_SENSE.md`
4. `DOMAIN.md`
5. 현재 작업과 관련된 `exec-plans/active/*`
6. 관련 `product-specs/*`
7. `FRONTEND.md` 또는 `DESIGN.md`
8. `RELIABILITY.md` / `SECURITY.md` 필요 시 확인

문서 간 충돌이 있으면 `AGENTS.md`의 우선순위를 따른다.

## Core documents

### `PRODUCT_SENSE.md`
이 서비스가 누구를 위한 것이고, 어떤 문제를 해결하는지 설명한다.

### `DOMAIN.md`
경기, 쿼터, 포메이션, 포지션, 선발, 후보, 실력 점수 등 핵심 도메인 용어를 고정한다.

### `../ARCHITECTURE.md`
시스템 전체 구조, 저장 방식, 경기 중심 모델, 계산 위치를 설명한다.

### `FRONTEND.md`
프론트엔드 구현 방식, 상태 관리, 폼 처리, 인터랙션 규칙을 설명한다.

### `DESIGN.md`
결과 화면 중심의 UI/UX 원칙과 디자인 방향을 설명한다.

### `RELIABILITY.md`
입력 부족, 추천 불가, 저장 실패 같은 실패 상황 처리 기준을 설명한다.

### `SECURITY.md`
로그인, 저장, 입력 검증, 비밀값 관리 등의 보안 기준을 설명한다.

### `PLANS.md`
현재 MVP 범위와 마일스톤을 요약한다.

### `QUALITY_SCORE.md`
좋은 추천 결과와 좋은 UI를 판단하는 기준을 정리한다.

## Harness assets

하네스 실행 자산은 저장소 루트의 `../harness/`와 `../.codex/`에도 존재한다.

앱 코드는 `../src/` 아래에서 feature 단위로 관리한다.

### `../harness/config/repository-harness.json`
repository/application harness 공용 source of truth

### `../harness/scenarios/*`
기능별 실행-검증 시나리오 JSON

### `../harness/fixtures/*`
예시 선수, 경기, 스크린샷 자산

### `../harness/evals/*`
체크리스트, 시나리오 검증, 점수 계산 유틸

### `../harness/reports/*`
latest / history 실행 결과

### `../src/app/*`
App Router 엔트리와 페이지

### `../src/features/*`
랜딩, 하네스, 이후 경기 생성/결과 편집 기능 모듈

### `../.codex/agents/*`
planner / implementer / reviewer 역할 설정

### `../.codex/skills/*`
UI review, regression check, release check 가이드

## Product specs

기능별 제품 스펙은 `product-specs/` 아래에 둔다.

### `product-specs/formation-recommendation.md`
추천 엔진의 입력, 출력, 점수 기준, 추천안 A/B/C를 정의한다.

### `product-specs/new-user-onboarding.md`
첫 진입 사용자가 어떻게 서비스를 이해하고 첫 결과에 도달하는지 정의한다.

### `product-specs/quarter-lineup-editor.md`
추천 결과를 쿼터별로 보고 수정하는 화면의 규칙을 정의한다.

### `product-specs/team-save-and-export.md`
비로그인 저장, 로그인 저장, PNG 내보내기 정책을 정의한다.

## Design docs

상위 디자인 사고는 `design-docs/`에서 관리한다.

### `design-docs/core-beliefs.md`
제품의 디자인 철학을 정리한다.

예:
- 입력은 짧고 명확해야 한다
- 결과는 한눈에 이해되어야 한다
- 수정은 설명 없이도 가능해야 한다

## Execution plans

실행 계획은 `exec-plans/`에서 관리한다.

### `exec-plans/active/`
현재 진행 중인 작업 계획 문서

### `exec-plans/completed/`
완료된 작업 계획 문서

### `exec-plans/tech-debt-tracker.md`
기술 부채 목록과 우선순위

## Execution logs

모든 비사소한 코드 변경 기록은 `execution-logs/`에서 관리한다.

형식:
- 날짜별 파일
- 파일 안에서 PR 단위 섹션 구분

기본 템플릿:
- 문제
- 판단 근거
- 실행 내용
- 검증 방법
- 실행 전 결과
- 실행 후 결과
- 회고 / 남은 이슈

## Prompt logs

모든 비사소한 코드 변경의 입력 기록은 `prompt-logs/`에서 관리한다.

형식:
- 날짜별 파일
- 파일 안에서 execution log와 같은 PR 단위 섹션 구분

기본 템플릿:
- 사용자 원문 프롬프트
- 작업용 정리 프롬프트
- 제약 / 참고 문서
- 연결 execution log
- 비고

## Generated docs

자동 생성 또는 반자동 생성 문서는 `generated/`에 둔다.

### `generated/db-schema.md`
현재 DB 구조 요약

원칙:
- 사람이 설계 철학을 쓰는 문서가 아니다
- 현재 상태를 반영하는 문서다

## References

외부 기술 자료 요약본은 `references/`에 둔다.

원칙:
- 공식 문서 전체 복사보다, 프로젝트에 필요한 핵심 요약을 우선한다
- 길고 산만한 링크 모음 대신 실제 구현에 필요한 포인트만 남긴다

## Writing rules for new docs
새 문서를 만들 때는 아래를 지킨다.

- 문서 목적을 첫 줄에 분명히 적는다
- 이 문서가 무엇을 다루고 무엇을 다루지 않는지 구분한다
- 구현 규칙 문서와 제품 철학 문서를 섞지 않는다
- 이미 다른 문서에 있는 내용을 반복하지 않는다
- 충돌 가능성이 있는 경우 상위 문서를 링크하거나 참조한다
