require('dotenv').config();
import path from 'path'
import bcrypt from 'bcryptjs';
import Users from '../../api/users/users-model';
import Profiles from '../../api/users/profile-model';
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

JackIn(path.join(process.cwd(), 'src/data/sample/matrix.json'));
