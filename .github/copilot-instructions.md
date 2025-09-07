# Ali Portfolio - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

**CRITICAL - Known Network Limitations:**
- `npm install` fails due to chromedriver dependency downloading from blocked domain (googlechromelabs.github.io)
- **WORKAROUND REQUIRED:** Install dependencies individually or work with existing dist/ folder
- **NEVER CANCEL** builds or installations - they may appear to hang but are likely downloading dependencies

### Bootstrap and Build Process
- **Node.js Version:** Use Node.js 20+ (tested with v20.19.4)
- **Package Manager:** npm 10.8.2+
- **Core Dependencies Installation:**
  ```bash
  # WARNING: Full npm install fails due to network restrictions
  # Try individual package installation if needed:
  npm install astro@^4.0.0 gsap@^3.13.0 --no-save
  ```
- **Build Process:**
  ```bash
  npm run build
  ```
  - **Expected Time:** 30-60 seconds for clean build
  - **NEVER CANCEL:** Set timeout to 120+ seconds minimum
- **Development Server:**
  ```bash
  npm run dev
  ```
  - **Expected Time:** 10-15 seconds to start
  - **URL:** http://localhost:4321/ali-portfolio/
  - **NEVER CANCEL:** Set timeout to 60+ seconds for initial startup

### Testing Infrastructure
- **Test Runner:** Playwright with 14 test files
- **Test Categories:**
  - Visual regression tests: `npm run test:visual`
  - Accessibility tests: `npm run test:accessibility` (requires Axe CLI)
  - Performance tests: `npm run test:performance` (requires Lighthouse)
  - Integration tests: `npm run test`
- **Test Execution Times:**
  - **Integration tests:** 60-120 seconds - NEVER CANCEL
  - **Visual tests:** 90-180 seconds - NEVER CANCEL  
  - **Performance tests:** 30-60 seconds - NEVER CANCEL
- **Test Server Startup:** Use timeout of 120+ seconds in playwright.config.js

### Alternative Build Testing (When npm install fails)
- **Use existing dist/ folder:**
  ```bash
  # Test built site with Python server
  python3 -m http.server 8080 --directory dist
  # Then test: curl http://localhost:8080/
  ```
- **Manual build validation:**
  ```bash
  # Check if essential files exist
  ls dist/index.html dist/_astro/ dist/favicon.svg
  ```

## Validation

**CRITICAL VALIDATION SCENARIOS:**
1. **Mode Switching Test:**
   - Navigate to http://localhost:4321/ali-portfolio/
   - Click mode toggle button (sun/QR code icon in top-right)
   - Verify digital-view class changes to print-ready styling
   - Check body class switches between "digital-view" and print mode
   - Verify animations disable in print mode

2. **GSAP Animation Validation:**
   - Load the page and observe scroll-triggered animations
   - Check browser console for GSAP loading from CDN (unpkg.com)
   - Verify stagger effects on Contact, Projects, Skills, Education sections
   - Test scroll animations with ScrollTrigger plugin
   - Test on mobile devices for 60fps performance
   - Check "T037 - GSAP Animation System" comment in page source

3. **Content Management Test:**
   - Edit `src/data/profile.json` to update CV information
   - Add new blog post in `src/content/blog/` with frontmatter
   - Run `npm run build` and verify changes reflect in dist/
   - Test that profile data populates correctly in components

4. **Accessibility Test:**
   - Run `npm run test:accessibility` if dependencies available
   - Check for terminal-style contrast compliance
   - Verify prefers-reduced-motion support in animations
   - Test keyboard navigation and screen reader compatibility

**ALWAYS run these validation scenarios after making any changes to:**
- Layout components (src/layouts/Layout.astro)
- Animation system (GSAP integration)
- Styling changes (embedded CSS in Layout.astro)
- Mode switching functionality

## Common Tasks

### Repository Structure
```
src/
├── components/         # UI components (Header, Skills, Education, etc.)
│   ├── Header.astro   
│   ├── Skills.astro   
│   └── ProjectEntry.astro
├── layouts/           # Page layouts
│   └── Layout.astro   # Main layout with embedded CSS & GSAP
├── pages/            # Astro pages
│   ├── index.astro   # Homepage
│   └── blog/         # Blog pages
├── data/             # JSON data
│   └── profile.json  # CV and personal information
└── content/          # Blog content (Markdown)

public/              # Static assets
├── favicon.svg
└── (build outputs to dist/)

tests/              # Test suites
├── accessibility/   # Axe accessibility tests
├── performance/    # Lighthouse performance tests  
├── visual/         # Visual regression tests
└── integration/    # Playwright integration tests
```

### Key Configuration Files
- **astro.config.mjs:** Base path `/ali-portfolio` for GitHub Pages
- **package.json:** All npm scripts and dependencies
- **playwright.config.js:** Test configuration with 120s timeout
- **.lighthouserc.js:** Performance testing configuration

### GSAP Animation System
- **Loading:** CDN-based from unpkg.com with error handling
- **Plugins:** ScrollTrigger for scroll-based animations
- **Performance:** Optimized for 60fps with mobile considerations
- **Accessibility:** Respects prefers-reduced-motion settings
- **Location:** Embedded in src/layouts/Layout.astro

### Deployment
- **GitHub Actions:** Automated deployment via `.github/workflows/`
- **Target:** GitHub Pages at custom domain alialqattan.dev  
- **Build Output:** dist/ directory
- **Deploy Command:** `npm run deploy` (requires build first)

### Common Errors and Solutions
1. **npm install fails:** 
   ```bash
   # Error: ChromeDriver installation failed AxiosError: getaddrinfo ENOTFOUND googlechromelabs.github.io
   # Solution: Use workaround installation or work with existing dist/
   npm install astro@^4.0.0 gsap@^3.13.0 --no-save
   ```
2. **GSAP not loading:** 
   - Check CDN connectivity to unpkg.com
   - Look for "T037 - GSAP Animation System" in page source
   - Fallback error handling implemented in Layout.astro
3. **Base path issues:** 
   - Ensure all URLs include `/ali-portfolio` prefix
   - Check astro.config.mjs base setting
4. **Test timeouts:** 
   - Use 120+ second timeouts for all test commands
   - Playwright config has 120s webServer timeout
5. **Build failures:** 
   - Check TypeScript errors with `npm run build:check`
   - Verify all imports in Astro components are correct

### Content Updates
- **CV Information:** Edit `src/data/profile.json`
  ```json
  {
    "personal": {
      "name": "Ali AlQattan",
      "email": "alqattandev@gmail.com", 
      "tagline": "System Architect description"
    },
    "projects": [...],
    "skills": [...],
    "education": {...}
  }
  ```
- **Blog Posts:** Add `.md` files to `src/content/blog/` with frontmatter:
  ```markdown
  ---
  title: "Post Title"
  description: "Post description"
  publishDate: "2024-01-01"
  tags: ["tag1", "tag2"]
  ---
  # Your content here
  ```
- **Project Details:** Update project entries in profile.json with id, name, status, description, stack
- **Styling:** Modify embedded CSS in `src/layouts/Layout.astro` (styles are embedded for reliability)
- **Mode Switching:** Digital mode (class="digital-view") vs Print mode styling handled in Layout.astro

### Performance Targets
- **Load Time:** Under 3 seconds (validated in quickstart test)
- **GSAP Animations:** 60fps scroll performance
- **Lighthouse Scores:** 95%+ performance, accessibility, best practices, SEO
- **Bundle Size:** Minimal due to Astro's static generation

**REMINDER:** Always set explicit timeouts of 120+ seconds for builds and 180+ seconds for tests. NEVER CANCEL long-running commands.