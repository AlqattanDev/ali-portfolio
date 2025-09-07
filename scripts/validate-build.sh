#!/bin/bash
# Validate build outputs without requiring browser installation
# This script provides basic validation that can run in any CI environment

set -e

echo "🔍 Starting build validation..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build output directory 'dist' not found"
    exit 1
fi

# Check if index.html exists
if [ ! -f "dist/index.html" ]; then
    echo "❌ dist/index.html not found - build may have failed"
    exit 1
fi

# Check if index.html has basic content
if ! grep -q "Ali" dist/index.html; then
    echo "❌ index.html doesn't contain expected content"
    exit 1
fi

# Check for CSS/JS assets
if [ ! -d "dist/_astro" ]; then
    echo "⚠️ dist/_astro directory not found - assets may not be built"
else
    echo "✅ Assets directory found"
fi

# Basic HTML validation
if command -v tidy >/dev/null 2>&1; then
    echo "🔍 Running basic HTML validation..."
    tidy -q -e dist/index.html || echo "⚠️ HTML validation warnings found"
else
    echo "ℹ️ HTML tidy not available, skipping HTML validation"
fi

# Check file sizes (ensure files aren't empty)
html_size=$(wc -c < "dist/index.html")
if [ "$html_size" -lt 100 ]; then
    echo "❌ index.html is suspiciously small ($html_size bytes)"
    exit 1
fi

echo "✅ Build validation completed successfully"
echo "📊 Build statistics:"
echo "   - index.html: $html_size bytes"
echo "   - Total files: $(find dist -type f | wc -l)"
echo "   - Total size: $(du -sh dist | cut -f1)"