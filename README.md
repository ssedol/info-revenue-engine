# Info Revenue Engine

광고수익형 정보사이트를 반복 제작하기 위한 Core Engine과, 그 첫 구현체인 `자격증 인사이트` 사이트입니다.

프로젝트 구조와 작업 기준은 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)를 먼저 확인하세요.

## MVP Boundary

- Next.js + TypeScript strict + Vercel 기준
- 콘텐츠는 `src/sites/certifications/articles.ts`의 정적 TypeScript 배열로 관리
- PostgreSQL, Supabase, Prisma, ORM, DB migration, Auth, 회원가입, 로그인 없음
- API collector/normalize/validate/publish는 후순위 수동 스크립트로만 유지하며 dev/build 필수 흐름이 아님
- 외부 키와 광고 ID가 없어도 placeholder로 lint, typecheck, test, build 가능

## Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment

`.env.example`을 기준으로 필요한 값만 채웁니다. 비어 있는 값은 placeholder로 처리됩니다.
