# harness/README.md

## Purpose
이 디렉토리는 구현 작업을 실행하고 검증하는 하네스 운영 자산을 모은다.

## Layout
- `config/`
  - repository/application harness 공용 manifest
- `scenarios/`
  - 기능별 실행-검증 시나리오 JSON
- `fixtures/`
  - 예시 선수, 경기, 스크린샷 기준 자산
- `evals/`
  - 체크리스트와 점수 계산, 시나리오 검증 로직
- `reports/`
  - 최신 실행 결과와 히스토리 요약

## Suggested loop
1. active exec-plan을 갱신한다.
2. `npm run harness:prompt-log -- --pr PR-001 --title "..."`로 prompt log 틀을 만든다.
3. `npm run harness:seed`
4. 구현한다.
5. `npm run harness:repo`
6. `npm run harness:scenarios`
7. UI 변경이면 `npm run harness:capture`
8. `npm run harness:report`
9. execution log와 prompt log를 함께 남긴다.

`npm run harness:capture`는 현재 Playwright visual test를 실행해 데스크톱/모바일 스크린샷을 `harness/reports/latest/screenshots/`에 저장한다.
`npm run harness:prompt-log`는 `docs/prompt-logs/YYYY-MM-DD.md` 파일과 PR 섹션 템플릿을 생성한다.
