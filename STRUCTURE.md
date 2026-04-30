# Project Structure

```
bvnhidong/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── .husky/
│   ├── commit-msg                 # Commitlint hook
│   └── pre-commit                 # Lint-staged hook
├── .vscode/
│   ├── extensions.json            # Recommended extensions
│   └── settings.json              # Workspace settings
├── apps/
│   └── web/                       # Next.js application
│       ├── src/
│       │   ├── app/               # App Router (Next.js 14)
│       │   │   ├── globals.css    # Global styles + Tailwind
│       │   │   ├── layout.tsx     # Root layout
│       │   │   └── page.tsx       # Homepage
│       │   ├── lib/
│       │   │   └── utils.ts       # Utility functions (cn)
│       │   └── test/
│       │       └── setup.ts       # Vitest setup
│       ├── tests/
│       │   └── e2e/
│       │       └── basic.spec.ts  # Playwright E2E tests
│       ├── .env.example           # Environment variables template
│       ├── next.config.js         # Next.js configuration
│       ├── package.json           # Web app dependencies
│       ├── playwright.config.ts   # Playwright configuration
│       ├── postcss.config.js      # PostCSS configuration
│       ├── tailwind.config.js     # Tailwind configuration
│       ├── tsconfig.json          # TypeScript configuration
│       └── vitest.config.ts       # Vitest configuration
├── docs/                          # Technical documentation
│   ├── mvp_ui_ux_plan.md
│   ├── prd_ui_flow_y_te_rag.md
│   ├── wireflow_screen_by_screen_ui_rag.md
│   ├── yeu_cau_he_thong_rag.md
│   └── pcxr_post_processing_spec.md
├── note/                          # Research documentation
│   └── de_cuong_nghien_cuu.md
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── commitlint.config.js
├── package.json                   # Root package.json
├── pnpm-workspace.yaml            # pnpm workspace config
└── README.md
```

## Next Steps

### Phase 1: Design System (Tuần 1-2)
- [ ] Install shadcn/ui components
- [ ] Create medical-specific components
- [ ] Setup Storybook
- [ ] Create mock data layer

### Phase 2: Core Screens (Tuần 3-6)
- [ ] S00 Login + RBAC
- [ ] S01 Dashboard
- [ ] S02 Knowledge Query
- [ ] S03 Episode Workspace
- [ ] S05 Draft Review

### Phase 3: Advanced Features (Tuần 7-9)
- [ ] S06 Approval Modal
- [ ] S07 Compare Models
- [ ] S08-S09 Knowledge Management
- [ ] S10-S11 Audit Console

### Phase 4: Integration (Tuần 10-12)
- [ ] Supabase integration
- [ ] MSW mock layer
- [ ] E2E testing
- [ ] Deployment to Vercel
