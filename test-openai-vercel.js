require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');
console.log("Checking API Key format...");
const key = process.env.OPENAI_API_KEY;
if (!key) {
    console.log("Key is missing completely.");
} else if (key.trim() !== key) {
    console.log("WARNING: Key has leading or trailing whitespace!");
} else if (!key.startsWith('sk-')) {
    console.log("WARNING: Key does not start with 'sk-'.");
} else {
    console.log("Key format looks correct.");
}
