#!/bin/bash
set -e

echo "# 🎨 Color Palette Analysis" > COLOR_REPORT.md
echo "Generated on: $(date)" >> COLOR_REPORT.md
echo "" >> COLOR_REPORT.md

echo "## Extracted Colors from CSS" >> COLOR_REPORT.md
echo "" >> COLOR_REPORT.md

# Extract hex colors
echo "### Hex Colors" >> COLOR_REPORT.md
find dist -name "*.css" -exec grep -h -o '#[0-9a-fA-F]\{3,6\}' {} \; | \
  sort -u | \
  while read color; do
    echo "- \`$color\` ![Color](https://via.placeholder.com/20/$color/000000?text=+)" >> COLOR_REPORT.md
  done

echo "" >> COLOR_REPORT.md

# Extract RGB colors
echo "### RGB Colors" >> COLOR_REPORT.md
find dist -name "*.css" -exec grep -h -o 'rgb([^)]*)' {} \; | \
  sort -u | head -20 | \
  while read color; do
    echo "- \`$color\`" >> COLOR_REPORT.md
  done

echo "" >> COLOR_REPORT.md

# Extract HSL colors
echo "### HSL Colors" >> COLOR_REPORT.md
find dist -name "*.css" -exec grep -h -o 'hsl([^)]*)' {} \; | \
  sort -u | head -20 | \
  while read color; do
    echo "- \`$color\`" >> COLOR_REPORT.md
  done

echo "" >> COLOR_REPORT.md

# Color usage frequency
echo "### Color Usage Frequency" >> COLOR_REPORT.md
find dist -name "*.css" -exec grep -h -o '#[0-9a-fA-F]\{3,6\}' {} \; | \
  sort | uniq -c | sort -nr | head -10 | \
  while read count color; do
    echo "- \`$color\`: Used $count times" >> COLOR_REPORT.md
  done

echo "" >> COLOR_REPORT.md
echo "## Color Palette Recommendations" >> COLOR_REPORT.md
echo "- Limit primary colors to 3-5 main colors" >> COLOR_REPORT.md
echo "- Use consistent color naming/variables" >> COLOR_REPORT.md
echo "- Ensure sufficient contrast ratios (4.5:1 minimum)" >> COLOR_REPORT.md
echo "- Consider implementing CSS custom properties for color management" >> COLOR_REPORT.md

cat COLOR_REPORT.md
