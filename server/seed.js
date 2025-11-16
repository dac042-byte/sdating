import db, { initializeDatabase } from './database.js';
import { hashPassword } from './auth.js';

// Initialize the database
initializeDatabase();

// Clear existing data
console.log('Clearing existing data...');
db.exec('DELETE FROM messages');
db.exec('DELETE FROM matches');
db.exec('DELETE FROM swipes');
db.exec('DELETE FROM users');

// Seed users
console.log('Seeding placeholder users...');

const users = [
  // Technical users
  {
    email: 'sarah.chen@mit.edu',
    password: hashPassword('password123'),
    name: 'Sarah Chen',
    country: 'United States',
    university: 'MIT',
    user_type: 'technical',
    bio: 'Full-stack developer passionate about building scalable web applications. Love working on innovative projects!',
    skills: 'React, Node.js, Python, PostgreSQL, AWS'
  },
  {
    email: 'alex.kumar@stanford.edu',
    password: hashPassword('password123'),
    name: 'Alex Kumar',
    country: 'United States',
    university: 'Stanford University',
    user_type: 'technical',
    bio: 'CS major specializing in machine learning and AI. Always excited to work on cutting-edge tech.',
    skills: 'Python, TensorFlow, PyTorch, JavaScript, Docker'
  },
  {
    email: 'emma.wilson@harvard.edu',
    password: hashPassword('password123'),
    name: 'Emma Wilson',
    country: 'United States',
    university: 'Harvard University',
    user_type: 'technical',
    bio: 'Mobile developer with a passion for creating beautiful user experiences.',
    skills: 'Swift, Kotlin, React Native, Flutter, Firebase'
  },
  {
    email: 'marcus.johnson@berkeley.edu',
    password: hashPassword('password123'),
    name: 'Marcus Johnson',
    country: 'United States',
    university: 'UC Berkeley',
    user_type: 'technical',
    bio: 'Backend engineer who loves solving complex problems and optimizing systems.',
    skills: 'Java, Spring Boot, Microservices, Redis, Kubernetes'
  },
  {
    email: 'lily.zhang@caltech.edu',
    password: hashPassword('password123'),
    name: 'Lily Zhang',
    country: 'United States',
    university: 'Caltech',
    user_type: 'technical',
    bio: 'Data scientist and engineer interested in applying ML to real-world problems.',
    skills: 'Python, R, SQL, Spark, Tableau'
  },

  // Non-technical users
  {
    email: 'david.miller@yale.edu',
    password: hashPassword('password123'),
    name: 'David Miller',
    country: 'United States',
    university: 'Yale University',
    user_type: 'non-technical',
    bio: 'Business major with a vision for sustainable tech solutions.',
    idea_description: 'A platform that connects local farmers with restaurants to reduce food waste and support local agriculture.',
    equity_offer: '15% equity',
    timeline: '4 months'
  },
  {
    email: 'sophia.rodriguez@columbia.edu',
    password: hashPassword('password123'),
    name: 'Sophia Rodriguez',
    country: 'United States',
    university: 'Columbia University',
    user_type: 'non-technical',
    bio: 'Marketing enthusiast looking to revolutionize the fitness industry.',
    idea_description: 'An AI-powered fitness app that creates personalized workout plans based on user goals and available equipment.',
    equity_offer: '20% equity + profit sharing',
    timeline: '6 months'
  },
  {
    email: 'james.anderson@princeton.edu',
    password: hashPassword('password123'),
    name: 'James Anderson',
    country: 'United States',
    university: 'Princeton University',
    user_type: 'non-technical',
    bio: 'Economics student passionate about fintech innovation.',
    idea_description: 'A micro-investing platform specifically designed for college students to start investing with as little as $5.',
    equity_offer: '10% equity',
    timeline: '5 months'
  },
  {
    email: 'olivia.brown@cornell.edu',
    password: hashPassword('password123'),
    name: 'Olivia Brown',
    country: 'United States',
    university: 'Cornell University',
    user_type: 'non-technical',
    bio: 'Psychology major interested in mental health tech.',
    idea_description: 'A peer support app that matches college students with similar mental health challenges for anonymous group chats.',
    equity_offer: 'Free (great for resume)',
    timeline: '3 months'
  },
  {
    email: 'ryan.patel@duke.edu',
    password: hashPassword('password123'),
    name: 'Ryan Patel',
    country: 'United States',
    university: 'Duke University',
    user_type: 'non-technical',
    bio: 'Entrepreneurship student with big ideas for education tech.',
    idea_description: 'A gamified study platform that turns textbook content into interactive quizzes and challenges.',
    equity_offer: '$1000 + 5% equity',
    timeline: '4 months'
  },
  {
    email: 'maya.thompson@uchicago.edu',
    password: hashPassword('password123'),
    name: 'Maya Thompson',
    country: 'United States',
    university: 'University of Chicago',
    user_type: 'non-technical',
    bio: 'Political science major looking to improve civic engagement.',
    idea_description: 'A non-partisan platform that simplifies political information and helps young voters make informed decisions.',
    equity_offer: '25% equity',
    timeline: '6 months'
  },
  {
    email: 'ethan.lee@northwestern.edu',
    password: hashPassword('password123'),
    name: 'Ethan Lee',
    country: 'United States',
    university: 'Northwestern University',
    user_type: 'non-technical',
    bio: 'Journalism major passionate about content creation.',
    idea_description: 'A collaborative writing platform where students can co-author articles and get feedback from peers.',
    equity_offer: 'Free (portfolio piece)',
    timeline: '2 months'
  },
  {
    email: 'isabella.garcia@upenn.edu',
    password: hashPassword('password123'),
    name: 'Isabella Garcia',
    country: 'United States',
    university: 'University of Pennsylvania',
    user_type: 'non-technical',
    bio: 'Pre-med student wanting to improve healthcare access.',
    idea_description: 'A telehealth platform specifically for college students to consult with doctors about non-emergency issues.',
    equity_offer: '15% equity + revenue share',
    timeline: '5 months'
  }
];

const insertUser = db.prepare(`
  INSERT INTO users (email, password, name, country, university, user_type, bio, skills, idea_description, equity_offer, timeline)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

users.forEach(user => {
  insertUser.run(
    user.email,
    user.password,
    user.name,
    user.country,
    user.university,
    user.user_type,
    user.bio,
    user.skills || null,
    user.idea_description || null,
    user.equity_offer || null,
    user.timeline || null
  );
});

console.log(`✓ Successfully seeded ${users.length} users`);
console.log('\nYou can sign in with any of these accounts:');
console.log('Email: sarah.chen@mit.edu (or any other email above)');
console.log('Password: password123');
console.log('\nDatabase seeding complete!');

// Close the database connection
db.close();
