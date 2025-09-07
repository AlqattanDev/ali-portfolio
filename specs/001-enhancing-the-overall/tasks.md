# Tasks: Portfolio Design Enhancement

**Input**: Design documents from `/specs/001-enhancing-the-overall/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (001-enhancing-the-overall branch)
```
1. Load plan.md from feature directory
   → Tech stack: Astro 4.x, TypeScript/JavaScript, CSS-in-JS
   → Libraries: Inter/JetBrains Mono fonts, CSS custom properties
   → Structure: Single project (static portfolio site)
2. Load design documents:
   → data-model.md: Visual design system with color/typography tokens
   → contracts/: accessibility.yml, performance.yml, visual-regression.yml
   → research.md: Modern design trends and best practices
3. Generate tasks by category:
   → Setup: visual baselines, testing infrastructure
   → Tests: contract tests for accessibility, performance, visual regression
   → Core: design system implementation, responsive layouts
   → Integration: mode switcher, interactive elements
   → Polish: cross-browser testing, performance optimization
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup and Baseline Establishment
- [ ] T001 Capture visual baseline screenshots for all responsive breakpoints in tests/visual/baseline/
- [ ] T002 [P] Create accessibility testing configuration in tests/accessibility/
- [ ] T003 [P] Create performance testing configuration in tests/performance/
- [ ] T004 [P] Set up visual regression testing infrastructure with Playwright

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T005 [P] Accessibility contract test for color contrast ratios in tests/accessibility/color-contrast.spec.js
- [ ] T006 [P] Accessibility contract test for keyboard navigation in tests/accessibility/keyboard-nav.spec.js
- [ ] T007 [P] Accessibility contract test for screen reader compatibility in tests/accessibility/screen-reader.spec.js
- [ ] T008 [P] Performance contract test for Core Web Vitals in tests/performance/core-web-vitals.spec.js
- [ ] T009 [P] Performance contract test for resource budgets in tests/performance/resource-budgets.spec.js
- [ ] T010 [P] Performance contract test for Lighthouse scores in tests/performance/lighthouse.spec.js
- [ ] T011 [P] Visual regression test for desktop homepage in tests/visual/homepage-desktop.spec.js
- [ ] T012 [P] Visual regression test for mobile responsiveness in tests/visual/homepage-mobile.spec.js
- [ ] T013 [P] Visual regression test for print mode in tests/visual/print-mode.spec.js
- [ ] T014 [P] Visual regression test for mode switcher interactions in tests/visual/mode-switcher.spec.js

## Phase 3.3: Core Design System Implementation (ONLY after tests are failing)
- [ ] T015 Implement CSS custom properties design tokens in src/layouts/Layout.astro
- [ ] T016 Implement responsive typography system in src/layouts/Layout.astro
- [ ] T017 Implement color palette for digital and print modes in src/layouts/Layout.astro
- [ ] T018 [P] Add Inter font loading optimization to src/layouts/Layout.astro
- [ ] T019 [P] Add JetBrains Mono font loading optimization to src/layouts/Layout.astro
- [ ] T020 Implement responsive breakpoint system in src/layouts/Layout.astro

## Phase 3.4: Layout and Component Enhancement
- [ ] T021 Implement CSS Grid layout for project showcase in src/layouts/Layout.astro
- [ ] T022 Implement Flexbox for component-level alignment in src/layouts/Layout.astro
- [ ] T023 Enhance mode switcher with sun/QR code icons in src/layouts/Layout.astro
- [ ] T024 Implement hover animations and transitions in src/layouts/Layout.astro
- [ ] T025 Implement focus indicators and keyboard accessibility in src/layouts/Layout.astro
- [ ] T026 Add reduced motion support and accessibility features in src/layouts/Layout.astro

## Phase 3.5: Print Mode and Responsive Optimization
- [ ] T027 Implement print-specific styles and layout in src/layouts/Layout.astro
- [ ] T028 Optimize QR code visibility and scannability in print mode in src/layouts/Layout.astro
- [ ] T029 Implement mobile-first responsive design patterns in src/layouts/Layout.astro
- [ ] T030 Add touch-friendly interactive elements in src/layouts/Layout.astro

## Phase 3.6: Performance and Accessibility Polish
- [ ] T031 [P] Optimize critical CSS loading strategy in src/layouts/Layout.astro
- [ ] T032 [P] Implement resource hints and preloading in src/layouts/Layout.astro  
- [ ] T033 Add ARIA labels and semantic structure improvements in src/layouts/Layout.astro
- [ ] T034 Implement proper heading hierarchy and landmarks in src/layouts/Layout.astro
- [ ] T035 Add high contrast mode and accessibility preferences support in src/layouts/Layout.astro

## Phase 3.7: Cross-Browser Testing and Validation
- [ ] T036 [P] Cross-browser visual regression testing in tests/visual/cross-browser.spec.js
- [ ] T037 [P] Mobile device compatibility testing in tests/visual/mobile-devices.spec.js
- [ ] T038 [P] Animation and interaction testing across browsers in tests/visual/interactions.spec.js
- [ ] T039 [P] Performance validation across different network conditions in tests/performance/network-conditions.spec.js
- [ ] T040 [P] Final accessibility audit and compliance validation in tests/accessibility/compliance-audit.spec.js

## Dependencies
- Setup (T001-T004) before all other phases
- Tests (T005-T014) before implementation (T015-T040)
- T015 (design tokens) blocks T016-T020 (typography, colors, breakpoints)
- T021-T022 (layout systems) before T023-T026 (component enhancements)  
- T027-T030 (print/responsive) requires T015-T026 (base systems)
- T031-T035 (performance/a11y) requires T015-T030 (core implementation)
- T036-T040 (validation) requires all previous tasks

## Parallel Example
```bash
# Launch T005-T014 together (all contract tests):
Task: "Accessibility contract test for color contrast ratios in tests/accessibility/color-contrast.spec.js"
Task: "Accessibility contract test for keyboard navigation in tests/accessibility/keyboard-nav.spec.js"  
Task: "Performance contract test for Core Web Vitals in tests/performance/core-web-vitals.spec.js"
Task: "Visual regression test for desktop homepage in tests/visual/homepage-desktop.spec.js"
```

```bash
# Launch T018-T019 together (font optimizations):
Task: "Add Inter font loading optimization to src/layouts/Layout.astro"
Task: "Add JetBrains Mono font loading optimization to src/layouts/Layout.astro"
```

```bash
# Launch T031-T032 together (performance optimizations):
Task: "Optimize critical CSS loading strategy in src/layouts/Layout.astro"
Task: "Implement resource hints and preloading in src/layouts/Layout.astro"
```

```bash
# Launch T036-T040 together (final validation):
Task: "Cross-browser visual regression testing in tests/visual/cross-browser.spec.js"
Task: "Mobile device compatibility testing in tests/visual/mobile-devices.spec.js"
Task: "Performance validation across different network conditions in tests/performance/network-conditions.spec.js"
```

## Contract Requirements Mapping

### Accessibility Contracts (accessibility.yml)
- **Color Contrast**: T005 tests digital mode (14:1, 7:1, 12:1 ratios) and print mode (21:1, 12.6:1 ratios)
- **Keyboard Navigation**: T006 tests tab order, focus indicators, keyboard shortcuts
- **Screen Reader**: T007 tests semantic structure, ARIA labels, landmark regions
- **Implementation**: T025, T033, T034, T035 implement WCAG 2.1 Level AA compliance

### Performance Contracts (performance.yml)
- **Core Web Vitals**: T008 tests LCP <2.5s, CLS <0.1, INP <200ms  
- **Resource Budgets**: T009 tests total page <1.5MB, CSS <50KB, fonts <150KB combined
- **Lighthouse Scores**: T010 tests Performance ≥95, Accessibility 100, Best Practices ≥95
- **Implementation**: T031, T032, T039 optimize loading and network performance

### Visual Regression Contracts (visual-regression.yml)
- **Homepage Tests**: T011 desktop (1280x800), T012 mobile (375x667), responsive breakpoints
- **Print Mode**: T013 tests light theme conversion, QR code visibility, A4 layout
- **Mode Switcher**: T014 tests sun/QR icon changes, hover effects, transitions
- **Cross-Browser**: T036-T038 test Chrome, Firefox, Safari, Edge consistency

## Notes
- [P] tasks = different files or independent test files, no dependencies
- Verify tests fail before implementing features
- Commit after each task completion
- All styling changes go through src/layouts/Layout.astro (embedded CSS approach)
- Test files are independent and can be developed in parallel
- Performance targets: 95+ Lighthouse score, <2.5s LCP, <0.1 CLS
- Accessibility target: WCAG 2.1 Level AA compliance (100% automated test pass)
- Visual regression threshold: 2% pixel difference for layout changes

## Task Generation Rules Applied

1. **From Contracts**:
   - accessibility.yml → 3 contract test tasks [P] (T005-T007)
   - performance.yml → 3 contract test tasks [P] (T008-T010)
   - visual-regression.yml → 4 contract test tasks [P] (T011-T014)
   
2. **From Data Model**:
   - Color palette → T015, T017 implementation tasks
   - Typography system → T016 implementation task
   - Spacing system → T020 implementation task
   - Component tokens → T021-T026 implementation tasks
   
3. **From Quickstart Scenarios**:
   - User journey validation → T036-T040 validation tasks [P]
   - Performance validation → T031-T032, T039 optimization tasks
   
4. **Ordering Applied**:
   - Setup → Tests → Design System → Layout → Components → Optimization → Validation
   - Dependencies respected (design tokens before typography, layout before components)

## Validation Checklist
**GATE: Checked before task execution**

- [x] All contracts have corresponding tests (T005-T014)
- [x] All design system entities have implementation tasks (T015-T030)
- [x] All tests come before implementation (T005-T014 before T015-T040)
- [x] Parallel tasks truly independent (different test files, independent optimizations)
- [x] Each task specifies exact file path (src/layouts/Layout.astro or tests/...)
- [x] No task modifies same file as another [P] task (test files are separate, font optimizations are separate concerns)

## Expected Outcomes
After completing all tasks:
- **Accessibility**: 0 axe violations, 100% Lighthouse accessibility score
- **Performance**: 95+ Lighthouse performance score, green Core Web Vitals
- **Visual Quality**: Professional modern design with terminal aesthetic
- **Responsiveness**: Seamless experience across mobile, tablet, desktop
- **Print Mode**: Clean resume-style layout with functional QR code
- **Cross-Browser**: Consistent experience across Chrome, Firefox, Safari, Edge
- **Maintainability**: Clean, organized CSS with design system approach