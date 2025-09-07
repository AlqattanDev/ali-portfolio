#!/bin/bash
set -e

axe http://localhost:3000 --save accessibility-results.json
axe http://localhost:3000 --reporter=json > accessibility-report.json

pa11y http://localhost:3000 --reporter json > pa11y-report.json
pa11y http://localhost:3000 --standard WCAG2AA --reporter cli
