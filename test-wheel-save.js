require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const TeamSchema = new mongoose.Schema({
    wheelResult: String
  }, { strict: false });
  const Team = mongoose.model('Team', TeamSchema);
  
  const team = await Team.findOne({ name: 'Red Hair Pirates' });
  console.log("Team found:", team.name, "ID:", team._id);
  
  team.wheelResult = "Cyberpunk | Ad Film | Tense | Realistic";
  await team.save();
  
  const updatedTeam = await Team.findById(team._id);
  console.log("Updated team wheelResult:", updatedTeam.wheelResult);
  
  // Clear it back for the user to test
  await Team.updateOne({ _id: team._id }, { $unset: { wheelResult: 1 } });
  
  mongoose.disconnect();
}
test();
