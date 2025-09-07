#!/bin/bash
set -e

echo "# 📐 Spacing & Layout Analysis" > SPACING_REPORT.md
echo "Generated on: $(date)" >> SPACING_REPORT.md
echo "" >> SPACING_REPORT.md

echo "## Margin Values Used" >> SPACING_REPORT.md
find dist -name "*.css" -exec grep -h -E "margin[^:]*:\s*[^;]+" {} \; | \
  sed 's/.*margin[^:]*:\s*\([^;]*\);.*/\1/' | \
  sort | uniq -c | sort -nr | head -15 | \
  while read count value; do
    echo "- \`$value\`: Used $count times" >> SPACING_REPORT.md
  done

echo "" >> SPACING_REPORT.md

echo "## Padding Values Used" >> SPACING_REPORT.md
find dist -name "*.css" -exec grep -h -E "padding[^:]*:\s*[^;]+" {} \; | \
  sed 's/.*padding[^:]*:\s*\([^;]*\);.*/\1/' | \
  sort | uniq -c | sort -nr | head -15 | \
  while read count value; do
    echo "- \`$value\`: Used $count times" >> SPACING_REPORT.md
  done

echo "" >> SPACING_REPORT.md

echo "## Gap/Grid Spacing" >> SPACING_REPORT.md
find dist -name "*.css" -exec grep -h -E "(gap|grid-gap):\s*[^;]+" {} \; | \
  sed 's/.*(gap|grid-gap):\s*\([^;]*\);.*/\1/' | \
  sort | uniq -c | sort -nr | head -10 | \
  while read count value; do
    echo "- \`$value\`: Used $count times" >> SPACING_REPORT.md
  done

echo "" >> SPACING_REPORT.md

echo "## Spacing System Recommendations" >> SPACING_REPORT.md
echo "- Use a consistent spacing scale (e.g., 4px, 8px, 16px, 24px, 32px, 48px, 64px)" >> SPACING_REPORT.md
echo "- Implement CSS custom properties for spacing values" >> SPACING_REPORT.md
echo "- Consider using rem/em units for responsive spacing" >> SPACING_REPORT.md
echo "- Avoid arbitrary spacing values - stick to the system" >> SPACING_REPORT.md

cat SPACING_REPORT.md
