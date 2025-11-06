#!/bin/bash

git add tools/playwright_parser.py
git add tools/pre_import_normalizer.py
git add PARSER_FIXES_REPORT.md
git add .gitmessage

git commit -F .gitmessage

rm .gitmessage

echo "✅ Виправлення закомічено!"
