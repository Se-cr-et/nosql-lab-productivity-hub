// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  const saltRounds = 10;
  const hash = await bcrypt.hash('password123', saltRounds);


    const user1 = await db.collection('users').insertOne({
    name: "Cow",
    email: "cow@gmail.com",
    passwordHash: hash,
    createdAt: new Date()
  });

  const user2 = await db.collection('users').insertOne({
    name: "Bob the Builder",
    email: "bob@gmail.com",
    passwordHash: hash,
    createdAt: new Date()
  });

  const CowID = user1.insertedId;
  const BobID = user2.insertedId;


    const pro1 = await db.collection('projects').insertOne({
    name: "Productivity Hub", ownerId: CowID, archived: false, createdAt: new Date()
  });
  const pro2 = await db.collection('projects').insertOne({
    name: "Mobile App", ownerId: CowID, archived: false, createdAt: new Date()
  });
  const pro3 = await db.collection('projects').insertOne({
    name: "House Rebuild", ownerId: BobID, archived: false, createdAt: new Date()
  });
  const pro4 = await db.collection('projects').insertOne({
    name: "Cow in the woods", ownerId: BobID, archived: true, createdAt: new Date()
  });



  console.log('TODO: implement seed.js');
  process.exit(0);
})();




