# Info Revenue Engine

광고수익형 정보사이트를 반복 제작하기 위한 Core Engine과, 그 첫 구현체인 `자격증 인사이트` 사이트입니다.

프로젝트 구조와 작업 기준은 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)를 먼저 확인하세요.

## MVP Boundary

- Next.js + TypeScript strict + Vercel 기준
- 자격증 목록과 2026 시험일정은 빌드 시 Q-Net 공식 API에서 갱신
- `USE_CERTIFICATION_FIXTURE=1`일 때만 개발용 샘플 7개 사용
- PostgreSQL, Supabase, Prisma, ORM, DB migration, Auth, 회원가입, 로그인 없음
- API collector/normalize/validate/publish는 빌드 전에 실행되어 공식 데이터를 검증하고 게시
- Q-Net API 키와 광고 ID가 없어도 lint, typecheck, test, build 가능

## Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment

`.env.example`을 기준으로 필요한 값만 채웁니다. 비어 있는 값은 placeholder로 처리됩니다.
