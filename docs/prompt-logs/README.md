# prompt-logs/README.md

## Purpose
이 디렉터리는 비사소한 변경의 입력 프롬프트를 execution log와 짝으로 기록한다.

## Why
- execution log는 무엇을 판단하고 무엇을 실행했는지 남긴다.
- prompt log는 어떤 사용자 요청과 작업용 재정리 프롬프트에서 출발했는지 남긴다.
- 두 로그를 함께 보면 작업의 입력과 결과를 모두 복원할 수 있다.

## File rule
- 날짜별 파일을 사용한다.
- 예: `2026-04-04.md`
- 파일 안에서는 `PR-001`, `PR-002` 같은 섹션으로 나눈다.

## Section template
- 사용자 원문 프롬프트
- 작업용 정리 프롬프트
- 제약 / 참고 문서
- 연결 execution log
- 비고

## Command
아래 명령으로 날짜 파일과 PR 섹션 템플릿을 만들 수 있다.

```bash
npm run harness:prompt-log -- --pr PR-001 --title "prompt log title"
```

선택 옵션:
- `--date YYYY-MM-DD`
- `--user-prompt "..."` 또는 `--user-prompt-file path`
- `--working-prompt "..."` 또는 `--working-prompt-file path`
- `--execution-log docs/execution-logs/YYYY-MM-DD.md`

## Recording rule
- 사용자 원문 프롬프트는 가능한 한 그대로 남긴다.
- 작업용 정리 프롬프트는 구현자가 실제로 사용한 작업 계약 형태로 남긴다.
- 민감 정보, 토큰, 비밀값은 기록하지 않는다.
- 같은 날짜 / PR 섹션의 execution log를 반드시 연결한다.
