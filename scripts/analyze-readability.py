import requests
from bs4 import BeautifulSoup
import textstat
import json

# Fetch the homepage
response = requests.get('http://localhost:3000/ali-portfolio')
soup = BeautifulSoup(response.content, 'html.parser')

# Extract text content
text_content = soup.get_text()

# Calculate readability scores
flesch_reading = textstat.flesch_reading_ease(text_content)
flesch_kincaid = textstat.flesch_kincaid_grade(text_content)
gunning_fog = textstat.gunning_fog(text_content)
reading_time = textstat.reading_time(text_content, ms_per_char=14.69)

report = {
    "flesch_reading_ease": flesch_reading,
    "flesch_kincaid_grade": flesch_kincaid,
    "gunning_fog_index": gunning_fog,
    "estimated_reading_time_minutes": reading_time,
    "word_count": len(text_content.split()),
    "recommendations": []
}

# Add recommendations
if flesch_reading < 60:
    report["recommendations"].append("Content is fairly difficult to read. Consider shorter sentences.")
if flesch_kincaid > 12:
    report["recommendations"].append("Reading level is above 12th grade. Simplify vocabulary.")
if gunning_fog > 12:
    report["recommendations"].append("Text complexity is high. Break down complex sentences.")
    
with open('readability-report.json', 'w') as f:
    json.dump(report, f, indent=2)
    
print("📖 Readability Analysis Complete")
print(f"Flesch Reading Ease: {flesch_reading}/100")
print(f"Grade Level: {flesch_kincaid}")
print(f"Reading Time: {reading_time} minutes")
