const PDFDocument = require('pdfkit');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const QURAN_TR_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_tr.json';
const FONT_PATH = path.join(__dirname, 'fonts', 'Uni Sans Regular.otf');
const LOUBAG_FONT_PATH = path.join(__dirname, 'fonts', 'Loubag-Black.ttf');
// Sure isimleri: Playwrite TTF varsa onu, yoksa Uni Sans Bold kullan
const PLAYWRITE_FONT_PATH = path.join(__dirname, 'fonts', 'PlaywriteDE_Grund-Regular.ttf');
const BOLD_FONT_PATH = path.join(__dirname, 'fonts', 'Uni Sans Bold.otf');
const OUTPUT_FILE = path.join(__dirname, 'Kuran-Turkce-Meal.pdf');

// Islamic çerçeve renkleri: yeşil (iç), sarı (dış)
const COLOR_GREEN = '#166534';
const COLOR_GOLD = '#ca8a04';

/** Sayfa kenarına Islamic çerçeve + köşelere 8 köşeli yıldız (Rub el Hizb) çizer */
function drawIslamicBorder(doc, pageWidth, pageHeight) {
  const OUTER = 12;   // Dış sarı çerçeve kenardan
  const INNER = 35;   // İç yeşil çerçeve kenardan
  const CORNER_LEN = 100;  // Köşe L uzunluğu
  const STAR_R = 18;  // Yıldız yarıçapı

  doc.save();

  // 1. Dış çerçeve (sarı, ince)
  doc.strokeColor(COLOR_GOLD).lineWidth(2);
  doc.rect(OUTER, OUTER, pageWidth - 2 * OUTER, pageHeight - 2 * OUTER).stroke();

  // 2. İç çerçeve (yeşil, kalın)
  doc.strokeColor(COLOR_GREEN).lineWidth(4);
  doc.rect(INNER, INNER, pageWidth - 2 * INNER, pageHeight - 2 * INNER).stroke();

  // 3. 8 köşeli yıldız (Rub el Hizb) her köşede
  const corners = [
    [INNER, INNER],
    [pageWidth - INNER, INNER],
    [pageWidth - INNER, pageHeight - INNER],
    [INNER, pageHeight - INNER]
  ];
  const rotations = [0, -90, 180, 90]; // Her köşe için açı (derece)

  corners.forEach(([cx, cy], i) => {
    doc.save();
    doc.translate(cx, cy);
    doc.rotate((rotations[i] * Math.PI) / 180);

    // Rub el Hizb: iki kare 45° dönük - 8 köşeli yıldız
    const pts = [];
    for (let k = 0; k < 8; k++) {
      const a = (k * 45 * Math.PI) / 180;
      pts.push([STAR_R * Math.cos(a), STAR_R * Math.sin(a)]);
    }
    doc.strokeColor(COLOR_GOLD).lineWidth(1.5);
    doc.polygon(pts[0], pts[2], pts[4], pts[6]).stroke();  // İlk kare
    doc.polygon(pts[1], pts[3], pts[5], pts[7]).stroke();   // 45° dönük kare

    // Köşe noktası (yeşil nokta)
    doc.fillColor(COLOR_GREEN).circle(0, 0, 2).fill();

    doc.restore();
  });

  doc.restore();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Veri alınamadı: ${url}`);
  return response.json();
}

function createPdf(quranData, fontBuffer, playwriteFontBuffer, loubagFontBuffer) {
  return new Promise((resolve, reject) => {
    // Sabit ölçüler - 2000x3000, tüm meal tek sayfada
    const PAGE_WIDTH = 2304;
    const PAGE_HEIGHT = 3500;
    const MARGIN = 59;  // Islamic çerçeve için (yazıların dışında)
    const NUM_COLUMNS = 24;
    const COLUMN_GAP = 8;

    const doc = new PDFDocument({
      size: [PAGE_WIDTH, PAGE_HEIGHT],
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
      autoFirstPage: true
    });

    const stream = fs.createWriteStream(OUTPUT_FILE);
    doc.pipe(stream);

    // Islamic çerçeve (2 frame: sarı/yeşil + köşe yıldızları)
    drawIslamicBorder(doc, PAGE_WIDTH, PAGE_HEIGHT);

    // Fontlar
    if (fontBuffer) {
      try {
        doc.registerFont('UniSans', fontBuffer);
      } catch (e) {}
    }
    if (playwriteFontBuffer) {
      try {
        doc.registerFont('Playwrite', playwriteFontBuffer);
      } catch (e) {}
    }
    if (loubagFontBuffer) {
      try {
        doc.registerFont('Loubag', loubagFontBuffer);
      } catch (e) {}
    }
    doc.font('UniSans');

    const usableWidth = PAGE_WIDTH - 2 * MARGIN;
    const usableHeight = PAGE_HEIGHT - 2 * MARGIN;
    const colWidth = (usableWidth - (NUM_COLUMNS - 1) * COLUMN_GAP) / NUM_COLUMNS;

    // Font - sütun genişleyince biraz büyütüldü (3.2pt)
    doc.fontSize(5.5);
    doc.lineGap(0.5);
    doc.fillColor('black');

    // Başlık
    doc.fontSize(4).fillColor('#1a365d');
    doc.text('Kur\'an-ı Kerim - Türkçe Meali (Diyanet İşleri Başkanlığı)', { width: usableWidth, align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(5).fillColor('black');

    // Tek text() çağrısı - girinti yok, sütunlar düzgün (sure başlıkları dahil)
    const HR = '\n' + '-'.repeat(55) + '\n';
    let fullText = '';
    let totalVerses = 0;
    for (const surah of quranData) {
      fullText += surah.translation + '\n';
      for (const verse of surah.verses) {
        fullText += `${surah.translation}-${verse.id} ${verse.translation}\n`;
        totalVerses++;
      }
      fullText += HR;
    }

    const textOpts = {
      width: usableWidth,
      height: usableHeight - 15,
      columns: NUM_COLUMNS,
      columnGap: COLUMN_GAP,
      lineGap: 0.5,
      paragraphGap: 0,
      align: 'justify',
      indent: 0,
      continued: false   // girinti olmasın - önceki continuedX sıfırlansın
    };

    doc.font('UniSans').fontSize(3.2).fillColor('black');
    doc.x = MARGIN;  // Sol kenara sıfırla (başlıktan sonra x kaymış olabilir)
    doc.text(fullText, textOpts);
    console.log(`  → ${totalVerses} ayet işlendi`);

    // Sağ alt köşeye iletişim bilgisi (POWERED BY = Playwrite regular, @kenyoste = Loubag Black + kırmızı)
    const footerY = PAGE_HEIGHT - MARGIN - 12;
    doc.fontSize(3.2);
    const playFont = playwriteFontBuffer ? 'Playwrite' : 'UniSans';  // Playwrite: Regular, yoksa UniSans (bold değil)
    const loubagFont = loubagFontBuffer ? 'Loubag' : 'UniSans';
    const kenyosteWidth = doc.font(loubagFont).widthOfString('@kenyoste');
    const poweredByWidth = doc.font(playFont).widthOfString('POWERED BY ');
    const footerRightOffset = 40;  // Sağ sütunun altında hizala
    const rightEdge = PAGE_WIDTH - MARGIN - footerRightOffset;
    const gap = 4;
    const kenyosteX = rightEdge - kenyosteWidth;
    const poweredByBoxEnd = kenyosteX - gap;
    const textOpt = { baseline: 'top' };
    doc.font(playFont).fillColor('#4a5568');
    doc.text('POWERED BY ', MARGIN, footerY, { width: poweredByBoxEnd - MARGIN, align: 'right', ...textOpt });
    doc.font(loubagFont).fillColor('red');
    doc.text('@kenyoste', kenyosteX, footerY - 1, textOpt);  // -2: Loubag metrik farkı, yukarı çek

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

async function main() {
  console.log('📖 Kuran-ı Kerim Türkçe Meal PDF oluşturuluyor...\n');
  
  try {
    console.log('⏳ Veri indiriliyor:', QURAN_TR_URL);
    const quranData = await fetchJson(QURAN_TR_URL);
    console.log(`✓ ${quranData.length} sure yüklendi\n`);

    // Uni Sans font (fonts klasöründen)
    let fontBuffer = null;
    try {
      if (fs.existsSync(FONT_PATH)) {
        fontBuffer = fs.readFileSync(FONT_PATH);
        console.log('✓ Uni Sans font yüklendi');
      }
    } catch (e) {
      console.warn('  ⚠ Font yüklenemedi, varsayılan font kullanılacak');
    }

    // POWERED BY için: Playwrite (Regular, bold değil) varsa, yoksa Uni Sans Regular
    let playwriteFontBuffer = null;
    if (fs.existsSync(PLAYWRITE_FONT_PATH)) {
      playwriteFontBuffer = fs.readFileSync(PLAYWRITE_FONT_PATH);
      console.log('✓ Playwrite font yüklendi (POWERED BY)');
    }

    // Loubag Black (@kenyoste için)
    let loubagFontBuffer = null;
    if (fs.existsSync(LOUBAG_FONT_PATH)) {
      loubagFontBuffer = fs.readFileSync(LOUBAG_FONT_PATH);
      console.log('✓ Loubag font yüklendi');
    }

    console.log('⏳ PDF oluşturuluyor...');
    await createPdf(quranData, fontBuffer, playwriteFontBuffer, loubagFontBuffer);
    
    console.log(`\n✅ PDF başarıyla oluşturuldu: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('\n❌ Hata:', err.message);
    process.exit(1);
  }
}

main();
