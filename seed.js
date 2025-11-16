const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('coupling.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    university TEXT NOT NULL,
    user_type TEXT NOT NULL,
    bio TEXT,
    skills TEXT,
    equity_offer TEXT,
    project_idea TEXT,
    timeline TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    matched_user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (matched_user_id) REFERENCES users(id),
    UNIQUE(user_id, matched_user_id)
  );

  CREATE TABLE IF NOT EXISTS swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    swiper_id INTEGER NOT NULL,
    swiped_id INTEGER NOT NULL,
    direction TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (swiper_id) REFERENCES users(id),
    FOREIGN KEY (swiped_id) REFERENCES users(id),
    UNIQUE(swiper_id, swiped_id)
  );
`);

async function seedDatabase() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const technicalUsers = [
        {
            email: 'alex.chen@stanford.edu',
            name: 'Alex Chen',
            country: 'United States',
            university: 'Stanford University',
            bio: 'CS major passionate about AI/ML and web development. Looking for interesting projects to build my portfolio.',
            skills: 'Python, TensorFlow, React, Node.js, AWS'
        },
        {
            email: 'sarah.kim@mit.edu',
            name: 'Sarah Kim',
            country: 'United States',
            university: 'MIT',
            bio: 'Full-stack developer with experience in mobile apps. Love building products that solve real problems.',
            skills: 'Swift, Kotlin, React Native, Firebase, Python'
        },
        {
            email: 'marcus.wong@berkeley.edu',
            name: 'Marcus Wong',
            country: 'United States',
            university: 'UC Berkeley',
            bio: 'Backend enthusiast. Interested in scalable systems and database design. Open to equity-based projects.',
            skills: 'Java, Go, PostgreSQL, Docker, Kubernetes'
        },
        {
            email: 'emily.rodriguez@cmu.edu',
            name: 'Emily Rodriguez',
            country: 'United States',
            university: 'Carnegie Mellon',
            bio: 'Software engineering student looking to gain startup experience. Strong interest in fintech.',
            skills: 'JavaScript, TypeScript, React, Node.js, MongoDB'
        },
        {
            email: 'rahul.patel@cambridge.ac.uk',
            name: 'Rahul Patel',
            country: 'United Kingdom',
            university: 'University of Cambridge',
            bio: 'Computer science student with a passion for blockchain and decentralized applications.',
            skills: 'Solidity, Web3.js, Ethereum, JavaScript, Python'
        },
        {
            email: 'lisa.johnson@oxford.ac.uk',
            name: 'Lisa Johnson',
            country: 'United Kingdom',
            university: 'University of Oxford',
            bio: 'Data science enthusiast. Love working on projects that use data to drive decisions.',
            skills: 'Python, R, scikit-learn, Pandas, SQL, Tableau'
        },
        {
            email: 'david.lee@utoronto.ca',
            name: 'David Lee',
            country: 'Canada',
            university: 'University of Toronto',
            bio: 'Frontend developer who cares deeply about user experience and accessibility.',
            skills: 'React, Vue.js, CSS/SASS, Figma, JavaScript'
        },
        {
            email: 'nina.mueller@tum.de',
            name: 'Nina Mueller',
            country: 'Germany',
            university: 'Technical University Munich',
            bio: 'IoT and embedded systems developer. Interested in hardware-software integration projects.',
            skills: 'C++, Python, Arduino, Raspberry Pi, MQTT'
        }
    ];

    const nonTechnicalUsers = [
        {
            email: 'jordan.smith@harvard.edu',
            name: 'Jordan Smith',
            country: 'United States',
            university: 'Harvard University',
            bio: 'Economics major with a startup idea in the EdTech space.',
            projectIdea: 'A platform that gamifies learning through AI-powered personalized quizzes and competitions between students.',
            timeline: '4-6 months for MVP',
            equityOffer: '15% equity as co-founder'
        },
        {
            email: 'maya.jackson@yale.edu',
            name: 'Maya Jackson',
            country: 'United States',
            university: 'Yale University',
            bio: 'Marketing and design background. Want to create sustainable fashion marketplace.',
            projectIdea: 'Mobile app connecting sustainable fashion brands with conscious consumers, featuring AR try-on.',
            timeline: '3-4 months',
            equityOffer: '20% equity + small revenue share'
        },
        {
            email: 'chris.taylor@princeton.edu',
            name: 'Chris Taylor',
            country: 'United States',
            university: 'Princeton University',
            bio: 'Finance student looking to disrupt the budgeting app space.',
            projectIdea: 'Smart budgeting app that uses AI to predict expenses and automatically categorize transactions.',
            timeline: '2-3 months for beta',
            equityOffer: '12% equity or $1000 upon launch'
        },
        {
            email: 'priya.sharma@lse.ac.uk',
            name: 'Priya Sharma',
            country: 'United Kingdom',
            university: 'London School of Economics',
            bio: 'Passionate about mental health and wellness technology.',
            projectIdea: 'Anonymous peer support platform for college students with AI-powered resource matching.',
            timeline: '5 months',
            equityOffer: '18% equity as technical co-founder'
        },
        {
            email: 'lucas.martin@sorbonne.fr',
            name: 'Lucas Martin',
            country: 'France',
            university: 'Sorbonne University',
            bio: 'Business student with experience in the food industry.',
            projectIdea: 'App that reduces food waste by connecting restaurants with customers for discounted end-of-day meals.',
            timeline: '3 months',
            equityOffer: '15% equity'
        },
        {
            email: 'sophie.anderson@ubc.ca',
            name: 'Sophie Anderson',
            country: 'Canada',
            university: 'University of British Columbia',
            bio: 'Environmental science major wanting to make climate data accessible.',
            projectIdea: 'Interactive platform visualizing local climate data and connecting users with environmental actions.',
            timeline: '4 months',
            equityOffer: '10% equity + grant funding to share'
        },
        {
            email: 'tom.wilson@melbourne.edu.au',
            name: 'Tom Wilson',
            country: 'Australia',
            university: 'University of Melbourne',
            bio: 'Sports management student with connections in university athletics.',
            projectIdea: 'Platform for college athletes to find training partners and track performance metrics.',
            timeline: '2-3 months',
            equityOffer: 'No equity but can pay $500-1000'
        },
        {
            email: 'anna.berg@karolinska.se',
            name: 'Anna Berg',
            country: 'Sweden',
            university: 'Karolinska Institute',
            bio: 'Medical student interested in telemedicine solutions.',
            projectIdea: 'Telemedicine app specifically for student health services with appointment booking and symptom checker.',
            timeline: '6 months for full release',
            equityOffer: '20% equity as technical co-founder'
        }
    ];

    console.log('Seeding technical users...');
    const technicalStmt = db.prepare(`
        INSERT INTO users (email, password, name, country, university, user_type, bio, skills, equity_offer, project_idea, timeline)
        VALUES (?, ?, ?, ?, ?, 'technical', ?, ?, '', '', '')
    `);

    for (const user of technicalUsers) {
        try {
            technicalStmt.run(user.email, hashedPassword, user.name, user.country, user.university, user.bio, user.skills);
            console.log(`✓ Created: ${user.name}`);
        } catch (error) {
            console.log(`✗ Skipped: ${user.name} (already exists)`);
        }
    }

    console.log('\nSeeding non-technical users...');
    const nonTechnicalStmt = db.prepare(`
        INSERT INTO users (email, password, name, country, university, user_type, bio, skills, equity_offer, project_idea, timeline)
        VALUES (?, ?, ?, ?, ?, 'non-technical', ?, '', ?, ?, ?)
    `);

    for (const user of nonTechnicalUsers) {
        try {
            nonTechnicalStmt.run(user.email, hashedPassword, user.name, user.country, user.university, user.bio, user.equityOffer, user.projectIdea, user.timeline);
            console.log(`✓ Created: ${user.name}`);
        } catch (error) {
            console.log(`✗ Skipped: ${user.name} (already exists)`);
        }
    }

    console.log('\n✅ Database seeding complete!');
    console.log('All users can login with password: password123');
}

seedDatabase().catch(console.error).finally(() => db.close());
