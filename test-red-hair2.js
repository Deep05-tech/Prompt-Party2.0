require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const TeamSchema = new mongoose.Schema({ wheelResult: String }, { strict: false });
  const Team = mongoose.model('Team', TeamSchema);
  
  const team = await Team.findOne({ name: 'Red Hair Pirates' });
  console.log("Red Hair Pirates wheelResult:", team.wheelResult);
  
  mongoose.disconnect();
}
test();
