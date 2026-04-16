# prompt-log-scaffolding.md

## Title
execution log와 연결되는 prompt log 운영 구조 추가

## Goal
비사소한 변경마다 사용자 입력과 작업용 재정리 프롬프트를 함께 남길 수 있도록 `docs/prompt-logs/`와 스캐폴딩 명령을 추가한다.

## Why this matters
- 현재는 execution log만 있어 무엇을 구현했는지는 남지만, 어떤 입력 지시에서 출발했는지는 복원하기 어렵다.
- 하네스 프로그래밍에서는 결과뿐 아니라 입력 계약도 추적 가능해야 다음 작업자가 같은 맥락을 이어받기 쉽다.
- execution log와 prompt log를 같은 날짜 / PR 단위로 연결하면 작업 의도, 제약, 산출물을 한 묶음으로 관리할 수 있다.

## Scope
이번 작업에 포함:
- `docs/prompt-logs/` 디렉터리와 운영 README 추가
- prompt log 스캐폴딩 스크립트와 package script 추가
- `AGENTS.md`, 하네스 문서, README, docs index의 정책 반영
- 오늘자 prompt log와 execution log 실제 기록

이번 작업에 포함하지 않음:
- 사용자 프롬프트 자동 수집
- 외부 저장소나 DB로의 로그 동기화
- 민감 정보 마스킹 자동화

## Decisions
### Log structure
- prompt log는 `docs/prompt-logs/YYYY-MM-DD.md` 형식으로 기록한다.
- 파일 안에서는 execution log와 같은 `PR-xxx` 섹션을 사용한다.
- 각 섹션은 최소 아래를 포함한다.
  - 사용자 원문 프롬프트
  - 작업용 정리 프롬프트
  - 제약 / 참고 문서
  - 연결 execution log
  - 비고

### Scaffolding command
- `npm run harness:prompt-log -- --pr PR-001 --title "..."` 명령으로 날짜 파일과 PR 섹션 템플릿을 생성한다.
- 필요하면 `--user-prompt`, `--working-prompt`, `--execution-log` 옵션으로 실제 내용을 함께 채운다.
- 긴 프롬프트는 `--user-prompt-file`, `--working-prompt-file`로 파일 입력도 받을 수 있게 한다.

### Logging rule
- execution log는 결과 중심으로 남긴다.
- prompt log는 입력 중심으로 남긴다.
- 두 로그는 같은 날짜 / PR 섹션명과 경로 링크로 서로 연결한다.

## Test strategy
### Automated checks
- `npm run harness:repo`
- `npm run harness:scenarios`
- `npm run lint`
- `npm run typecheck`

### Manual checks
- `npm run harness:prompt-log -- --help`로 사용법이 출력된다.
- `npm run harness:prompt-log -- --date 2026-04-04 --pr PR-999 --title "sample"` 실행 시 날짜 파일과 PR 섹션이 생성된다.
- 같은 PR로 재실행하면 중복 섹션을 만들지 않는다.
- docs index와 README에서 prompt log 경로와 명령을 찾을 수 있다.

## Risks
- prompt log가 단순 복붙 문서가 되면 유지 비용만 늘 수 있다.
- 민감한 내용을 그대로 적으면 observability 원칙과 충돌할 수 있다.
- execution log와 prompt log의 PR 번호가 어긋나면 추적성이 떨어진다.

## Mitigation
- 템플릿에 execution log 연결 경로를 강제한다.
- AGENTS에 민감 정보 기록 금지 규칙을 추가한다.
- 스캐폴딩 명령이 날짜 파일과 PR 섹션 형식을 고정한다.

## Exit criteria
- `docs/prompt-logs/README.md`가 존재한다.
- `npm run harness:prompt-log` 명령이 동작한다.
- `AGENTS.md`, README, docs index, harness 문서가 prompt log 정책을 설명한다.
- 오늘자 prompt log와 execution log가 함께 기록된다.
