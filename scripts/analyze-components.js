const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/ali-portfolio');
  
  // Analyze component patterns
  const analysis = await page.evaluate(() => {
    const report = {
      buttons: [],
      links: [],
      headings: [],
      cards: [],
      forms: []
    };
    
    // Analyze buttons
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((btn, i) => {
      const styles = getComputedStyle(btn);
      report.buttons.push({
        index: i,
        classes: btn.className,
        styles: {
          padding: styles.padding,
          borderRadius: styles.borderRadius,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        }
      });
    });
    
    // Analyze links
    const links = document.querySelectorAll('a');
    links.forEach((link, i) => {
      const styles = getComputedStyle(link);
      report.links.push({
        index: i,
        classes: link.className,
        styles: {
          color: styles.color,
          textDecoration: styles.textDecoration,
          fontSize: styles.fontSize
        }
      });
    });
    
    // Analyze headings
    for (let level = 1; level <= 6; level++) {
      const headings = document.querySelectorAll(`h${level}`);
      headings.forEach((heading, i) => {
        const styles = getComputedStyle(heading);
        report.headings.push({
          level: level,
          index: i,
          text: heading.textContent.substring(0, 50),
          styles: {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            marginTop: styles.marginTop,
            marginBottom: styles.marginBottom
          }
        });
      });
    }
    
    return report;
  });
  
  // Generate report
  let report = "# 🧩 Component Pattern Analysis\n";
  report += `Generated on: ${new Date().toISOString()}\n\n`;
  
  report += "## Button Consistency\n";
  const buttonStyles = analysis.buttons.map(b => b.styles);
  const uniqueButtonStyles = [...new Set(buttonStyles.map(JSON.stringify))].map(JSON.parse);
  report += `- Found ${analysis.buttons.length} buttons with ${uniqueButtonStyles.length} unique style patterns\n`;
  
  uniqueButtonStyles.forEach((style, i) => {
    report += `### Button Style Pattern ${i + 1}\n`;
    Object.entries(style).forEach(([prop, value]) => {
      report += `- ${prop}: lexible${value}lexible\n`;
    });
    report += '\n';
  });
  
  report += "## Link Consistency\n";
  const linkStyles = analysis.links.map(l => l.styles);
  const uniqueLinkStyles = [...new Set(linkStyles.map(JSON.stringify))].map(JSON.parse);
  report += `- Found ${analysis.links.length} links with ${uniqueLinkStyles.length} unique style patterns\n\n`;
  
  report += "## Heading Hierarchy\n";
  for (let level = 1; level <= 6; level++) {
    const levelHeadings = analysis.headings.filter(h => h.level === level);
    if (levelHeadings.length > 0) {
      const sizes = [...new Set(levelHeadings.map(h => h.styles.fontSize))];
      report += `- H${level}: ${levelHeadings.length} instances, font-size: ${sizes.join(', ')}\n`;
    }
  }
  
  report += "\n## Component Consistency Recommendations\n";
  report += "- Standardize button styles and states (hover, focus, active)\n";
  report += "- Use consistent link styling throughout the site\n";
  report += "- Ensure heading hierarchy follows semantic and visual order\n";
  report += "- Consider creating component style guides\n";
  report += "- Implement design tokens for consistent theming\n";
  
  fs.writeFileSync('COMPONENT_REPORT.md', report);
  
  await browser.close();
})();
