# 🌟 Erotic Digital Nexus (EDN) - AI Content Creation Platform

A comprehensive NSFW/SFW AI content creation and distribution platform built with modern web technologies. EDN enables creators to generate stunning 4K images, 1080p videos, and distribute content across 14+ platforms seamlessly.

## ✨ Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework
- **🗄️ Supabase** - PostgreSQL database & authentication
- **🔐 Prisma ORM** - Type-safe database operations

### 🤖 AI & Content Generation
- **🎨 Z-AI Web Dev SDK** - AI content generation
- **🖼️ Sharp** - High-performance image processing
- **📹 Video Processing** - 1080p video generation support

### 🧩 UI & User Experience
- **🧩 shadcn/ui** - High-quality accessible components
- **🎯 Lucide React** - Beautiful icon library
- **🌈 Framer Motion** - Smooth animations
- **📱 Responsive Design** - Mobile-first approach

### 🔄 Real-time Features
- **⚡ Socket.io** - Real-time communication
- **🔄 TanStack Query** - Server state management
- **🐻 Zustand** - Client state management

## 🚀 Features

### 🎨 AI Content Creation
- **4K Image Generation** - Photorealistic 4096x4096px AI images
- **1080p Video Generation** - High-quality video content with voice integration
- **Face Cloning** - 95% accuracy face cloning technology
- **LoRA Model Support** - Custom AI model integration
- **Real-time Preview** - Live content generation preview

### 🌐 Multi-Platform Distribution
- **14+ Platforms** - Including OnlyFans, Instagram, TikTok, Patreon
- **One-Click Sharing** - Seamless content distribution
- **Platform Analytics** - Performance tracking across platforms
- **Automated Posting** - API-supported content scheduling

### 💰 Monetization & Analytics
- **Subscription Plans** - Tiered pricing (Free, Basic, Pro, Enterprise)
- **Affiliate Program** - 10% commission structure
- **Earnings Dashboard** - Real-time revenue tracking
- **Payout System** - Automated payment processing

### 🎮 Gamification
- **Creator Levels** - Progression system
- **Achievement Badges** - Milestone recognition
- **Leaderboards** - Community rankings
- **Rewards Program** - Incentive system

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- Supabase account
- Z-AI API key

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the environment template and configure your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values. For detailed Supabase setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_string

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI SDK Configuration
ZAI_API_KEY=your_zai_api_key

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. Validate Configuration
Run the validation script to check your setup:

```bash
npm run validate-supabase
```

### 4. Database Setup
```bash
# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed database with platforms
npx tsx scripts/seed-database.ts
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── api/               # API routes
│   ├── create/            # Content creation studio
│   ├── distribute/        # Platform distribution
│   ├── marketplace/       # Creator marketplace
│   ├── dashboard/         # User dashboard
│   └── pricing/           # Subscription plans
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── navigation.tsx    # Navigation component
├── contexts/             # React contexts
│   └── auth-context.tsx  # Authentication context
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── supabase.ts      # Supabase client config
│   ├── supabase-client.ts # Client-side Supabase
│   ├── db.ts            # Prisma client
│   └── socket.ts        # WebSocket configuration
└── scripts/             # Database scripts
    └── seed-database.ts  # Database seeding
```

## 🎨 Available Pages

### 🏠 Landing Page (`/`)
- Hero section with NSFW/SFW toggle
- Feature showcase
- Platform grid
- Statistics display

### 🔐 Authentication (`/auth/signin`)
- Email/password authentication
- Google OAuth integration
- Sign up/sign in flows

### 🎨 Create Studio (`/create`)
- AI content generation interface
- LoRA model selection
- Real-time preview
- Content management

### 📤 Distribution (`/distribute`)
- Platform connection management
- Content scheduling
- Analytics dashboard
- Multi-platform posting

### 🏪 Marketplace (`/marketplace`)
- Creator browsing
- Content filtering
- Upload functionality
- Creator profiles

### 📊 Dashboard (`/dashboard`)
- Earnings overview
- Affiliate tracking
- Content performance
- Payout management

### 💳 Pricing (`/pricing`)
- Subscription plans
- Feature comparison
- FAQ section
- Upgrade flow

## 🔐 Authentication Flow

1. **User Registration**: Email/password or Google OAuth
2. **Email Verification**: Confirmation email sent
3. **Profile Creation**: Automatic user profile creation in database
4. **Session Management**: Secure cookie-based sessions
5. **Protected Routes**: Middleware guards authenticated routes

## 🗄️ Database Schema

### Core Models
- **User**: User accounts with roles and subscriptions
- **Content**: AI-generated content with metadata
- **Platform**: Supported distribution platforms
- **PlatformConnection**: User platform connections
- **Subscription**: User subscription plans
- **Order**: Payment transactions
- **Affiliate**: Affiliate program data
- **Earning**: Revenue tracking
- **Payout**: Payment processing
- **Review**: User feedback

## 🌟 Key Features Implementation

### AI Content Generation
- Uses Z-AI SDK for image and text generation
- Supports multiple content types (IMAGE, VIDEO, AUDIO, TEXT)
- Real-time status updates via WebSocket
- Automatic storage in Supabase

### Platform Integration
- OAuth-based platform connections
- API-supported posting where available
- Manual upload fallback for platforms without API
- Performance analytics tracking

### Monetization
- Stripe integration for payments
- Subscription-based access control
- Affiliate commission tracking
- Automated payout processing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Contact the development team

---

Built with ❤️ for the creator community. Powered by modern web technologies and AI. 🚀
