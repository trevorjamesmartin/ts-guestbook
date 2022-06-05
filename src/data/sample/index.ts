const Users = require('../../api/users/users-model').default;
const Profile = require('../../api/users/profile-model').default;
const Posts = require('../../api/posts/posts-model').default;

const { hashSync } = require('bcryptjs');

// "This is your last chance. After this, there is no turning back. You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland and I show you how deep the rabbit-hole goes.",
export const quotes:any = {
  morpheus: [
    "There is a difference between knowing the path and walking the path."
  ],
  trinity: [
    "The Matrix Cannot Tell You Who You Are."
  ],
  oracle: [
    "You didn't come here to make the choice. You've already made it. You're here to try to understand why you made it."
  ]
}

export interface account {
  name: string;
  avatar: string;
  email: string;
  username: string;
  password: string;
}

export const accounts: account[] = [
  {
    "name": "The Oracle",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/oracle-avatar.jpeg",
    "email": "oracle@delphi.org",
    "username": "oracle",
    "password": "oracle"
  },
  {
    "name": "Morpheus",
    "email": "root@localhost",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/morpheus-avatar.jpeg",
    "username": "morpheus",
    "password": "morpheus"
  },
  {
    "name": "Trinity",
    "email": "trinity@whiterabbit.com",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/trinity-avatar.jpeg",
    "username": "trinity",
    "password": "trinity"
  },
  {
    "name": "Apoc",
    "email": "apoc@lypse.com",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/apoc0-avatar.jpeg",
    "username": "apoc0",
    "password": "apoc0"
  },
  {
    "name": "Agent Brown",
    "email": "abrown@local.gov",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/abrown-avatar.jpeg",
    "username": "abrown",
    "password": "abrown"
  },
  {
    "name": "Agent Jones",
    "email": "ajones@infowars.gov",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/ajones-avatar.jpeg",
    "username": "ajones",
    "password": "ajones"
  },
  {
    "name": "Choi",
    "email": "choi@aol.com",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/choi-avatar.jpeg",
    "username": "choi",
    "password": "choi"
  },
  {
    "name": "Dujour",
    "email": "dujour@163.com",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/dujour-avatar.jpeg",
    "username": "dujour",
    "password": "dujour"
  },
  {
    "name": "Cypher",
    "email": "cypher@mozilla.org",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/cypher-avatar.jpeg",
    "username": "cypher",
    "password": "cypher"
  },
  {
    "name": "Dozer",
    "email": "dozer@earth.net",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/dozer-avatar.jpeg",
    "username": "dozer",
    "password": "dozer"
  },
  {
    "name": "Mouse",
    "email": "mouse@home.com",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/mouse-avatar.jpeg",
    "username": "mouse",
    "password": "mouse"
  },
  {
    "name": "Rhineheart",
    "email": "rhineheart@local.gov",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/rhineheart-avatar.jpeg",
    "username": "rhineheart",
    "password": "rhineheart"
  },
  {
    "name": "Smith",
    "email": "smith@local.net",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/smith-avatar.jpeg",
    "username": "smith",
    "password": "smith"
  },
  {
    "name": "Tank",
    "email": "tank@nebuch.net",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/tank-avatar.jpeg",
    "username": "tank",
    "password": "tank"
  },
  {
    "name": "Thomas A. Anderson",
    "avatar": "https://vigilant-s3.s3.amazonaws.com/neo2022-avatar.jpeg",
    "email": "neo@earth.net",
    "username": "neo2022",
    "password": "trinity"
  }
];


let AccountMap:any = {};

export async function createAccounts(): Promise<string[]> {
  let created: any[] = [];
  for (let u of accounts) {
    let password = String(hashSync(u.password, 13));
    let username = u.username;
    // add user account
    let profile = await Users.add({ username, password });
    // update profile
    await Profile.update(profile.id, {
      name: u.name,
      avatar: u.avatar,
      email: u.email
    });
    AccountMap[username] = profile.user_id;
    console.log(` + ${username}`);
    created.push(username);
  }
  return created;
}
async function init() {
  let result = await createAccounts();
  console.log('created', result.length, 'accounts');
  for (let username of Object.keys(quotes)) {
    // post a message
    let author_id = AccountMap[username];
    console.log('posting as ', username, author_id);
    for (let content of quotes[username]) {
      console.log(content);
      await Posts.add({ content, author_id });
    }
  }
}

init().then(() => process.exit());
