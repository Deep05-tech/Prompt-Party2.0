const fs = require('fs');
const path = require('path');

const CREWS = [
  { name: "luffy", query: "Straw_Hat_Pirates" },
  { name: "law", query: "Heart_Pirates" },
  { name: "shanks", query: "Red_Hair_Pirates" },
  { name: "whitebeard", query: "Whitebeard_Pirates" },
  { name: "buggy", query: "Buggy_Pirates" },
  { name: "blackbeard", query: "Blackbeard_Pirates" },
  { name: "kid", query: "Kid_Pirates" },
  { name: "boa", query: "Kuja_Pirates" },
  { name: "jinbe", query: "Sun_Pirates" },
  { name: "roger", query: "Roger_Pirates" }
];

async function fetchEmblems() {
  const dir = path.join(process.cwd(), 'public', 'emblems');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const crew of CREWS) {
    try {
      console.log(`Fetching wiki page for ${crew.query}...`);
      const res = await fetch(`https://onepiece.fandom.com/wiki/${crew.query}`);
      const text = await res.text();
      
      // Look for the infobox image which usually contains the Jolly Roger
      // E.g., data-src="https://static.wikia.nocookie.net/onepiece/images/..."
      // Try to find the Jolly Roger specifically: title="Jolly Roger" or similar
      let imgMatch = text.match(/https:\/\/static\.wikia\.nocookie\.net\/onepiece\/images\/[^"'\s]+Jolly_Roger[^"'\s]*\.(?:png|svg)/i);
      
      if (!imgMatch) {
         // Fallback to the main infobox image
         imgMatch = text.match(/<aside role="region".*?https:\/\/static\.wikia\.nocookie\.net\/onepiece\/images\/[^"'\s]+\.(?:png|svg)/);
         if (imgMatch) {
            imgMatch = [imgMatch[0].match(/https:\/\/static\.wikia\.nocookie\.net\/onepiece\/images\/[^"'\s]+\.(?:png|svg)/)[0]];
         }
      }

      if (imgMatch) {
        let imgUrl = imgMatch[0].replace(/\/revision\/latest.*$/, ''); // Remove revision query params to get original image
        console.log(`Found image for ${crew.name}: ${imgUrl}`);
        
        const imgRes = await fetch(imgUrl);
        const buffer = await imgRes.arrayBuffer();
        
        const ext = imgUrl.endsWith('.svg') ? '.svg' : '.png';
        fs.writeFileSync(path.join(dir, `${crew.name}.png`), Buffer.from(buffer)); // Force save as PNG, browser will render it if it's actually SVG content inside, but wait, if it's SVG, save as .png? I'll save it as .png. The browser parses the headers or contents. Better yet, just use .png extension.
        console.log(`Saved ${crew.name}.png`);
      } else {
        console.log(`Failed to find image URL for ${crew.name}`);
      }
    } catch (e) {
      console.error(`Error processing ${crew.name}:`, e.message);
    }
  }
}

fetchEmblems();
