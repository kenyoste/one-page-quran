````md
# Qur’an Turkish Translation PDF

This project compiles the complete Turkish Qur’an translation (meal) into a single PDF file.

Upcoming update: support for additional languages will be added, and Qur’an translations in different languages will be available.

Data source: quran-json (Diyanet Presidency translation).

---

## Requirements

- Node.js (recommended: LTS)
- npm

---

## Installation

```bash
npm install
````

---

## Generate PDF

```bash
npm run generate
```

or directly:

```bash
node generate-pdf.js
```

This process will:

* Download the Turkish translation data from the CDN
* Load the Roboto font (for proper Turkish character support)
* Generate the PDF file

Output file:

```text
Quran-Turkish-Translation.pdf
```

(114 surahs, 6,236 verses)

---

## Project Structure

```text
/
├─ generate-pdf.js        # PDF generation script
├─ index.html             # PDF download page
├─ Quran-Turkish-Translation.pdf
└─ package.json
```

---

## Data Source

* API: [https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_tr.json](https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_tr.json)
* Translation: Diyanet Presidency
* License: CC-BY-SA 4.0 (Risan Bagja Pradana)

---

## XAMPP Usage

If the project is placed under:

```text
htdocs/onepage
```

You can access it via:

```text
http://localhost/onepage/
```

From there, the index page and PDF download link will be available.

---

## Roadmap

* Multi-language support
* Different Qur’an translations (meals)
* Language selection via UI

```
```
