# mvp-build.md

## Title
축구 경기 쿼터별 선발 배치 서비스 MVP 구축 계획

## Goal
경기 제목, 날짜, 쿼터 수, 쿼터별 포메이션, 참가 선수 정보를 입력하면, 선발 11명 배치를 추천하고, 사용자가 이를 수정·저장·내보내기 할 수 있는 MVP를 완성한다.

## Why this matters
현재 사용자는 메모장 계산과 카카오톡 줄글 또는 캡처 공유에 의존하고 있다.

이 방식은 아래 문제가 있다.
- 선수별 출전 쿼터 수 공평성 관리가 어렵다
- 쿼터별 평균 실력 균형을 빠르게 비교하기 어렵다
- 수정이 생기면 전체 배치를 다시 계산해야 한다
- 모바일에서 보기 좋게 정리하기 어렵다

이 MVP는 이 수작업을 줄이는 첫 번째 제품 버전이다.

## Scope
이번 MVP 범위에 포함하는 것:

1. 문서 기반 하네스 구조 정착
2. 선수 풀 입력 및 관리
3. 경기 생성
4. 경기 제목 / 날짜 입력
5. 경기 참가 선수 선택
6. 쿼터 수 입력
7. 쿼터별 포메이션 선택
8. 추천안 A/B/C 생성
9. 쿼터 탭 기반 결과 보기
10. 선수별 출전 쿼터 수 카드 표시
11. 평균 점수 표시
12. 수동 교체
13. 교체 후 재계산
14. 비로그인 localStorage 저장
15. 로그인 사용자 경기 저장
16. PNG 내보내기
17. 모바일 기본 사용성 확보

## Out of scope
이번 MVP에서 제외하는 것:

- 실시간 경기 분석
- 전술 AI 코칭
- 경기 중 교체 시뮬레이션
- 자유 커스텀 포메이션
- 후보 최적화
- 협업 기능
- 공유 링크
- 9인 축구 확장
- 세부 능력치 기반 추천

## Product rules to preserve
- 감독이 쿼터별 포메이션을 먼저 고른다.
- 서비스는 해당 포메이션 안에서 선발 배치를 추천한다.
- 추천 계산은 브라우저에서 수행한다.
- 추천안은 A/B/C 세 종류다.
- 최종 저장 대상은 수정 완료한 경기 배치다.
- 비로그인 사용자는 경기 1개만 저장한다.
- 로그인 사용자는 경기 3개까지 저장한다.

## Key documents
작업 전 반드시 참고할 문서:
- AGENTS.md
- docs/PRODUCT_SENSE.md
- docs/ARCHITECTURE.md
- docs/DOMAIN.md
- docs/FRONTEND.md
- docs/DESIGN.md
- docs/product-specs/formation-recommendation.md
- docs/product-specs/quarter-lineup-editor.md
- docs/product-specs/team-save-and-export.md
- docs/SECURITY.md
- docs/RELIABILITY.md

## Workstreams

### Workstream handoff contract
각 workstream은 완료 시 아래 묶음을 다음 작업자에게 넘겨야 한다.

- 어떤 문서와 시나리오를 source of truth로 썼는지
- 무엇이 구현 완료되었는지
- 다음 workstream이 바로 사용할 수 있는 산출물 경로
- 남은 blocker, open question, 미완료 검증
- 실행한 명령과 수동 검증 범위

하네스 기준으로는 각 대표 시나리오의 `dependsOn / deliverables / readyWhen / nextWorkstream`가 이 handoff 계약의 최소 단위다.

### Workstream 1: Foundation
목표:
- 프로젝트 초기 세팅
- 문서 구조와 우선순위 확정
- 기본 라우트와 폴더 구조 확정

할 일:
- Next.js App Router 구조 세팅
- Tailwind 세팅
- Supabase 연결
- Prisma 세팅
- 환경 변수 구조 정리
- 문서 폴더 정리
- repository-level harness 시나리오와 검증 스크립트 추가
- application-level harness 화면 추가

완료 조건:
- 앱 실행 가능
- 기본 라우트 접근 가능
- 환경 변수 로딩 확인
- 하네스 검증 명령 동작
- `/harness` 접근 가능

핵심 handoff output:
- 이후 스트림이 참조할 하네스 시나리오와 validator
- 기본 라우트와 문서 구조

### Workstream 2: Player pool and match setup
목표:
- 선수 풀 관리 및 경기 입력 흐름 완성

할 일:
- 선수 카드 입력 UI
- 포지션 선택
- 부포지션 최대 2개 처리
- 실력 점수 입력 및 기본값 5 처리
- 경기 제목 / 날짜 입력
- 경기 참가 선수 선택
- 쿼터 수 입력
- 쿼터별 포메이션 선택

완료 조건:
- 입력 흐름 완료 가능
- 기본 검증 동작
- 추천 계산 입력 구조 생성 가능

핵심 handoff output:
- 추천 엔진이 바로 사용할 입력 데이터 구조
- 입력 검증 규칙과 오류 메시지 기준

### Workstream 3: Recommendation engine
목표:
- A/B/C 추천안 생성 로직 구현

할 일:
- 공평성 계산
- 쿼터 평균 점수 계산
- 포지션 적합성 계산
- 추천안 A/B/C별 가중치 분리
  - A: 공평성 60 / 평균 점수 25 / 적합성 15
  - B: 공평성 35 / 평균 점수 45 / 적합성 20
  - C: 공평성 30 / 평균 점수 20 / 적합성 50
- 추천 결과 데이터 구조 정의

완료 조건:
- 추천안 3개 생성
- 주요 샘플 데이터에서 동작
- 계산 규칙 문서와 일치

핵심 handoff output:
- 결과 화면이 바로 소비할 recommendation 데이터 모델
- failure / partial-quality 판단 기준

### Workstream 4: Result screen and editor
목표:
- 결과 확인 및 수동 수정 화면 완성

할 일:
- 쿼터 탭 UI
- 필드 배치 UI
- 선수별 출전 쿼터 카드 리스트
- 평균 점수 표시
- 모바일 탭 기반 교체
- 데스크톱 보조 편집 흐름
- 교체 후 재계산

완료 조건:
- 사용자가 결과를 보고 수정 가능
- 재계산이 즉시 반영
- 모바일에서 핵심 편집 가능

핵심 handoff output:
- 저장 단계가 바로 사용할 최종 수정본 상태 구조
- 교체/취소/원본 복귀 동작 정의

### Workstream 5: Save and export
목표:
- 저장 및 PNG 내보내기 구현

할 일:
- 비로그인 localStorage 저장
- 로그인 DB 저장
- 저장 제한 검증
- 저장 실패 fallback
- PNG export 처리

완료 조건:
- 비로그인 경기 1개 저장 가능
- 로그인 경기 3개 저장 가능
- PNG 내보내기 가능

핵심 handoff output:
- hardening 단계가 검증할 저장/내보내기 주요 분기
- 실패 fallback과 정책 메시지

### Workstream 6: Hardening
목표:
- 품질 정리 및 출시 가능한 수준으로 안정화

할 일:
- 오류 메시지 정리
- 모바일 UI 다듬기
- 주요 테스트 추가
- 문서-구현 정합성 점검
- execution log 누락 확인

완료 조건:
- 주요 시나리오 테스트 통과
- 모바일 핵심 흐름 점검 완료
- 문서 갱신 완료

핵심 handoff output:
- 출시 판단에 필요한 최종 검증 기록
- 남은 리스크와 후속 작업 목록

## Risks
### Risk 1
추천안 A/B/C 차이가 사용자에게 충분히 명확하지 않을 수 있음

대응:
- 각 추천안에 성격 설명을 명시
- 각 추천안의 가중치 차이를 문서와 UI에서 일관되게 보여준다
- 요약 지표를 함께 표시

### Risk 2
포지션 적합성 규칙이 단순해서 실제 체감과 다를 수 있음

대응:
- DOMAIN.md에서 인접 포지션 규칙 명확화
- 초기 피드백 기반 조정 가능하도록 구조화

### Risk 3
모바일에서 교체 UX가 혼란스러울 수 있음

대응:
- 선택 상태를 명확히 보여줌
- 두 단계 교체 흐름을 시각적으로 강조
- 모바일 전용 테스트 우선

### Risk 4
비로그인 저장 정책이 사용자 기대와 다를 수 있음

대응:
- 저장 제한을 사전에 명확히 안내
- 로그인 시 이점 명확히 제시

## Validation strategy
각 단계는 아래 방식으로 검증한다.

- 타입 오류 없음
- lint 통과
- 테스트 통과
- 문서 업데이트
- UI 변경이 포함된 단계에서만 데스크톱 스크린샷 1장, 모바일 스크린샷 1장 생성
- 생성한 스크린샷을 기준으로 `docs/DESIGN.md`와 비교 검토
- UI 변경 단계에서는 정보 위계, CTA 가시성, 전술 보드 가독성 확인
- 문제 발견 시 최소 1회 이상 수정 반복 후 다시 확인
- 추천 로직 변경 시 계산 시나리오 검증
- 저장 변경 시 로그인/비로그인 분기 검증

## Deliverables
MVP 완료 시 기대 산출물:
- 동작하는 웹 앱
- 핵심 문서 세트
- 추천 엔진 MVP
- 결과 편집 화면
- 저장 및 내보내기 기능
- execution logs 기록

## Exit criteria
이 계획은 아래를 만족하면 completed로 이동할 수 있다.

- 핵심 MVP 기능이 모두 동작한다
- 모바일에서 주요 흐름 사용 가능
- 저장 및 export 동작 확인
- 문서와 실제 구현이 일치한다
- 주요 테스트 시나리오 통과
