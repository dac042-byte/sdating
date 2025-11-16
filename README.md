# Coupling - Student Project Matching Platform

A Tinder-style matching platform that connects ambitious students to create projects together. Connects non-technical idea makers with technical people who can make those ideas a reality.

## Features

- 🎓 **Student Exclusive** - Built for college and high school students
- 💡 **Idea Matching** - Non-technical founders meet technical builders
- 💬 **Real-time Chat** - Message your matches instantly
- 🎨 **Beautiful UI** - Modern, cozy design with dark/light themes
- 🔒 **Secure Auth** - JWT-based authentication system
- 📱 **Responsive** - Works seamlessly on all devices

## Tech Stack

### Frontend
- React 18
- React Router v6
- Vite
- CSS3 with custom theming

### Backend
- Node.js with Express
- Better-SQLite3 (database)
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Seed the database with placeholder users:**
   ```bash
   npm run seed
   ```

### Running the Application

**Start both frontend and backend concurrently:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:3000`

### Test Accounts

After seeding, you can sign in with any of these accounts:

**Technical Users:**
- sarah.chen@mit.edu
- alex.kumar@stanford.edu
- emma.wilson@harvard.edu
- marcus.johnson@berkeley.edu
- lily.zhang@caltech.edu

**Non-Technical Users:**
- david.miller@yale.edu
- sophia.rodriguez@columbia.edu
- james.anderson@princeton.edu
- olivia.brown@cornell.edu
- ryan.patel@duke.edu
- maya.thompson@uchicago.edu
- ethan.lee@northwestern.edu
- isabella.garcia@upenn.edu

**Password for all accounts:** `password123`

## Usage

1. **Sign Up/Sign In** - Create an account or sign in with test credentials
2. **Choose Your Type** - Select whether you're technical or non-technical
3. **Complete Your Profile** - Add your skills, ideas, or project details
4. **Start Swiping** - Swipe right to like, left to pass
5. **Match & Chat** - When both users swipe right, it's a match!
6. **Build Together** - Use the chat to discuss your project

## Themes

Toggle between two beautiful themes:
- **Dark Theme** - Purple and dark tones (default)
- **Light Theme** - Pink and light tones

Click the theme toggle button (☀️/🌙) on any page to switch.

## Project Structure

```
coupling/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Express backend
│   ├── index.js          # Server entry point
│   ├── database.js       # Database schema
│   ├── auth.js           # Authentication logic
│   └── seed.js           # Database seeding
└── package.json          # Root package file
```

## API Endpoints

### Authentication
- `POST /api/signup` - Create new account
- `POST /api/signin` - Sign in

### Users
- `GET /api/profile` - Get current user profile
- `GET /api/users/discover` - Get users to swipe on

### Matching
- `POST /api/swipe` - Swipe on a user
- `GET /api/matches` - Get all matches

### Messaging
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages` - Send a message

## Business Model (Future)

- Limited swipes per week
- Premium membership ($2/month) for unlimited swipes
- "See who likes you" feature (premium)
- Advertisements
- Feedback system

## Future Features

- [ ] Rating system for engineers
- [ ] Advanced filtering
- [ ] Video profiles
- [ ] Project showcase
- [ ] Email notifications
- [ ] Mobile app (React Native)

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ for ambitious students who want to build amazing things together.
