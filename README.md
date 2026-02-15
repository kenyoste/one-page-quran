
# Qur’an Turkish Translation PDF

This project generates a single PDF file containing the complete Turkish translation (meal) of the Qur’an.

The translation data is fetched from a CDN and compiled into a one-page PDF format.

> Planned update: multi-language support will be added, and Qur’an translations in different languages will be available.

---

## Features

- Single PDF output (114 surahs, 6,236 verses)
- Uses official Diyanet Presidency Turkish translation
- CDN-based data source
- Node.js-based PDF generation
- UTF-8 / Turkish character support

---

## Requirements

- Node.js (LTS recommended)
- npm

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
````

---

## Generate PDF

Run the following command:

```bash
npm run generate
```

or directly:

```bash
node generate-pdf.js
```

This will:

* Download the Turkish translation data from the CDN
* Load the Roboto font (for proper Turkish character rendering)
* Generate the PDF file

Output:

```text
Quran-Turkish-Translation.pdf
```

---

## Project Structure

```text
.
├── generate-pdf.js        # PDF generation script
├── index.html             # PDF download page
├── Quran-Turkish-Translation.pdf
├── package.json
└── README.md
```

---

## Data Source

* **API**
  [https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_tr.json](https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_tr.json)

* **Translation**
  Diyanet Presidency of Religious Affairs (Turkey)

* **License**
  CC-BY-SA 4.0
  Risan Bagja Pradana

---

## Usage with XAMPP

If the project directory is placed under:

```text
htdocs/onepage
```

You can access it via:

```text
http://localhost/onepage/
```

The index page and PDF download link will be available there.

---

## Roadmap

* Multi-language support
* Multiple Qur’an translations (meals)
* Language selection via UI


