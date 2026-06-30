const google = require('googlethis');
const fs = require('fs');
const path = require('path');

const CREWS = [
  { name: "luffy", query: "Straw Hat Pirates Jolly Roger vector png transparent" },
  { name: "law", query: "Heart Pirates Jolly Roger vector png transparent" },
  { name: "shanks", query: "Red Hair Pirates Jolly Roger vector png transparent" },
  { name: "whitebeard", query: "Whitebeard Pirates Jolly Roger vector png transparent" },
  { name: "buggy", query: "Buggy Pirates Jolly Roger vector png transparent" },
  { name: "blackbeard", query: "Blackbeard Pirates Jolly Roger vector png transparent" },
  { name: "kid", query: "Kid Pirates Jolly Roger vector png transparent" },
  { name: "boa", query: "Kuja Pirates Jolly Roger vector png transparent" },
  { name: "jinbe", query: "Sun Pirates Jolly Roger vector png transparent" },
  { name: "roger", query: "Roger Pirates Jolly Roger vector png transparent" }
];

async function fetchEmblems() {
  const dir = path.join(process.cwd(), 'public', 'emblems');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const crew of CREWS) {
    console.log(`Searching for ${crew.query}...`);
    try {
      const images = await google.image(crew.query, { safe: false });
      if (images && images.length > 0) {
        let bestImage = images[0].url;
        // Try to find a png that is likely transparent and clean
        for (const img of images) {
          if ((img.url.endsWith('.png') || img.url.includes('png')) && !img.url.includes('fbsbx') && !img.url.includes('lookaside')) {
            bestImage = img.url;
            break;
          }
        }
        console.log(`Downloading: ${bestImage}`);
        
        try {
          const res = await fetch(bestImage);
          if (res.ok) {
            const buffer = await res.arrayBuffer();
            fs.writeFileSync(path.join(dir, `${crew.name}.png`), Buffer.from(buffer));
            console.log(`Saved ${crew.name}.png`);
          } else {
             console.log(`Failed to download ${crew.name}: ${res.status}`);
          }
        } catch (downloadErr) {
          console.error(`Download error for ${crew.name}: ${downloadErr.message}`);
        }
      }
    } catch (e) {
      console.error(`Error with ${crew.name}:`, e.message);
    }
  }
}
fetchEmblems();
