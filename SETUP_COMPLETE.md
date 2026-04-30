# ✅ Setup Complete - Sprint 0

## 📦 Đã hoàn thành

### 1. Git Repository Setup
- ✅ Initialized Git repository
- ✅ Created `.gitignore` with comprehensive exclusions
- ✅ Setup branch `main`
- ✅ Added remote origin: `https://github.com/KhoaMinhPMK/rag_web.git`
- ✅ 2 commits ready to push

### 2. Project Structure
- ✅ Monorepo với pnpm workspace
- ✅ Next.js 14 App Router
- ✅ TypeScript strict mode
- ✅ Folder structure theo MVP plan

### 3. Development Tools
- ✅ ESLint + Prettier
- ✅ Husky + lint-staged + commitlint
- ✅ Vitest (unit tests)
- ✅ Playwright (E2E tests)
- ✅ GitHub Actions CI workflow

### 4. Styling & UI
- ✅ TailwindCSS 3.x
- ✅ Medical-specific design tokens
- ✅ shadcn/ui ready (chưa install components)
- ✅ Global CSS với CSS variables

### 5. Documentation
- ✅ README.md (comprehensive)
- ✅ CONTRIBUTING.md (Git workflow, conventions)
- ✅ STRUCTURE.md (project structure, roadmap)
- ✅ All technical specs in `docs/`

---

## 🚀 Next Steps - Để push lên GitHub

### Bước 1: Configure Git User
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Bước 2: Setup GitHub Authentication

**Option A: Personal Access Token (Recommended)**
```bash
# Tạo token tại: https://github.com/settings/tokens
# Permissions: repo (full control)

# Khi push, dùng token làm password:
git push -u origin main
# Username: KhoaMinhPMK
# Password: ghp_xxxxxxxxxxxxxxxxxxxx (token)
```

**Option B: SSH Key**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Paste vào GitHub: https://github.com/settings/keys

# Change remote to SSH
git remote set-url origin git@github.com:KhoaMinhPMK/rag_web.git

# Push
git push -u origin main
```

### Bước 3: Push Code
```bash
git push -u origin main
```

---

## 📋 Checklist trước khi bắt đầu development

- [ ] Git credentials configured
- [ ] Code pushed to GitHub
- [ ] Install dependencies: `pnpm install`
- [ ] Create `.env.local` from `.env.example`
- [ ] Run dev server: `pnpm dev`
- [ ] Verify http://localhost:3000 works

---

## 🎯 Sprint 1 - Design System (Tuần 1-2)

### Task #1: Setup design system và component library
**Status**: Pending

**Subtasks**:
1. Install shadcn/ui CLI
   ```bash
   pnpm dlx shadcn-ui@latest init
   ```

2. Install base components
   ```bash
   pnpm dlx shadcn-ui@latest add button
   pnpm dlx shadcn-ui@latest add card
   pnpm dlx shadcn-ui@latest add input
   pnpm dlx shadcn-ui@latest add label
   pnpm dlx shadcn-ui@latest add select
   pnpm dlx shadcn-ui@latest add textarea
   pnpm dlx shadcn-ui@latest add badge
   pnpm dlx shadcn-ui@latest add dialog
   pnpm dlx shadcn-ui@latest add drawer
   pnpm dlx shadcn-ui@latest add dropdown-menu
   ```

3. Create medical components
   - `StatusChip` (draft, under_review, approved, etc.)
   - `FieldBadge` (AI, Manual, Locked)
   - `ProvenanceChip` (citation link)
   - `WarningBanner` (warning, danger, info)
   - `IntendedUseTag` (medical disclaimer)

4. Setup Storybook
   ```bash
   pnpm dlx storybook@latest init
   ```

5. Create mock data layer
   - Mock detector output
   - Mock LLM responses
   - Mock RAG citations
   - Mock episodes, drafts, audit events

**Estimated**: 1 week

---

## 📊 Current Status

```
Project: bvnhidong (RAG Y Tế Nhi Khoa)
Phase: Sprint 0 - Foundation ✅
Next: Sprint 1 - Design System

Progress:
[████████░░░░░░░░░░░░] 20% (2/10 sprints)

Completed:
✅ Git setup
✅ Project structure
✅ Development tools
✅ Documentation

Pending:
⏳ Design system
⏳ Mock data layer
⏳ Core screens (S00-S05)
⏳ Advanced screens (S06-S11)
⏳ Backend integration
⏳ Testing & deployment
```

---

## 🔧 Troubleshooting

### Issue: `pnpm install` fails
```bash
# Clear cache
pnpm store prune

# Retry
pnpm install --force
```

### Issue: Port 3000 already in use
```bash
# Kill process
npx kill-port 3000

# Or use different port
pnpm dev -- -p 3001
```

### Issue: TypeScript errors
```bash
# Rebuild
pnpm typecheck

# Clear Next.js cache
rm -rf apps/web/.next
```

---

## 📞 Support

- **Documentation**: Check `docs/` folder
- **Issues**: https://github.com/KhoaMinhPMK/rag_web/issues
- **Slack**: #rag-y-te-nhi-khoa

---

**Generated**: 2026-04-30
**Sprint**: 0 (Foundation)
**Status**: ✅ Complete, ready for Sprint 1
