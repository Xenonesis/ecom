# 🛍️ ShopHub - Full-Stack E-Commerce Platform

A modern, scalable e-commerce platform built with Next.js 16, Supabase, and Stripe. Features role-based dashboards for customers, sellers, and admins. This platform allows customers to browse products, sellers to manage their inventory and sales, and admins to oversee the entire system.

## 🌟 Executive Summary

ShopHub is an advanced e-commerce solution designed to provide a seamless shopping experience for customers while offering powerful tools for sellers and administrators. The platform leverages modern technologies to deliver a fast, secure, and scalable application that can grow with your business needs.

The platform supports three distinct user types:
- **Customers**: Browse products, make purchases, track orders, and leave reviews
- **Sellers**: Manage their own product inventory, track sales, and manage orders
- **Administrators**: Oversee the entire platform, manage users, and handle analytics

All data is securely stored in PostgreSQL via Supabase, with Row-Level Security (RLS) ensuring proper access controls. Payments are handled securely through Stripe integration, and the application is designed with responsive UI/UX principles for optimal mobile and desktop experiences.

## ✨ Key Features

### Customer Features
- 🔐 Advanced authentication (Email/Password) with role-based access
- 🛒 Persistent shopping cart with session recovery
- 💳 Secure checkout with Stripe integration and multiple payment options
- 📦 Comprehensive order tracking and detailed order history
- ⭐ Product reviews and ratings with moderation tools
- ❤️ Wishlist functionality for saving favorite products
- 🔍 Advanced product search and filtering by category, price, and rating
- 🎨 Dark/Light mode toggle for comfortable browsing
- 📍 Address management for convenient checkout

### Seller Features
- 📊 Comprehensive dashboard with real-time sales analytics
- 📈 Revenue tracking and sales performance metrics
- 📦 Full product management (Create, Read, Update, Delete operations)
- 🖼️ Image upload via Supabase Storage with multiple image management
- 🔔 Real-time order notifications and status updates
- 📋 Order management system with status tracking
- 📊 Product performance analytics and inventory insights
- 💰 Commission tracking and payment processing

### Admin Features
- 👥 Comprehensive user management dashboard
- ✅ Seller approval workflow and verification system
- 📊 Platform-wide analytics and performance metrics
- 📋 Order oversight and management tools
- 🏷️ Category management with CRUD operations
- 💰 Revenue tracking and commission analytics
- 🔒 Security and compliance monitoring
- 📈 Business intelligence and reporting tools

## 🚀 Tech Stack

This project utilizes a modern, robust technology stack:

- **Frontend Framework**: Next.js 16 with App Router, leveraging React 19 features
- **Styling**: TailwindCSS 4 for utility-first CSS framework
- **Database**: PostgreSQL via Supabase with Row-Level Security
- **Authentication**: Supabase Auth with email/password and OAuth options
- **Storage**: Supabase Storage for product images and files
- **State Management**: Zustand for efficient global state management
- **Payments**: Stripe for secure payment processing
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide Icons for consistent iconography
- **Type Safety**: TypeScript for enhanced development experience
- **3D Graphics**: OGL library for enhanced product visualization (optional)

## 📋 Prerequisites

Before setting up this project, ensure you have the following installed:

- Node.js 18+ (LTS recommended)
- npm, pnpm, or yarn package manager
- A Supabase account (free tier available)
- A Stripe account (for payment processing)
- Basic knowledge of React, Next.js, and TypeScript

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

First, clone the repository and install dependencies:

```bash
git clone <repository-url>
cd ecom
npm install
# or
pnpm install
# or
yarn install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and API keys from Project Settings > API
3. Go to SQL Editor and run the schema from `supabase/schema.sql`
4. Enable Email Auth in Authentication settings
5. Create a storage bucket named `product-images` and set public access
6. Navigate to Authentication > Providers and enable email authentication
7. Set up Row Level Security policies as defined in the schema

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="ShopHub E-Commerce"
NEXT_PUBLIC_SITE_DESCRIPTION="Modern e-commerce platform with seller and admin dashboards"

# Optional: Other environment variables
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

### 5. Seed the Database (Optional)

To populate your database with sample data for testing:

```bash
# Using Supabase CLI
supabase db seed
```

## 📁 Project Structure

The application follows a modular architecture with clear separation of concerns:

```
ecom/
├── app/                        # Next.js 13+ App Router directory
│   ├── (auth)/                 # Authentication-related pages
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── forgot-password/    # Password recovery
│   │   └── reset-password/     # Password reset
│   ├── admin/                  # Admin dashboard routes
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── users/              # User management
│   │   ├── products/           # Product oversight
│   │   ├── orders/             # Order management
│   │   └── settings/           # Admin settings
│   ├── seller/                 # Seller dashboard routes
│   │   ├── dashboard/          # Seller dashboard
│   │   ├── products/           # Product management
│   │   ├── orders/             # Order management
│   │   ├── analytics/          # Sales analytics
│   │   └── settings/           # Seller settings
│   ├── customer/               # Customer-specific routes
│   ├── product/[id]/           # Product detail pages
│   ├── products/               # Product listings
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Checkout flow
│   ├── orders/                 # Order history
│   ├── profile/                # User profile
│   ├── wishlist/               # Wishlist functionality
│   ├── categories/             # Category browsing
│   ├── deals/                  # Special offers and deals
│   ├── api/                    # API routes (payment, admin, etc.)
│   │   ├── auth/               # Authentication APIs
│   │   ├── stripe/             # Stripe webhook handlers
│   │   ├── products/           # Product APIs
│   │   ├── orders/             # Order APIs
│   │   └── admin/              # Admin APIs
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # Reusable React components
│   ├── ui/                     # UI components (buttons, cards, etc.)
│   ├── navbar.tsx              # Navigation bar component
│   ├── product-card.tsx        # Product display component
│   ├── theme-provider.tsx      # Theme context provider
│   └── ...                     # Other shared components
├── lib/                        # Business logic and utilities
│   ├── supabase/               # Supabase client configuration
│   │   ├── client.ts           # Client-side client
│   │   ├── server.ts           # Server-side client
│   │   └── middleware.ts       # Server client for middleware
│   ├── store/                  # Zustand stores
│   │   ├── cart-store.ts       # Shopping cart state
│   │   ├── user-store.ts       # User state management
│   │   └── ...                 # Other stores
│   ├── utils.ts                # Utility functions
│   └── constants.ts            # Application constants
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── icons/                  # Favicon and app icons
│   └── ...                     # Other static files
├── supabase/                   # Supabase configuration
│   ├── config.toml             # Supabase CLI configuration
│   ├── schema.sql              # Database schema
│   ├── seed.sql                # Seed data
│   └── migrations/             # Database migrations
├── scripts/                    # Utility scripts
│   └── ...                     # Deployment and other scripts
├── middleware.ts               # Next.js middleware for auth
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## 🗄️ Database Schema

The database schema is implemented in PostgreSQL via Supabase with the following structure:

### Core Tables:
- **users**: Stores user profiles with role-based access (customer, seller, admin)
- **products**: Product catalog with seller associations, pricing, and inventory
- **orders**: Order records with items, payment status, and shipping information
- **reviews**: Product reviews and ratings with user verification
- **cart**: Shopping cart items with quantities
- **wishlist**: Saved products for later purchase
- **categories**: Product categorization system

### Key Features of the Schema:
- Custom ENUM types for roles, order status, and payment status
- UUID primary keys for security and scalability
- JSONB fields for flexible data storage (orders, addresses)
- Array fields for product images
- Comprehensive indexes for optimized queries
- Row-Level Security (RLS) policies for data protection
- Triggers for automatic timestamp updates and rating calculations

### Security Features:
- RLS policies restrict data access based on user roles
- Foreign key constraints ensure referential integrity
- Check constraints maintain data validity
- Automatic rating updates via triggers when reviews are submitted

## 🔐 Authentication Flow

The authentication system provides secure access control with the following features:

1. **User Registration**: Email/password registration with role selection
2. **Role Assignment**: Users can choose between customer and seller during signup
3. **Seller Verification**: Sellers require admin approval before becoming active
4. **Session Management**: JWT-based authentication via Supabase
5. **Protected Routes**: Middleware ensures only authorized users access protected areas
6. **Role-Based Redirects**: Users are redirected based on their assigned role

The authentication flow is secured with:
- Password hashing and verification
- Session timeouts and renewal
- Email verification for account activation
- Secure credential storage

## 💳 Payment Integration

The platform uses Stripe for secure payment processing:

1. **Checkout Process**: Customers enter shipping and payment information
2. **Payment Intent**: Server-side creation of Stripe payment intents
3. **Secure Processing**: All sensitive data handled by Stripe Elements
4. **Webhook Handling**: Server-side confirmation of payment success
5. **Order Status**: Automatic status updates based on payment results
6. **Refund Processing**: Built-in refund functionality for order management

### Payment Security Features:
- PCI compliance through Stripe integration
- Encrypted payment data transmission
- Automatic fraud detection
- Secure webhook verification
- Audit logging for payment events

## 🎨 UI/UX Design

The user interface is designed with the following principles:

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: ARIA attributes and keyboard navigation support
- **Performance**: Optimized loading with image optimization
- **Consistency**: Consistent design language throughout the application
- **User Experience**: Intuitive navigation and clear user flows

### Design System Components:
- Custom theme with light/dark mode support
- Accessible component library using Radix UI
- Consistent spacing and typography
- Loading states and error handling
- Interactive feedback for user actions

## 📊 Admin Dashboard

The admin dashboard provides comprehensive oversight capabilities:

### Key Features:
- **User Management**: View, edit, and manage all users
- **Seller Approval**: Review and approve seller applications
- **Analytics Dashboard**: Revenue, user growth, and sales metrics
- **Order Management**: Oversee all platform orders
- **Product Management**: View and moderate all products
- **System Monitoring**: Performance and error tracking

### Analytics Metrics:
- Daily/Monthly revenue tracking
- User acquisition and retention metrics
- Top selling products and categories
- Platform performance indicators
- Security and compliance monitoring

## 🏪 Seller Dashboard

Sellers have access to a dedicated dashboard with business tools:

### Seller Features:
- **Product Management**: Add, edit, and delete products
- **Inventory Tracking**: Monitor stock levels and sales
- **Sales Analytics**: Revenue, profit, and performance metrics
- **Order Management**: Process and track customer orders
- **Product Images**: Upload and manage product photos
- **Pricing Tools**: Adjust prices and apply discounts

### Seller Benefits:
- Real-time sales reporting
- Commission and earnings tracking
- Customer communication tools
- Performance insights and recommendations

## 🛒 Customer Experience

The customer experience focuses on ease of use and security:

### Shopping Features:
- **Product Discovery**: Advanced search and filtering
- **Wishlist**: Save products for later purchase
- **Reviews**: Read and write product reviews
- **Order Tracking**: Real-time order status updates
- **Secure Checkout**: Streamlined and secure purchase process
- **Account Management**: Profile, address, and order history

### Customer Benefits:
- Personalized product recommendations
- Secure payment processing
- Responsive customer support
- Easy returns and refund policy

## 🧪 Testing Strategy

The application includes comprehensive testing at multiple levels:

### Unit Testing:
- Component testing with React Testing Library
- Utility function testing
- Store state testing with Zustand

### Integration Testing:
- API route testing
- Database interaction testing
- Authentication flow testing

### End-to-End Testing:
- Critical user flows testing (Cypress recommended)
- Payment flow testing
- Order processing testing

### Testing Tools:
- Jest for JavaScript testing
- React Testing Library for component testing
- Supabase testing utilities for database tests

## 🚢 Deployment

### Deploy to Vercel (Recommended):
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings to use Node.js 18+
4. Set up custom domains if needed

### Manual Deployment:
```bash
npm run build
npm run start
```

### Environment-Specific Configuration:
- Production database connections
- SSL certificate configuration
- CDN setup for static assets
- Performance monitoring tools
- Error tracking and logging

## 🔧 API Documentation

### Authentication API Endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product API Endpoints:
- `GET /api/products` - Get product listings
- `GET /api/products/[id]` - Get specific product
- `POST /api/products` - Create new product (seller/admin only)
- `PUT /api/products/[id]` - Update product (seller/admin only)
- `DELETE /api/products/[id]` - Delete product (seller/admin only)

### Order API Endpoints:
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get specific order
- `PUT /api/orders/[id]` - Update order status (seller/admin only)

### Stripe API Endpoints:
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/webhook` - Handle payment webhooks

## 🔒 Security Measures

### Data Protection:
- Encrypted data transmission (HTTPS)
- Secure credential storage
- Input validation and sanitization
- SQL injection prevention via parameterized queries
- Cross-site scripting (XSS) prevention

### Access Control:
- Role-based access control (RBAC)
- Row-level security (RLS) for database access
- API rate limiting
- Session management with secure tokens
- Secure password policies

### Audit Trail:
- User activity logging
- Payment transaction records
- Security event monitoring
- Compliance reporting

## 📈 Performance Optimization

### Frontend Optimization:
- Code splitting and lazy loading
- Image optimization and WebP support
- Caching strategies for API calls
- Bundle size optimization
- Responsive design for all devices

### Backend Optimization:
- Database query optimization
- Proper indexing strategies
- Caching layers where appropriate
- Efficient API response formatting
- Database connection pooling

### Monitoring:
- Performance metrics tracking
- Error monitoring and alerting
- User experience monitoring
- Resource utilization tracking

## 🤝 Contributing

We welcome contributions to enhance this e-commerce platform! Here's how you can contribute:

### Getting Started:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Contribution Guidelines:
- Follow the existing code style
- Write clear, descriptive commit messages
- Add tests for new functionality
- Document any API changes
- Ensure code is well-commented where complex
- Keep PRs focused on a single feature or bug fix

### Development Workflow:
1. **Feature Development**: Create feature branches from `main`
2. **Code Review**: All PRs require review before merging
3. **Testing**: Ensure all tests pass before submitting
4. **Documentation**: Update documentation for new features
5. **Changelog**: Include updates in the changelog

## 🧩 Extending the Platform

This platform is designed to be extensible for additional functionality:

### Possible Extensions:
- Email notification system
- Inventory management integration
- Advanced analytics and reporting
- Mobile application development
- Multi-language support
- Multi-currency support
- Advanced discount and coupon system
- Subscription-based product offerings

### API Extension Points:
- Webhook system for external integrations
- Plugin architecture for marketplace features
- GraphQL API for more flexible data queries
- Third-party service integrations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Resources

### Getting Help:
- Check the documentation in this README
- Review the Next.js documentation
- Consult the Supabase documentation
- Look at the example code in the repository

### Issue Reporting:
- Use the GitHub Issues section to report bugs
- Include steps to reproduce the issue
- Provide environment and browser information
- Suggest possible solutions if known

### Community Resources:
- Join the Next.js community
- Participate in the Supabase community
- Engage with other developers using this platform

## 🏆 Success Metrics

This platform is designed to meet the following KPIs:

- ⚡ **Performance**: 95%+ Lighthouse performance score
- 🛒 **Commerce**: Process 1000+ orders monthly
- 💰 **Growth**: 10% monthly user growth
- 💬 **Satisfaction**: 90%+ positive user feedback
- 🔐 **Security**: Zero security breaches

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks:
- Database backup and recovery testing
- Security vulnerability scanning
- Dependency updates and patching
- Performance monitoring and optimization
- User feedback analysis and implementation

### Update Strategy:
- Follow semantic versioning
- Maintain backward compatibility where possible
- Document breaking changes clearly
- Provide migration guides when necessary

---

## 🎯 Conclusion

ShopHub provides a comprehensive, scalable e-commerce solution with robust features for customers, sellers, and administrators. Built with modern technologies and security best practices, it's designed to support growing businesses and provide an excellent user experience.

For questions or support, please open an issue in the repository or contact the development team.