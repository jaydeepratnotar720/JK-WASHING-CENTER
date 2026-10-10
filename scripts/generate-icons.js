const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    // CRC calculation
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // Draw pixels
  // Line filter byte (0) + 4 bytes per pixel (RGBA)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Deep premium navy/black gradient background with electric blue edge
        const t = dist / radius;
        if (dist > radius - width * 0.04) {
          // Electric blue ring
          rawData[pxOffset] = 0;     // R
          rawData[pxOffset + 1] = 102; // G
          rawData[pxOffset + 2] = 255; // B
          rawData[pxOffset + 3] = 255; // A
        } else {
          // Dark background #0a0e17 -> #002244 gradient
          const r = Math.floor(10 + (1 - t) * 15);
          const g = Math.floor(14 + (1 - t) * 35);
          const b = Math.floor(23 + (1 - t) * 80);
          rawData[pxOffset] = r;
          rawData[pxOffset + 1] = g;
          rawData[pxOffset + 2] = b;
          rawData[pxOffset + 3] = 255;
        }

        // Draw "JK" emblem in center
        const nx = (x - cx) / (width * 0.3);
        const ny = (y - cy) / (height * 0.3);

        // Letter J (approximate geometry)
        const isJ_top = nx >= -0.7 && nx <= -0.1 && ny >= -0.7 && ny <= -0.5;
        const isJ_stem = nx >= -0.45 && nx <= -0.25 && ny >= -0.5 && ny <= 0.4;
        const isJ_curve = nx >= -0.7 && nx <= -0.25 && ny >= 0.2 && ny <= 0.55 && (nx <= -0.45 || ny >= 0.35);

        // Letter K (approximate geometry)
        const isK_stem = nx >= 0.1 && nx <= 0.3 && ny >= -0.7 && ny <= 0.6;
        const isK_diag1 = Math.abs((ny - (-0.1)) - (nx - 0.45) * -1.2) < 0.15 && nx >= 0.25 && nx <= 0.75 && ny <= 0.1;
        const isK_diag2 = Math.abs((ny - 0.2) - (nx - 0.45) * 1.1) < 0.15 && nx >= 0.25 && nx <= 0.75 && ny >= 0.0;

        if (isJ_top || isJ_stem || isJ_curve || isK_stem || isK_diag1 || isK_diag2) {
          // Vibrant Electric Cyan/Blue (#00f0ff)
          rawData[pxOffset] = 0;
          rawData[pxOffset + 1] = 240;
          rawData[pxOffset + 2] = 255;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent outside circular badge
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
let crcTable = null;
function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}

function crc32(buf) {
  const table = getCrcTable();
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), createPNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), createPNG(512, 512));
console.log('Icons generated successfully!');
