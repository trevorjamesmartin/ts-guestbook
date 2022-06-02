try {
  require('dotenv').config();
} catch {
  process.exit();
}
import path from 'path'
import bcrypt from 'bcryptjs';

import Users from '../../src/api/users/users-model';
import Profile from '../../src/api/users/profile-model';

async function JackIn(jsonFile: string) {
  let peeps = require(jsonFile);
  for (let p of peeps) {
    let password = String(bcrypt.hashSync(p.password, 13));
    let username = p.username;
    let profile = await Users.add({ username, password });
    await Profile.update(profile.id, {
      name: p?.name,
      avatar: p?.avatar,
      email: p?.email
    });
    console.log(`+ ${username}`);
  }
  return true
}

JackIn(path.join(__dirname, './matrix.json'))
.then(console.log)
.catch(console.log)
.finally(() => process.exit());
