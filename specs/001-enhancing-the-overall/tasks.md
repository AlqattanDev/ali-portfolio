# Tasks: Portfolio Design Enhancement

**Input**: Design documents from `/specs/001-enhancing-the-overall/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: Astro 4.x, TypeScript/JavaScript, CSS-in-JS
   → Structure: Single project (static site)
2. Load design documents:
   → data-model.md: Visual design system tokens
   → contracts/: Visual regression, accessibility, performance tests
   → quickstart.md: Validation scenarios
3. Generate tasks by category:
   → Setup: Design system foundation, testing tools
   → Tests: Visual regression baselines, accessibility audits
   → Core: Design system implementation, component styling
   → Integration: Responsive behavior, cross-browser testing
   → Polish: Performance optimization, final validation
4. Applied task rules:
   → Different components = mark [P] for parallel
   → Shared layout files = sequential (no [P])
   → Baseline tests before implementation (Design-DD)
5. Tasks numbered T001-T027
6. Dependencies: Baselines → Implementation → Validation
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files/components, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Current structure: Astro components in `src/components/`, layouts in `src/layouts/`

## Phase 3.1: Setup and Foundation

- [ ] **T001** Create visual regression testing setup with Playwright MCP tools
- [ ] **T002** [P] Install and configure accessibility testing tools (axe-core, Lighthouse CLI)
- [ ] **T003** [P] Set up performance monitoring with Lighthouse CI configuration

## Phase 3.2: Design System Foundation (Must Complete Before Styling)

**CRITICAL: These baseline tests MUST be established before ANY visual changes**

- [ ] **T004** [P] Visual regression baseline: Capture current homepage desktop (1280x800) in `/tests/visual/baseline-desktop.png`
- [ ] **T005** [P] Visual regression baseline: Capture current homepage tablet (768x1024) in `/tests/visual/baseline-tablet.png`
- [ ] **T006** [P] Visual regression baseline: Capture current homepage mobile (375x667) in `/tests/visual/baseline-mobile.png`
- [ ] **T007** [P] Accessibility audit baseline: Run axe-core and document current violations in `/tests/accessibility/baseline-audit.md`
- [ ] **T008** [P] Performance baseline: Run Lighthouse and document current scores in `/tests/performance/baseline-metrics.md`

## Phase 3.3: Design System Implementation (Only After Baselines)

- [ ] **T009** [P] Implement color palette CSS custom properties in `src/layouts/Layout.astro` (digital + print modes)
- [ ] **T010** [P] Implement typography system with Inter + JetBrains Mono fonts in `src/layouts/Layout.astro`
- [ ] **T011** [P] Implement responsive spacing system with CSS custom properties in `src/layouts/Layout.astro`
- [ ] **T012** [P] Implement responsive breakpoint system with mobile-first approach in `src/layouts/Layout.astro`

## Phase 3.4: Component Enhancement

- [ ] **T013** [P] Enhance Header component ASCII art styling with new typography system in `src/components/Header.astro`
- [ ] **T014** [P] Enhance mode switcher with sun/QR code icons and improved interactions in `src/components/Header.astro`
- [ ] **T015** [P] Enhance project grid layout with CSS Grid implementation in `src/components/Section.astro`
- [ ] **T016** [P] Enhance project entry cards with improved visual hierarchy in `src/components/ProjectEntry.astro`
- [ ] **T017** [P] Enhance skills grid with better responsive behavior in `src/components/Skills.astro`

## Phase 3.5: Interactive Elements and Animations

- [ ] **T018** [P] Implement hover effects and micro-animations with hardware acceleration in `src/layouts/Layout.astro`
- [ ] **T019** [P] Implement focus indicators meeting WCAG requirements in `src/layouts/Layout.astro`
- [ ] **T020** [P] Add prefers-reduced-motion support for accessibility in `src/layouts/Layout.astro`
- [ ] **T021** Implement smooth mode switching animations between digital/print themes in `src/layouts/Layout.astro`

## Phase 3.6: Print and Accessibility Optimization

- [ ] **T022** [P] Optimize print CSS with proper A4 layout and QR code visibility in `src/layouts/Layout.astro`
- [ ] **T023** [P] Implement ARIA labels and semantic structure improvements in `src/components/Header.astro`
- [ ] **T024** [P] Add skip navigation and keyboard accessibility enhancements across components

## Phase 3.7: Validation and Polish

- [ ] **T025** [P] Run visual regression tests and validate against baselines using Playwright MCP tools
- [ ] **T026** [P] Run accessibility audit and achieve zero violations using axe-core
- [ ] **T027** [P] Run performance tests and achieve 95+ Lighthouse score using Lighthouse CLI
- [ ] **T028** Execute complete quickstart.md validation protocol including cross-browser testing
- [ ] **T029** [P] Update documentation with design system guidelines in `CLAUDE.md`

## Dependencies

**Sequential Dependencies:**
- T001-T003 (Setup) → T004-T008 (Baselines) → T009-T024 (Implementation) → T025-T029 (Validation)
- T021 depends on T009-T020 (requires all design system components)
- T028 depends on T025-T027 (requires all validation tests passing)

**Shared File Dependencies:**
- T009-T012, T018-T022 all modify `src/layouts/Layout.astro` (sequential within group)
- T013-T014 both modify `src/components/Header.astro` (T013 then T014)

## Parallel Execution Examples

### Phase 3.2 - Baseline Capture (All Parallel)
```bash
# Launch T004-T008 together:
Task: "Visual regression baseline: Capture current homepage desktop (1280x800)"
Task: "Visual regression baseline: Capture current homepage tablet (768x1024)" 
Task: "Visual regression baseline: Capture current homepage mobile (375x667)"
Task: "Accessibility audit baseline: Run axe-core and document current violations"
Task: "Performance baseline: Run Lighthouse and document current scores"
```

### Phase 3.4 - Component Enhancement (Parallel by Component)
```bash
# Launch T015-T017 together (different components):
Task: "Enhance project grid layout with CSS Grid implementation in src/components/Section.astro"
Task: "Enhance project entry cards with improved visual hierarchy in src/components/ProjectEntry.astro"
Task: "Enhance skills grid with better responsive behavior in src/components/Skills.astro"
```

### Phase 3.7 - Final Validation (All Parallel)
```bash
# Launch T025-T027 together:
Task: "Run visual regression tests and validate against baselines"
Task: "Run accessibility audit and achieve zero violations" 
Task: "Run performance tests and achieve 95+ Lighthouse score"
```

## Testing Commands

### Visual Regression Testing
```bash
# Capture baseline
npm run playwright:screenshot -- --viewport=1280,800 --output=tests/visual/baseline-desktop.png

# Compare after changes
npm run playwright:compare -- tests/visual/baseline-desktop.png tests/visual/current-desktop.png
```

### Accessibility Testing
```bash
# Run automated accessibility audit
npx @axe-core/cli http://localhost:4321/ali-portfolio --save tests/accessibility/audit-results.json

# Manual keyboard testing
# Tab through all interactive elements, verify focus indicators
```

### Performance Testing
```bash
# Run Lighthouse audit
npx lighthouse http://localhost:4321/ali-portfolio --output=json --output-path=tests/performance/lighthouse-results.json

# Check Core Web Vitals
npx lighthouse http://localhost:4321/ali-portfolio --only-categories=performance --view
```

## Success Criteria

### Visual Regression
- All screenshots match baselines within 2% pixel difference
- Mode switcher displays sun icon (digital) and QR code (print)
- Responsive layouts work across all breakpoints

### Accessibility  
- Zero axe-core violations
- All interactive elements keyboard accessible
- Focus indicators visible with 3:1 contrast ratio
- Screen reader compatibility validated

### Performance
- Lighthouse Performance score ≥ 95
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- Total page size < 1.5MB
- Fonts load within 1 second

## Notes

- **[P] tasks** = different files/components, no shared dependencies
- **Design-First Development**: Establish visual baselines before any changes
- **Commit after each task** to maintain clear progress tracking  
- **Mobile-first approach**: Start with mobile styles, enhance for larger screens
- **Accessibility-first**: Every visual change must maintain or improve accessibility

## Validation Checklist
*Applied during execution*

- [x] All contract files have corresponding test tasks (T004-T008, T025-T027)
- [x] All design system components have implementation tasks (T009-T024)
- [x] All baselines come before implementation (T004-T008 → T009-T024)
- [x] Parallel tasks are truly independent (different files/components)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task without dependency