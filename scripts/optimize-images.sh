#!/bin/bash
set -e

mkdir -p optimized/public
mkdir -p optimized/src

find public src -name "*.png" -type f | while read img; do
  echo "Optimizing PNG: $img"
  original_size=$(wc -c < "$img")
  
  # Create WebP version
  webp_file="optimized/${img%.*}.webp"
  mkdir -p "$(dirname "$webp_file")"
  cwebp -q 85 "$img" -o "$webp_file"
  
  # Optimize original PNG
  optimized_png="optimized/$img"
  mkdir -p "$(dirname "$optimized_png")"
  cp "$img" "$optimized_png"
  optipng -o2 "$optimized_png" > /dev/null 2>&1
  pngquant --quality=80-95 --force --output "$optimized_png" "$optimized_png" > /dev/null 2>&1 || true
  
  optimized_size=$(wc -c < "$optimized_png")
  webp_size=$(wc -c < "$webp_file")
  
  echo "  Original: ${original_size} bytes"
  echo "  Optimized PNG: ${optimized_size} bytes ($(( (original_size - optimized_size) * 100 / original_size ))% reduction)"
  echo "  WebP: ${webp_size} bytes ($(( (original_size - webp_size) * 100 / original_size ))% reduction)"
done

find public src -name "*.jpg" -o -name "*.jpeg" -type f | while read img; do
  echo "Optimizing JPEG: $img"
  original_size=$(wc -c < "$img")
  
  # Create WebP version
  webp_file="optimized/${img%.*}.webp"
  mkdir -p "$(dirname "$webp_file")"
  cwebp -q 85 "$img" -o "$webp_file"
  
  # Optimize original JPEG
  optimized_jpg="optimized/$img"
  mkdir -p "$(dirname "$optimized_jpg")"
  cp "$img" "$optimized_jpg"
  jpegoptim --max=85 --strip-all "$optimized_jpg" > /dev/null 2>&1
  
  optimized_size=$(wc -c < "$optimized_jpg")
  webp_size=$(wc -c < "$webp_file")
  
  echo "  Original: ${original_size} bytes"
  echo "  Optimized JPEG: ${optimized_size} bytes ($(( (original_size - optimized_size) * 100 / original_size ))% reduction)"
  echo "  WebP: ${webp_size} bytes ($(( (original_size - webp_size) * 100 / original_size ))% reduction)"
done

find public src -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -type f | while read img; do
  base_name="${img%.*}"
  ext="${img##*.}"
  optimized_base="optimized/${base_name}"
  mkdir -p "$(dirname "$optimized_base")"
  
  echo "Creating responsive variants for: $img"
  
  # Get image dimensions
  width=$(identify -format "%w" "$img")
  height=$(identify -format "%h" "$img")
  
  # Only create smaller variants if image is large enough
  if [ "$width" -gt 800 ]; then
    # Create 800px wide version
    convert "$img" -resize 800x -quality 85 "${optimized_base}-800w.${ext}"
    cwebp -q 85 -resize 800 0 "$img" -o "${optimized_base}-800w.webp"
  fi
  
  if [ "$width" -gt 1200 ]; then
    # Create 1200px wide version
    convert "$img" -resize 1200x -quality 85 "${optimized_base}-1200w.${ext}"
    cwebp -q 85 -resize 1200 0 "$img" -o "${optimized_base}-1200w.webp"
  fi
  
  if [ "$width" -gt 1600 ]; then
    # Create 1600px wide version (for high-DPI)
    convert "$img" -resize 1600x -quality 80 "${optimized_base}-1600w.${ext}"
    cwebp -q 80 -resize 1600 0 "$img" -o "${optimized_base}-1600w.webp"
  fi
done

echo "# 🖼️ Image Optimization Report" > IMAGE_OPTIMIZATION_REPORT.md
echo "Generated on: $(date)" >> IMAGE_OPTIMIZATION_REPORT.md
echo "" >> IMAGE_OPTIMIZATION_REPORT.md

total_original=0
total_optimized=0
total_webp=0
image_count=0

echo "## Optimization Results" >> IMAGE_OPTIMIZATION_REPORT.md
echo "" >> IMAGE_OPTIMIZATION_REPORT.md
echo "| Original File | Original Size | Optimized Size | WebP Size | Savings |" >> IMAGE_OPTIMIZATION_REPORT.md
echo "|---------------|---------------|----------------|-----------|---------|" >> IMAGE_OPTIMIZATION_REPORT.md

find public src -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -type f | while read img; do
  if [ -f "optimized/$img" ]; then
    original_size=$(wc -c < "$img")
    optimized_size=$(wc -c < "optimized/$img")
    webp_file="optimized/${img%.*}.webp"
    
    if [ -f "$webp_file" ]; then
      webp_size=$(wc -c < "$webp_file")
    else
      webp_size=0
    fi
    
    savings_pct=$(( (original_size - optimized_size) * 100 / original_size ))
    webp_savings_pct=$(( (original_size - webp_size) * 100 / original_size ))
    
    echo "| $img | $(( original_size / 1024 ))KB | $(( optimized_size / 1024 ))KB | $(( webp_size / 1024 ))KB | ${savings_pct}% / ${webp_savings_pct}% |" >> IMAGE_OPTIMIZATION_REPORT.md
    
    total_original=$((total_original + original_size))
    total_optimized=$((total_optimized + optimized_size))
    total_webp=$((total_webp + webp_size))
    image_count=$((image_count + 1))
  fi
done

echo "" >> IMAGE_OPTIMIZATION_REPORT.md
echo "## Summary" >> IMAGE_OPTIMIZATION_REPORT.md
echo "- **Images processed**: $image_count" >> IMAGE_OPTIMIZATION_REPORT.md
echo "- **Total original size**: $(( total_original / 1024 ))KB" >> IMAGE_OPTIMIZATION_REPORT.md
echo "- **Total optimized size**: $(( total_optimized / 1024 ))KB" >> IMAGE_OPTIMIZATION_REPORT.md
echo "- **Total WebP size**: $(( total_webp / 1024 ))KB" >> IMAGE_OPTIMIZATION_REPORT.md

if [ $total_original -gt 0 ]; then
  overall_savings=$(( (total_original - total_optimized) * 100 / total_original ))
  webp_overall_savings=$(( (total_original - total_webp) * 100 / total_original ))
  echo "- **Overall savings**: ${overall_savings}% (optimized), ${webp_overall_savings}% (WebP)" >> IMAGE_OPTIMIZATION_REPORT.md
fi

echo "" >> IMAGE_OPTIMIZATION_REPORT.md
echo "## Recommendations" >> IMAGE_OPTIMIZATION_REPORT.md
echo "1. Use WebP format for modern browsers with fallbacks" >> IMAGE_OPTIMIZATION_REPORT.md
echo "2. Implement responsive images with srcset attribute" >> IMAGE_OPTIMIZATION_REPORT.md
echo "3. Consider lazy loading for below-fold images" >> IMAGE_OPTIMIZATION_REPORT.md
echo "4. Add proper alt text for accessibility" >> IMAGE_OPTIMIZATION_REPORT.md

cat IMAGE_OPTIMIZATION_REPORT.md
