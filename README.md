# Coupling

A modern platform connecting technical and non-technical students for project collaboration.

## Features

- 🎯 **Smart Matching**: Swipe-based interface connecting technical and non-technical students
- 👥 **User Profiles**: Detailed profiles showcasing skills, project ideas, and compensation offers
- 🎨 **Dual Themes**: Dark purplish theme and light pinkish theme
- 🔐 **Authentication**: Secure sign up and sign in system
- 🌍 **Global Reach**: Support for students from universities worldwide
- ✉️ **Match System**: Get matched when both users swipe right

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: bcryptjs, express-session

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Seed the database with placeholder users:
```bash
node seed.js
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Development

For development with auto-reload:
```bash
npm run dev
```

### Test Users

The database is seeded with sample users. All users can login with:
- **Password**: `password123`

Example accounts:
- **Technical**: alex.chen@stanford.edu
- **Non-Technical**: jordan.smith@harvard.edu

## Usage

1. **Sign Up**: Create an account by selecting your country, university, and user type (technical or non-technical)
2. **Complete Profile**:
   - Technical users: Add skills and bio
   - Non-technical users: Describe project idea, timeline, and compensation
3. **Start Swiping**: Browse potential collaborators and swipe right to like, left to pass
4. **Match**: When both users swipe right, you get a match!
5. **View Matches**: Access all your matches and contact information

## Project Structure

```
coupling/
├── server.js           # Express server and API routes
├── seed.js            # Database seeding script
├── package.json       # Dependencies
└── public/            # Frontend files
    ├── index.html     # Landing/sign in page
    ├── signup.html    # Sign up page
    ├── app.html       # Main app (swiping interface)
    ├── styles.css     # Styling with theme support
    ├── auth.js        # Sign in functionality
    ├── signup.js      # Sign up functionality
    └── app.js         # Main app functionality
```

## API Endpoints

- `POST /api/signup` - Create new user account
- `POST /api/signin` - Sign in user
- `POST /api/signout` - Sign out user
- `GET /api/me` - Get current user info
- `GET /api/potential-matches` - Get potential matches
- `POST /api/swipe` - Record a swipe
- `GET /api/matches` - Get user's matches

## Future Enhancements

- Premium features (unlimited swipes, see who likes you)
- Chat functionality
- Profile ratings and reviews
- Mobile app (React Native)
- Email notifications
- Advanced filtering options
- Privacy policy and terms of service

## License

ISC
