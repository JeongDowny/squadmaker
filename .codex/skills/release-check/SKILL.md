# release-check

## Purpose
출시 직전 또는 큰 UI 변경 후 마지막 품질 게이트를 정리하는 스킬이다.

## Default review items
- 최신 execution log가 기록됐는지
- 최신 prompt log가 execution log와 같은 PR 단위로 연결됐는지
- active exec-plan의 검증 항목이 채워졌는지
- 스크린샷 리뷰 결과가 남아 있는지
- `npm run build`가 성공하는지

## Output
- release ready / not ready
- blocker 목록
- 남은 follow-up
