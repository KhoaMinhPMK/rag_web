# Contributing Guide

## Git Workflow

### Branch Naming Convention

```
feature/S00-login-screen
feature/S02-knowledge-query
fix/citation-drawer-bug
refactor/api-client
docs/update-readme
chore/update-dependencies
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build tools, dependencies, config

**Scopes:**
- `auth`: Authentication/Authorization
- `episodes`: Episode management
- `predictions`: Detector predictions
- `drafts`: Draft reports
- `knowledge`: Knowledge base/RAG
- `audit`: Audit trail
- `ui`: UI components
- `api`: API routes
- `db`: Database
- `config`: Configuration

**Examples:**

```bash
feat(auth): implement RBAC middleware for route protection
fix(drafts): resolve citation drawer not opening on field click
docs(readme): update installation instructions
refactor(api): extract API client into separate module
test(episodes): add E2E tests for episode workflow
chore(deps): upgrade Next.js to 14.2.4
```

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/S02-knowledge-query
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(knowledge): implement citation drawer with provenance chain"
   ```

3. **Push to remote**
   ```bash
   git push origin feature/S02-knowledge-query
   ```

4. **Create Pull Request**
   - Go to GitHub
   - Create PR from your branch to `main`
   - Fill in PR template
   - Request review

5. **After PR approval**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/S02-knowledge-query
   ```

## Code Quality

### Before Committing

Pre-commit hooks will automatically run:
- ESLint (auto-fix)
- Prettier (auto-format)
- TypeScript type check

### Manual Checks

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Format
pnpm format

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## Testing

### Unit Tests (Vitest)

```typescript
// src/components/StatusChip.test.tsx
import { render, screen } from '@testing-library/react'
import { StatusChip } from './StatusChip'

describe('StatusChip', () => {
  it('renders draft status correctly', () => {
    render(<StatusChip status="draft" />)
    expect(screen.getByText('Bản nháp')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('should login as radiologist', async ({ page }) => {
  await page.goto('/login')
  await page.selectOption('[name="role"]', 'radiologist')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

## Component Development

### Using Storybook

```bash
pnpm storybook
```

### Component Template

```typescript
// src/components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors/warnings

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

## Questions?

- Check [README.md](./README.md) for setup instructions
- Check [STRUCTURE.md](./STRUCTURE.md) for project structure
- Ask in Slack: #rag-y-te-nhi-khoa
