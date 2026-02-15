# Kur'an-ı Kerim Türkçe Meal PDF

Tüm Türkçe meal verisini tek bir PDF dosyasında toplayan proje. Veri kaynağı: [quran-json](https://github.com/risan/quran-json) (Diyanet İşleri Başkanlığı meali).

## Kurulum

```bash
npm install
```

## PDF Oluşturma

```bash
npm run generate
```

veya

```bash
node generate-pdf.js
```

Bu komut:
1. CDN'den Türkçe meal verisini indirir
2. Roboto fontunu yükler (Türkçe karakter desteği için)
3. `Kuran-Turkce-Meal.pdf` dosyasını oluşturur

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `generate-pdf.js` | PDF oluşturma scripti |
| `index.html` | PDF indirme sayfası |
| `Kuran-Turkce-Meal.pdf` | Oluşturulan PDF (114 sure, 6236 ayet) |

## Veri Kaynağı

- **API**: `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_tr.json`
- **Meal**: Diyanet İşleri Başkanlığı
- **Lisans**: CC-BY-SA 4.0 · Risan Bagja Pradana

## XAMPP ile Kullanım

Projeyi `htdocs/onepage` altına koyduysanız, tarayıcıdan `http://localhost/onepage/` adresine giderek index sayfasına ve PDF indirme linkine ulaşabilirsiniz.
