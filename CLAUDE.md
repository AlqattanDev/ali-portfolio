# Ali Portfolio - Development Guidelines

Last updated: 2025-09-07

## Project Overview
Modern portfolio website for Ali AlQattan built with Astro, featuring digital and print modes.

## Active Technologies
- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
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
- 001-enhancing-the-overall: Redesigned mode switcher with sun/QR icons
- Updated name to "Ali AlQattan" throughout
- Fixed CSS loading issues with embedded styles
- Configured GitHub Pages deployment with base path

## Development Notes
- Base path configured for GitHub Pages: `/ali-portfolio`
- Print mode uses QR code icon, digital mode uses sun icon
- Styles are embedded in Layout for reliability

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->