# Ali Portfolio - Development Guidelines

Last updated: 2025-09-07

## Project Overview
Modern portfolio website for Ali AlQattan built with Astro, featuring digital and print modes.

## Active Technologies
- **Framework**: Astro 4.0
- **Styling**: CSS3 (embedded), Tailwind CSS
- **Animations**: GSAP 3.13.0 with ScrollTrigger plugin
- **Icons**: Lucide React
- **Testing**: Playwright, Axe, Lighthouse
- **Deployment**: GitHub Pages
- **MCP Tools**: Astro Docs integration

## Project Structure
```
src/
├── components/     # Reusable UI components
├── layouts/        # Page layouts
├── pages/          # Astro pages
├── styles/         # Global styles
└── content/        # Content collections (if applicable)

public/            # Static assets
scripts/           # Build and utility scripts
specs/             # Feature specifications
```

## Commands
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run Playwright tests
npm run test:visual  # Visual regression tests
npm run test:accessibility # Axe accessibility audit
npm run test:performance   # Lighthouse performance audit

# Deployment
npm run deploy       # Deploy to GitHub Pages

# Code Quality
npm run lint         # Run linter
npm run format       # Format code with Prettier
```

## MCP Tools Available
- **mcp__astro-docs__search_astro_docs**: Search official Astro documentation
- Use for Astro-specific questions, best practices, and API references

## Code Style
- Follow Astro component conventions
- Use TypeScript for type safety
- Tailwind CSS for styling (utility-first)
- Component naming: PascalCase for components, kebab-case for files
- Keep components small and focused

## Recent Changes
- 002-designing-aligning-and: Advanced scroll animations with GSAP ScrollTrigger
- 001-enhancing-the-overall: Redesigned mode switcher with sun/QR icons
- GSAP integration: Dynamic loading, ScrollTrigger plugin, performance optimization
- Animation system: Contact, Projects, Skills, Education sections with stagger effects

## Development Notes
- Base path configured for GitHub Pages: `/ali-portfolio`
- Print mode uses QR code icon, digital mode uses sun icon
- Styles are embedded in Layout for reliability
- GSAP loaded from CDN: unpkg.com with fallback error handling
- Animations respect prefers-reduced-motion accessibility setting
- Performance target: 60fps scroll animations with mobile optimization

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->