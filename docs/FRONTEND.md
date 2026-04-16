# FRONTEND.md

## Purpose
이 문서는 프론트엔드 구현 방식, 상태 관리 원칙, UI 상호작용 규칙을 정의한다.

이 프로젝트의 프론트엔드는 빠른 입력, 즉시 계산, 모바일 사용성을 동시에 만족해야 한다.

## Stack
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- react-hook-form
- Supabase client
- Prisma는 서버 측 데이터 계층에서 사용

## Frontend goals
프론트엔드 구현의 핵심 목표는 아래와 같다.

1. 선수 입력부터 추천 결과 확인까지 흐름이 짧아야 한다.
2. 추천 결과 화면이 빠르게 반응해야 한다.
3. 수정 시 출전 쿼터 수와 추천 필드 배치가 즉시 재계산되어야 한다.
4. 모바일에서도 핵심 기능을 동일하게 사용할 수 있어야 한다.

## App structure
App Router 기준으로 페이지와 기능을 나눈다.

예상 구조 예시:
- `/`
  - 랜딩 / 예시 팀 체험 / 시작 CTA
- `/harness`
  - repository/application harness 대시보드
- `/matches/new`
  - 경기 생성, 선수 선택, 쿼터 설정, 포메이션 설정
- `/matches/[id]`
  - 결과 보기 및 수정
- `/matches/[id]/summary`
  - 전체 쿼터 요약 보기
- `/players`
  - 선수 풀 관리
- `/auth/*`
  - 로그인 관련 흐름

## State management policy
초기에는 가능한 단순하게 시작한다.

원칙:
- 폼 입력 상태는 react-hook-form으로 관리한다.
- 페이지 단위 임시 상태는 local state를 우선 사용한다.
- 추천 결과처럼 화면 전체에서 공유되는 계산 결과는 상위 컨테이너에서 관리한다.
- 전역 상태 라이브러리는 필요성이 명확해질 때만 도입한다.

도입 전제:
- 상태 전달이 지나치게 깊어질 때
- 교체 로직, 쿼터 전환, 추천 결과 상태가 과도하게 분산될 때

## Data fetching policy
- 로그인 사용자 데이터는 서버에서 읽고 클라이언트에 전달한다.
- 추천 계산은 브라우저에서 수행한다.
- 저장은 서버 액션 또는 API 계층을 통해 처리한다.
- 비로그인 저장은 localStorage를 사용한다.

## Form policy
입력 폼은 react-hook-form을 사용한다.

원칙:
- 선수 추가/수정은 반복 가능한 카드형 입력 구조를 사용한다.
- 유효성 검사는 즉시 피드백을 준다.
- 포지션은 선택형 입력으로 제한한다.
- 현재 v1 선수 입력은 이름, 경기 참가 여부, 주포지션, 부포지션을 우선한다.
- 실력 점수 입력은 평균 점수 균형 추천을 재도입할 때 함께 복구한다.

## Calculation policy
추천 계산은 클라이언트에서 수행한다.

원칙:
- 입력 변경 후 필요한 결과만 재계산한다.
- 무거운 전체 재연산이 반복되지 않도록 계산 경계를 명확히 한다.
- 수동 교체 후에는 최소 아래를 다시 계산한다.
  - 선수별 출전 쿼터 수
  - 현재 쿼터 필드 배치
  - 포지션 슬롯 배치

## Result screen policy
결과 화면은 이 프로젝트에서 가장 중요한 화면이다.

정보 우선순위:
1. 필드 배치
2. 선수별 출전 쿼터 수
3. 참가/제외 상태

기본 구성:
- 상단: 경기 제목, 날짜
- 쿼터 탭
- 중앙: 필드 배치
- 하단 또는 옆 패널: 선수별 출전 쿼터 카드 리스트
- 보조 영역: 단일 추천 성격, 참가/제외, 저장/내보내기 액션

## Quarter navigation
- 기본 탐색 방식은 탭이다.
- 각 탭은 하나의 쿼터를 의미한다.
- 기본 화면은 한 번에 한 쿼터만 보여준다.
- 전체 쿼터 요약은 별도 화면 또는 별도 뷰로 제공한다.

## Manual edit interaction
수정은 결과 화면에서 가능해야 한다.

### Desktop
- 포지션 슬롯 드래그 앤 드롭을 지원할 수 있다.
- 단, 드래그 없이도 교체 가능한 대체 입력을 제공해야 한다.

### Mobile
- 기본 방식은 탭 기반 교체다.
- 1회 탭: 교체 대상 선택
- 2회 탭: 교체 실행
- 모바일에서 드래그 앤 드롭을 필수 인터랙션으로 두지 않는다.

원칙:
- 모바일과 데스크톱은 기능 동등성을 유지한다.
- 상호작용 방식은 기기 특성에 따라 달라질 수 있다.

## Component design principles
- 결과 계산 로직과 시각 표현 로직은 분리한다.
- 페이지 컴포넌트는 얇게 유지한다.
- 필드 보드는 표시 책임에 집중한다.
- 추천/재계산 로직은 별도 유틸 또는 도메인 모듈로 분리한다.
- 선수 카드 리스트는 재사용 가능한 컴포넌트로 구성한다.

## Suggested frontend module split
예시:
- `components/match/*`
- `components/formation/*`
- `components/player/*`
- `components/ui/*`
- `lib/recommendation/*`
- `lib/scoring/*`
- `lib/storage/*`
- `lib/export/*`

## Local storage policy
비로그인 사용자는 localStorage에 경기 3개까지 저장할 수 있다.

원칙:
- 저장 키 이름을 명확히 고정한다.
- 덮어쓰기 정책을 문서화한다.
- 저장 실패 또는 데이터 손상 시 복구 가능한 메시지를 제공한다.

## Export policy
이미지 내보내기는 PNG만 지원한다.

원칙:
- 기본 내보내기 대상은 필드 배치 화면이다.
- 내보내기 화면은 UI 조작 요소보다 결과물이 깔끔하게 보이도록 구성한다.
- PNG에는 필드 배치만 포함한다.

## Testing guidance
프론트엔드 테스트는 아래 시나리오를 우선한다.

- 하네스 대시보드 접근 및 시나리오 카드 표시
- 선수 입력 폼 유효성
- 쿼터 수 입력 및 포메이션 선택
- 단일 추천 생성
- 쿼터 탭 전환
- 추천 후 포메이션 변경 재계산
- 경기 참가/제외 토글
- 비로그인 임시 저장
- 로그인 사용자 저장
- 모바일에서 탭 기반 교체

## Harness guidance
실제 기능 구현 전에도 `/harness` 화면을 유지한다.

원칙:
- 제품 문서의 핵심 규칙을 시나리오 카드로 바로 읽을 수 있어야 한다.
- 모바일과 데스크톱에서 모두 읽기 가능한 카드 레이아웃을 유지한다.
- repository-level harness와 application-level harness는 같은 source of truth를 사용한다.
- 각 시나리오는 `dependsOn / deliverables / readyWhen / nextWorkstream` handoff 계약을 포함해야 한다.
- happy path 뿐 아니라 warning / failure path를 함께 유지한다.
- `test:harness`는 현재 하네스 메타데이터 검증이며, 미래의 기능 테스트 전체를 의미하지 않는다.
- 각 시나리오는 `priority / owner / status / expectedResults / verification` 메타데이터를 포함해야 한다.
- `/harness` 화면에서 구현 우선순위와 현재 상태를 바로 읽을 수 있어야 한다.

## Accessibility guidance
- 탭 이동이 가능해야 한다.
- 선택 상태는 색상만으로 표현하지 않는다.
- 교체 상태는 텍스트와 시각 표시를 함께 사용한다.
- 모바일에서도 터치 영역이 충분히 커야 한다.
