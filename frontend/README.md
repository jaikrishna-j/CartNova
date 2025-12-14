# CartNova Frontend

React-based frontend application for CartNova e-commerce platform, built with Vite, Tailwind CSS, and modern React patterns.

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Framer Motion** - Animation library
- **Lottie React** - Animation rendering
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/              # React components
│   │   ├── cart/                # Shopping cart components
│   │   ├── checkout/            # Checkout components
│   │   ├── home/                # Home page components
│   │   ├── pages/               # Static pages (About, Contact, etc.)
│   │   ├── payment/             # Payment components
│   │   ├── product/             # Product page components
│   │   ├── ui/                  # Reusable UI components (NavBar, Footer, etc.)
│   │   └── user/                # User-related components (Login, Profile, etc.)
│   ├── context/                 # React context providers
│   │   └── AuthContext.jsx      # Authentication context
│   ├── hooks/                   # Custom React hooks
│   ├── layout/                  # Layout components
│   ├── services/                 # API services
│   │   └── apiProducts.js       # Product API service
│   ├── utils/                   # Utility functions
│   │   └── imageProxy.js         # Image proxy utility
│   ├── assets/                   # Static assets (animations, images)
│   ├── api.js                    # API configuration
│   ├── App.jsx                   # Main App component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/                       # Public assets
└── package.json                  # Node dependencies
```

## 🌐 Deployment

### Vercel

1. Import project in Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables if needed
5. Deploy!

## 📚 Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Product Search**: Real-time search with debouncing
- **Shopping Cart**: Full cart management functionality
- **User Authentication**: JWT-based authentication
- **Product Recommendations**: AI-powered recommendations
- **Payment Integration**: Razorpay and PayPal support
- **Smooth Animations**: Framer Motion and Lottie animations
