# RAG Y Tế Nhi Khoa - Hệ thống hỗ trợ chẩn đoán viêm phổi

Hệ thống RAG (Retrieval-Augmented Generation) có kiểm soát cho chẩn đoán hình ảnh viêm phổi Nhi khoa từ X-quang ngực, dữ liệu lâm sàng và tri thức nội bộ.

## 🎯 Mục tiêu

- Hỗ trợ bác sĩ tra cứu guideline, SOP, protocol nội bộ
- Giải thích kết quả detector (XAI) với citation đầy đủ
- Sinh nháp báo cáo có cấu trúc với human-in-the-loop
- Đảm bảo provenance, audit trail và an toàn y tế

## 🏗️ Kiến trúc

```
Frontend (Next.js 14)
    ↓
Backend Serverless (Next.js API Routes)
    ↓
Database (Supabase: PostgreSQL + Storage + Auth)
```

## 📋 Tính năng chính

### 11 màn hình (S00-S11)
- **S00**: Login với RBAC (4 roles)
- **S01**: Dashboard & Worklist
- **S02**: Knowledge Query (RAG với citation)
- **S03**: Episode Workspace (detector output + XAI)
- **S04**: Template Selection
- **S05**: Draft Report Review (trung tâm workflow)
- **S06**: Approval/Rejection Modal
- **S07**: Compare Models (champion vs challenger)
- **S08-S09**: Knowledge Base Management
- **S10-S11**: Audit Console & Incident Detail

### 8 nguyên tắc y tế (MED-01..08)
- ✅ Intended use first
- ✅ Human review by default
- ✅ Provenance visible
- ✅ Fail closed
- ✅ Least surprise
- ✅ Separation AI/approved content
- ✅ Role-based visibility
- ✅ Auditability

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: TailwindCSS 3.x + shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State**: Zustand + TanStack Query
- **Mock**: MSW (Mock Service Worker)
- **Testing**: Vitest + React Testing Library + Playwright
- **Storybook**: Storybook 8

### Backend
- **Runtime**: Next.js API Routes + Vercel Edge Functions
- **Database**: Supabase (PostgreSQL + Storage + Auth)
- **Deployment**: Vercel

## 📦 Cấu trúc project

```
bvnhidong/
├── apps/
│   └── web/                    # Next.js app
│       ├── src/
│       │   ├── app/            # App Router (routes)
│       │   ├── features/       # Feature modules
│       │   ├── components/     # Shared components
│       │   ├── lib/            # Utilities
│       │   └── stores/         # Zustand stores
│       ├── public/
│       └── tests/
├── docs/                       # Tài liệu kỹ thuật
├── note/                       # Đề cương nghiên cứu
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ hoặc 20+
- pnpm 8+ (recommended) hoặc npm/yarn

### Installation

```bash
# Clone repository
git clone https://github.com/KhoaMinhPMK/rag_web.git
cd rag_web

# Install dependencies
pnpm install

# Setup environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local với Supabase credentials

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript check
pnpm format           # Format code với Prettier

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run E2E tests với Playwright
pnpm test:coverage    # Generate coverage report

# Storybook
pnpm storybook        # Start Storybook
pnpm build-storybook  # Build Storybook static
```

## 📚 Tài liệu

- [Đề cương nghiên cứu](./note/de_cuong_nghien_cuu.md)
- [Yêu cầu hệ thống RAG](./docs/yeu_cau_he_thong_rag.md)
- [PRD UI/UX](./docs/prd_ui_flow_y_te_rag.md)
- [Wireflow chi tiết](./docs/wireflow_screen_by_screen_ui_rag.md)
- [MVP Implementation Plan](./docs/mvp_ui_ux_plan.md)
- [Post-processing Spec](./docs/pcxr_post_processing_spec.md)

## 🔐 RBAC - Vai trò người dùng

| Vai trò | Quyền hạn |
|---------|-----------|
| **Bác sĩ lâm sàng** | Xem episode, query guideline, tạo draft (hạn chế) |
| **Bác sĩ CĐHA** | Xem episode, tạo draft, review, approve/reject |
| **Nghiên cứu viên** | Xem tất cả, compare models, export data |
| **Admin** | Quản lý knowledge base, audit, system config |

## 🧪 Testing Strategy

- **Unit tests**: Components, utilities, hooks
- **Integration tests**: API routes, database operations
- **E2E tests**: Critical user flows (login → episode → draft → approve)
- **Safety tests**: RBAC, provenance, fail-closed scenarios
- **A11y tests**: WCAG 2.1 compliance

## 📊 Roadmap

### Phase 1: Foundation (Tuần 1-2) ✅
- [x] Project setup
- [x] Design system
- [x] Mock data layer

### Phase 2: Core Screens (Tuần 3-6) 🚧
- [ ] S00 Login + S01 Dashboard
- [ ] S02 Knowledge Query
- [ ] S03 Episode Workspace
- [ ] S05 Draft Review

### Phase 3: Advanced Screens (Tuần 7-9)
- [ ] S06 Approval + S07 Compare
- [ ] S08-S09 Knowledge Management
- [ ] S10-S11 Audit Console

### Phase 4: Integration & Polish (Tuần 10-12)
- [ ] Supabase integration
- [ ] Testing & A11y
- [ ] Documentation & Deployment

## 🤝 Contributing

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/S02-knowledge-query

# Make changes, commit với conventional commits
git add .
git commit -m "feat(knowledge): implement citation drawer"

# Push và create PR
git push origin feature/S02-knowledge-query
```

### Commit Convention

```
feat: Tính năng mới
fix: Sửa bug
docs: Cập nhật tài liệu
style: Format code (không ảnh hưởng logic)
refactor: Refactor code
test: Thêm/sửa tests
chore: Cập nhật build tools, dependencies
```

## 📄 License

Proprietary - Bệnh viện Nhi Đồng

## 👥 Team

- **Product Owner**: [Tên]
- **Tech Lead**: [Tên]
- **Frontend Engineer**: [Tên]
- **Backend Engineer**: [Tên]
- **ML Engineer**: [Tên]
- **QA Engineer**: [Tên]

## 📞 Contact

- **Email**: [email]
- **Slack**: #rag-y-te-nhi-khoa
- **Issues**: [GitHub Issues](https://github.com/KhoaMinhPMK/rag_web/issues)

---

**⚠️ Lưu ý**: Hệ thống này là công cụ hỗ trợ, không thay thế quyết định chuyên môn của bác sĩ.
