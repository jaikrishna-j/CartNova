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

## 📋 Prerequisites

- **Node.js 18+** and npm

## 🚀 Installation & Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update `frontend/src/api.js` with your backend URL:
   ```javascript
   const API_BASE_URL = 'http://127.0.0.1:8000';
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── cart/           # Cart-related components
│   │   ├── home/           # Home page components
│   │   ├── product/        # Product page components
│   │   ├── ui/             # Reusable UI components
│   │   └── ...
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── assets/             # Static assets
│   ├── api.js              # API configuration
│   └── App.jsx             # Main App component
├── public/                 # Public assets
└── package.json            # Node dependencies
```

## 🎯 Usage

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
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
