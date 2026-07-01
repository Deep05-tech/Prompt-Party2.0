const fs = require('fs');
let content = fs.readFileSync('mass-mailer.js', 'utf8');
content = content.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('mass-mailer.js', content);
console.log("Fixed mass-mailer.js");
