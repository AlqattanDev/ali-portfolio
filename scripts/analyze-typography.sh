#!/bin/bash
set -e

echo "# 📝 Typography Analysis Report" > TYPOGRAPHY_REPORT.md
echo "Generated on: $(date)" >> TYPOGRAPHY_REPORT.md
echo "" >> TYPOGRAPHY_REPORT.md

echo "## Font Usage Analysis" >> TYPOGRAPHY_REPORT.md
echo "" >> TYPOGRAPHY_REPORT.md

# Extract font families from CSS
echo "### Font Families Used" >> TYPOGRAPHY_REPORT.md
find dist -name "*.css" -exec grep -h "font-family" {} \; | \
  sed 's/.*font-family:\s*\([^;]*\);.*/\1/' | \
  sort -u | \
  while read font; do
    echo "- \
$font" >> TYPOGRAPHY_REPORT.md
  done

echo "" >> TYPOGRAPHY_REPORT.md

# Extract font sizes
echo "### Font Sizes Used" >> TYPOGRAPHY_REPORT.md
find dist -name "*.css" -exec grep -h -E "font-size:\s*[0-9]" {} \; | \
  sed 's/.*font-size:\s*\([^;]*\);.*/\1/' | \
  sort -u | \
  while read size; do
    echo "- $size" >> TYPOGRAPHY_REPORT.md
  done

echo "" >> TYPOGRAPHY_REPORT.md

# Extract font weights
echo "### Font Weights Used" >> TYPOGRAPHY_REPORT.md
find dist -name "*.css" -exec grep -h "font-weight" {} \; | \
  sed 's/.*font-weight:\s*\([^;]*\);.*/\1/' | \
  sort -u | \
  while read weight; do
    echo "- $weight" >> TYPOGRAPHY_REPORT.md
  done

echo "" >> TYPOGRAPHY_REPORT.md
echo "## Typography Consistency Recommendations" >> TYPOGRAPHY_REPORT.md
echo "- Limit to 2-3 font families maximum" >> TYPOGRAPHY_REPORT.md
echo "- Use a consistent scale (e.g., 1.2 or 1.25 ratio)" >> TYPOGRAPHY_REPORT.md
echo "- Stick to 3-5 font weights" >> TYPOGRAPHY_REPORT.md
echo "- Ensure proper line-height for readability (1.4-1.6)" >> TYPOGRAPHY_REPORT.md

cat TYPOGRAPHY_REPORT.md
