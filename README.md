# Puppeteer Automation Script

This Puppeteer script automates webpage interaction, allowing you to take screenshots, extract metadata, and gather links from a webpage.


npm i 
yarn install

i used nodemon for auto restart server 
run 
npm run dev 
---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Code Explanation](#code-explanation)
7. [Output Files](#output-files)
8. [Customization](#customization)

---

## Overview

This script uses Puppeteer to:
- Launch a browser session.
- Navigate to a specified webpage.
- Take a full-width screenshot of the page.
- Extract metadata (description and keywords).
- Collect all hyperlinks from the page.

It handles errors such as deprecated resource warnings and suppressed unnecessary network requests.

---

## Features

- **Full-width screenshots**: Captures a screenshot at 1920x1080 resolution.
- **Metadata extraction**: Extracts metadata like description and keywords.
- **Link scraping**: Collects all links (`<a>` tags) from the webpage.
- **Error handling**: Suppresses warnings and irrelevant network requests.
- **Browser session control**: Automatically closes the browser when the tab is closed.

---

## Prerequisites

- Node.js (v18 or later)
- npm (Node Package Manager)

