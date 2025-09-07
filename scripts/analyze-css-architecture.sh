#!/bin/bash
set -e

echo "# 🏗️ CSS Architecture Analysis" > CSS_ARCHITECTURE_REPORT.md
echo "Generated on: $(date)" >> CSS_ARCHITECTURE_REPORT.md
echo "" >> CSS_ARCHITECTURE_REPORT.md

echo "## CSS File Analysis" >> CSS_ARCHITECTURE_REPORT.md
find dist -name "*.css" | while read css_file; do
  echo "### Analysis of $css_file" >> CSS_ARCHITECTURE_REPORT.md
  
  # File size
  size=$(wc -c < "$css_file")
  echo "- **File size**: $(($size / 1024))KB" >> CSS_ARCHITECTURE_REPORT.md
  
  # Line count
  lines=$(wc -l < "$css_file")
  echo "- **Lines of code**: $lines" >> CSS_ARCHITECTURE_REPORT.md
  
  # Selector count
  selectors=$(grep -c '{' "$css_file")
  echo "- **CSS selectors**: $selectors" >> CSS_ARCHITECTURE_REPORT.md
  
  # Media queries
  media_queries=$(grep -c '@media' "$css_file")
  echo "- **Media queries**: $media_queries" >> CSS_ARCHITECTURE_REPORT.md
  
  # CSS custom properties
  custom_props=$(grep -c -- '--[a-zA-Z]' "$css_file")
  echo "- **CSS custom properties**: $custom_props" >> CSS_ARCHITECTURE_REPORT.md
  
  # Complexity indicators
  important_count=$(grep -c '!important' "$css_file")
  echo "- **!important declarations**: $important_count" >> CSS_ARCHITECTURE_REPORT.md
  
  # ID selectors (not recommended)
  id_selectors=$(grep -c '#[a-zA-Z]' "$css_file")
  echo "- **ID selectors**: $id_selectors" >> CSS_ARCHITECTURE_REPORT.md
  
  echo "" >> CSS_ARCHITECTURE_REPORT.md
done

echo "## CSS Quality Recommendations" >> CSS_ARCHITECTURE_REPORT.md
echo "- Keep CSS files under 100KB for better performance" >> CSS_ARCHITECTURE_REPORT.md
echo "- Minimize use of !important declarations" >> CSS_ARCHITECTURE_REPORT.md
echo "- Prefer class selectors over ID selectors" >> CSS_ARCHITECTURE_REPORT.md
echo "- Use CSS custom properties for theming" >> CSS_ARCHITECTURE_REPORT.md
echo "- Organize CSS with a consistent methodology (BEM, OOCSS, etc.)" >> CSS_ARCHITECTURE_REPORT.md
echo "- Consider CSS-in-JS or utility-first approaches for component-based apps" >> CSS_ARCHITECTURE_REPORT.md

cat CSS_ARCHITECTURE_REPORT.md
