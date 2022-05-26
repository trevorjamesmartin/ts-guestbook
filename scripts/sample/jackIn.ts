//@ts-nocheck
require('dotenv').config();
import path from 'path'
import bcrypt from 'bcryptjs';
//@ts-expect-error
import Users from '../../src/api/users/users-model';
//@ts-expect-error
import Profiles from '../../src/api/users/profile-model';
async function JackIn(jsonFile: string) {
  let peeps = require(jsonFile);
  for (let p of peeps) {
    let password = String(bcrypt.hashSync(p.password, 13));
    let username = p.username;
    await Users.add({ username, password });
  }
  let users = await Users.list();
  let updates = [];
  for (let u of users) {
    let { id, username } = u;
    let profile = peeps.find((p: any) => p.username === username);
    if (profile) {
      let { name, avatar, email, dob } = profile
      updates.push([id, { name, avatar: '/user.png', email }]);
    }
  }
  for (let data of updates) {
    const [id, upd] = data;
    const { name, avatar, email, dob } = upd;
    await Profiles.update(id,
      {
        name, avatar, email
      });
  }
  return true
}

JackIn(path.join(__dirname, './matrix.json'));
