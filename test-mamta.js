require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.model('User', UserSchema);
  
  const user = await User.findOne({ username: 'MAMTA PARMAR' });
  console.log("MAMTA PARMAR role:", user ? user.role : "NOT FOUND");
  
  mongoose.disconnect();
}
test();
