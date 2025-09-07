#!/bin/bash
set -e

# Use the correct port and path for the Ali Portfolio
BASE_URL="http://localhost:4321/ali-portfolio"

axe "$BASE_URL" --save accessibility-results.json
axe "$BASE_URL" --reporter=json > accessibility-report.json

pa11y "$BASE_URL" --reporter json > pa11y-report.json
pa11y "$BASE_URL" --standard WCAG2AA --reporter cli
