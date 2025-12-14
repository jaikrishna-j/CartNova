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
│   │   │   ├── CartItem.jsx     # Individual cart item
│   │   │   ├── CartPage.jsx     # Cart page
│   │   │   └── CartSummary.jsx  # Cart summary section
│   │   ├── checkout/            # Checkout components
│   │   │   ├── CheckoutPage.jsx # Checkout page
│   │   │   ├── OrderItem.jsx    # Order item component
│   │   │   ├── OrderSummary.jsx # Order summary
│   │   │   └── PaymentSection.jsx # Payment section
│   │   ├── home/                # Home page components
│   │   │   ├── CardContainer.jsx # Product card container
│   │   │   ├── Header.jsx        # Home page header
│   │   │   ├── HomeCard.jsx     # Product card component
│   │   │   ├── HomePage.jsx     # Home page
│   │   │   └── StorePage.jsx    # Store page
│   │   ├── pages/               # Static pages
│   │   │   ├── AboutPage.jsx    # About page
│   │   │   ├── ContactPage.jsx  # Contact page
│   │   │   ├── PrivacyPage.jsx  # Privacy policy
│   │   │   └── TermsPage.jsx    # Terms of service
│   │   ├── payment/             # Payment components
│   │   │   └── PaymentStatusPage.jsx # Payment status page
│   │   ├── product/             # Product page components
│   │   │   ├── ProductPage.jsx  # Product detail page
│   │   │   ├── ProductPagePlaceHolder.jsx # Product placeholder
│   │   │   └── RelatedProducts.jsx # Related products
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── button.jsx       # Button component
│   │   │   ├── CustomToastContainer.jsx # Toast notifications
│   │   │   ├── Error.jsx        # Error component
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── NavBar.jsx       # Navigation bar
│   │   │   ├── NetworkErrorDisplay.jsx # Network error display
│   │   │   ├── NotFoundPage.jsx # 404 page
│   │   │   ├── PagePagination.jsx # Pagination component
│   │   │   ├── pagination.jsx   # Pagination utility
│   │   │   ├── PlaceHolder.jsx  # Loading placeholder
│   │   │   ├── PlaceHolderContainer.jsx # Placeholder container
│   │   │   ├── ProtectedRoute.jsx # Protected route wrapper
│   │   │   ├── Spinner.jsx      # Loading spinner
│   │   │   └── Store.jsx        # Store component
│   │   └── user/                # User-related components
│   │       ├── EditProfileModal.jsx # Edit profile modal
│   │       ├── LoginPage.jsx    # Login page
│   │       ├── OrderHistoryItem.jsx # Order history item
│   │       ├── OrderHistoryItemContainer.jsx # Order history container
│   │       ├── RegisterPage.jsx # Registration page
│   │       ├── UserInfo.jsx     # User info component
│   │       └── UserProfilePage.jsx # User profile page
│   ├── context/                 # React context providers
│   │   └── AuthContext.jsx      # Authentication context
│   ├── hooks/                   # Custom React hooks
│   │   └── useCartData.js       # Cart data hook
│   ├── layout/                  # Layout components
│   │   └── MainLayout.jsx       # Main layout wrapper
│   ├── services/                # API services
│   │   └── apiProducts.js       # Product API service
│   ├── utils/                   # Utility functions
│   │   └── imageProxy.js         # Image proxy utility
│   ├── assets/                   # Static assets
│   │   ├── animations/           # Lottie animation files
│   │   │   ├── 404-not-found.json
│   │   │   ├── Login.json
│   │   │   ├── no-network-connection.json
│   │   │   └── Register.json
│   │   └── header-images/        # Header banner images
│   ├── api.js                    # API configuration
│   ├── App.jsx                   # Main App component
│   ├── main.jsx                  # Application entry point
│   ├── index.css                 # Global styles
│   └── tailwind-scope.css        # Tailwind scoped styles
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
