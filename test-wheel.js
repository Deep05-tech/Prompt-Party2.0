require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const TeamSchema = new mongoose.Schema({}, { strict: false });
  const Team = mongoose.model('Team', TeamSchema);
  
  const kuja = await Team.findOne({ name: 'Kuja Pirates' });
  console.log("Kuja Pirates wheelResult:", kuja.wheelResult);
  
  mongoose.disconnect();
}
test();
