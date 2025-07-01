# Trip Expense Manager

A comprehensive web application for managing and splitting group travel expenses. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- 🔐 **Google Authentication** - Secure login with Google OAuth
- 🏖️ **Trip Management** - Create and manage multiple trips
- 💰 **Expense Tracking** - Add, edit, and categorize expenses
- ⚖️ **Smart Splitting** - Equal, custom, or percentage-based expense splitting
- 📊 **Settlement Calculator** - See who owes whom and how much
- 📱 **Responsive Design** - Works on all devices
- 🔗 **Shareable Links** - Invite friends to trips (coming soon)
- 📄 **Export Features** - PDF/CSV export (coming soon)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI, Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sajhedari-slip-expense
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_NEXT_PUBLIC_GOOGLE_CLIENT_ID_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# MongoDB
MONGODB_URI=your_mongodb_connection_string_here
```

4. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

5. Set up MongoDB:
   - Create a MongoDB database (local or cloud)
   - Get your connection string
   - Update `MONGODB_URI` in `.env.local`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages and API routes
├── models/             # Mongoose database models
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── styles/             # Global styles
└── utils/              # Helper functions
```

## Usage

1. **Sign In**: Use Google OAuth to authenticate
2. **Create Trip**: Add trip details, dates, currency, and members
3. **Add Expenses**: Record expenses with payer and split type
4. **View Settlements**: See who owes whom and settle up

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
