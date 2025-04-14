require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('freelance');

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('jobs').deleteMany({});
    await db.collection('applications').deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await db.collection('users').insertOne({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });

    console.log('Created admin user:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    // Create mock jobs
    const jobs = [
      {
        title: 'Full Stack Developer Needed',
        description: 'Looking for an experienced developer to build a social media platform. Must have experience with React, Node.js, and MongoDB.',
        category: 'Web Development'
      },
      {
        title: 'UI/UX Designer for Mobile App',
        description: 'Seeking a talented designer to create intuitive and beautiful interfaces for our mobile application.',
        category: 'Design'
      },
      {
        title: 'Content Writer for Tech Blog',
        description: 'Need a skilled writer to create engaging content about the latest technology trends and developments.',
        category: 'Writing'
      },
      {
        title: 'DevOps Engineer',
        description: 'Looking for a DevOps engineer to help streamline our deployment processes and improve infrastructure.',
        category: 'DevOps'
      }
    ];

    const insertedJobs = await db.collection('jobs').insertMany(jobs);
    console.log(`Inserted ${jobs.length} jobs`);

    // Create mock applications
    const applications = [
      {
        jobId: Object.values(insertedJobs.insertedIds)[0],
        name: 'John Doe',
        email: 'john@example.com',
        proposal: 'I have 5 years of experience in full stack development and would love to help build your platform.'
      },
      {
        jobId: Object.values(insertedJobs.insertedIds)[0],
        name: 'Jane Smith',
        email: 'jane@example.com',
        proposal: 'I specialize in React and Node.js development with a focus on scalable applications.'
      },
      {
        jobId: Object.values(insertedJobs.insertedIds)[1],
        name: 'Mike Johnson',
        email: 'mike@example.com',
        proposal: 'I have designed multiple award-winning mobile applications and would be perfect for this role.'
      }
    ];

    await db.collection('applications').insertMany(applications);
    console.log(`Inserted ${applications.length} applications`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();