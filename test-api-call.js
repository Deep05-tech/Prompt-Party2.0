require('dotenv').config({ path: '.env.local' });
const { encode } = require('next-auth/jwt');

async function test() {
  const secret = process.env.NEXTAUTH_SECRET || "default_secret_for_dev";
  
  // Forge a token for Mamta Parmar (Red Hair Pirates)
  const token = await encode({
    token: {
      name: "MAMTA PARMAR",
      role: "CAPTAIN",
      teamId: "6a3bc32aa97d8f592f960ec2",
      sub: "6a3bc36ea97d8f592f960ec6"
    },
    secret,
  });
  
  console.log("Forged Token:", token);
  
  const res = await fetch("http://localhost:3000/api/wheel/spin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `next-auth.session-token=${token}`
    },
    body: JSON.stringify({ result: "Test | Result | For | Wheel" })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
test();
