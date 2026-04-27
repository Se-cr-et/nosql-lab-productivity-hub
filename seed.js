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
  const hashman = await bcrypt.hash('1234567', saltRounds);


    const user1 = await db.collection('users').insertOne({
    name: "Cow",
    email: "cow@gmail.com",
    passwordHash: hashman,
    createdAt: new Date()
  });

  const user2 = await db.collection('users').insertOne({
    name: "Bob the Builder",
    email: "bob@gmail.com",
    passwordHash: hashman,
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

  await db.collection('tasks').insertMany([
    {
      ownerId: CowID,
      projectId: pro1.insertedId,
      title: "Implement MongoDB for cows",
      status: "in-progress",
      priority: 1,
      tags: ["db", "urgent"],
      subtasks: [{ title: "Write seed.js", done: true }, { title: "Test aggregation", done: false }],
      dueDate: new Date('2026-05-01'),
      createdAt: new Date()
    },
    {
      ownerId: CowID,
      projectId: pro2.insertedId,
      title: "Design UI, cow friendly",
      status: "todo",
      priority: 2,
      tags: ["ui"],
      subtasks: [],
      createdAt: new Date()
    },
    {
      ownerId: BobID,
      projectId: pro3.insertedId,
      title: "Buy Paint",
      status: "done",
      priority: 3,
      tags: ["shopping"],
      subtasks: [{ title: "Choose colors", done: true }],
      createdAt: new Date()
    },
    {
      ownerId: BobID,
      projectId: pro3.insertedId,
      title: "Cow Labor",
      status: "todo",
      priority: 1,
      tags: ["manual-labor"],
      subtasks: [],
      dueDate: new Date('2026-06-15'),
      createdAt: new Date()
    },
    {
      ownerId: CowID,
      projectId: pro4.insertedId,
      title: "Review",
      status: "todo",
      priority: 4,
      tags: ["team"],
      subtasks: [],
      createdAt: new Date()
    }
  ]);

await db.collection('notes').insertMany([
    {
      title: "Keys",
      body: "Keep the secrets",
      ownerId: CowID,
      projectId: pro1.insertedId,
      tags: ["security"],
      pinned: true,
      createdAt: new Date()
    },
    {
      title: "General Thoughts",
      body: "Mongo is different from SQL",
      ownerId: CowID,
      tags: ["reflection"],
      createdAt: new Date()
    },
    {
      title: "Shopping List",
      body: "Hammer, nails, and a cow",
      ownerId: BobID,
      projectId: pro3.insertedId,
      tags: ["tools"],
      createdAt: new Date()
    },
    {
      title: "Morning Routine",
      body: "Wake up, coffee, code and die",
      ownerId: BobID,
      tags: ["personal"],
      createdAt: new Date()
    },
    {
      title: "Old Notes",
      body: "Do not touch the car engine",
      ownerId: BobID,
      projectId: pro4.insertedId,
      tags: ["warning"],
      createdAt: new Date()
    }
  ]);

  console.log('TODO: implement seed.js');
  process.exit(0);
})();




