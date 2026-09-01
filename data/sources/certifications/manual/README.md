# 컴퓨터활용능력 1급 수동 시험장 일정

공식 시험장 조회에서 직접 확인한 일정만 `korcham-computer-level-1-schedules.json`에 추가합니다.
자동수집된 지역별 개설 공지와 함께 자격증 상세페이지에 표시됩니다.

```json
{
  "schedules": [
    {
      "region": "서울특별시",
      "chamber": "서울",
      "venue": "시험장 공식 명칭",
      "examType": "필기",
      "examDate": "2026-09-20",
      "startTime": "10:30",
      "note": "선택 정보",
      "officialUrl": "https://license.korcham.net/ex/dailyExamPlaceConf.do",
      "verifiedAt": "2026-09-01"
    }
  ]
}
```

- `examType`은 `필기` 또는 `실기`만 허용합니다.
- 날짜는 `YYYY-MM-DD`, 시간은 `HH:mm` 형식입니다.
- `officialUrl`과 `verifiedAt`은 필수입니다.
- 확인되지 않은 일정이나 잔여석을 추측해서 입력하지 않습니다.
