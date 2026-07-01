require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const TeamSchema = new mongoose.Schema({}, { strict: false });
  const Team = mongoose.model('Team', TeamSchema);
  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.model('User', UserSchema);
  
  const team = await Team.findOne({ name: 'Red Hair Pirates' });
  const users = await User.find({ teamId: team._id });
  
  users.forEach(u => console.log(u.username, u.role));
  
  mongoose.disconnect();
}
test();
