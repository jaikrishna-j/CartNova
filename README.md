# CartNova 🛒

CartNova is a full-stack e-commerce platform with a React/Tailwind frontend deployed on Vercel and a Django REST + MySQL backend on Render. It features over 11k products across 10 categories, TF-IDF + Cosine Similarity recommendations, top-selling product visualizations, authentication, and full cart/order workflows.

## ✨ Features

- 🛍️ **Product Catalog**: Browse over 11,000 products across 10+ categories
- 🔍 **Smart Recommendations**: TF-IDF + Cosine Similarity algorithm for personalized product recommendations
- 📊 **Analytics**: Top-selling product visualizations and insights
- 🔐 **Authentication**: Secure user authentication with JWT tokens
- 🔑 **Social Login**: Google OAuth integration via django-allauth
- 🛒 **Shopping Cart**: Full cart management with add, update, and remove functionality
- 💳 **Payment Integration**: Razorpay and PayPal payment gateway support
- 📱 **Responsive Design**: Modern UI built with React, Tailwind CSS, and Material-UI
- 🎨 **Beautiful UI**: Smooth animations with Framer Motion and Lottie
- 🔒 **Security**: reCAPTCHA integration for enhanced security

## 🛠️ Tech Stack

### Frontend
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

### Backend
- **Django 5.2.7** - Web framework
- **Django REST Framework** - REST API toolkit
- **MySQL** - Database
- **JWT Authentication** - Token-based auth
- **django-allauth** - Authentication library
- **django-cors-headers** - CORS handling
- **Razorpay** - Payment gateway
- **PayPal SDK** - Payment integration
- **NumPy & Pandas** - Data processing for recommendations

## 📁 Project Structure

```
CartNova/
├── backend/                 # Django backend
│   ├── cartnova/           # Django project settings
│   ├── core/               # Core app (users, authentication)
│   ├── shop_app/           # E-commerce app (products, cart, orders)
│   ├── shopenv/            # Virtual environment (not in git)
│   ├── staticfiles/        # Collected static files
│   ├── media/              # User uploaded files
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Node dependencies
│
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13+** (or Python 3.8+)
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Git**

## 🚀 Installation & Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jaikrishna-j/CartNova.git
   cd CartNova
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Create and activate virtual environment**
   
   **Windows:**
   ```bash
   python -m venv shopenv
   .\shopenv\Scripts\Activate.ps1
   ```
   
   **Linux/Mac:**
   ```bash
   python3 -m venv shopenv
   source shopenv/bin/activate
   ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up MySQL database**
   ```sql
   CREATE DATABASE cartnova_db;
   ```

6. **Configure database settings**
   
   Update `backend/cartnova/settings.py` with your MySQL credentials:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'cartnova_db',
           'USER': 'your_username',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

7. **Run migrations**
   ```bash
   python manage.py migrate
   ```

8. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

9. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

10. **Run the development server**
    ```bash
    python manage.py runserver
    ```
    
    The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

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

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory (not committed to git):

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=cartnova_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# reCAPTCHA
GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
GOOGLE_RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://127.0.0.1:8000/accounts/google/login/callback/` (development)
   - Your production URL (for deployment)

## 🎯 Usage

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start the frontend server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://127.0.0.1:8000`
   - Django Admin: `http://127.0.0.1:8000/admin`

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
python manage.py collectstatic --noinput
```

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables if needed
6. Deploy!

### Backend (Render)

1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn cartnova.wsgi:application`
5. Add environment variables
6. Configure MySQL database addon
7. Deploy!

## 📚 API Endpoints

### Authentication
- `POST /token/` - Get JWT token
- `POST /token/refresh/` - Refresh JWT token
- `POST /accounts/register/` - User registration
- `POST /accounts/login/` - User login
- `GET /accounts/google/login/` - Google OAuth login

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/recommendations/{id}/` - Get product recommendations
- `GET /api/products/top-selling/` - Get top-selling products

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{id}/` - Update cart item
- `DELETE /api/cart/remove/{id}/` - Remove cart item

### Orders
- `GET /api/orders/` - Get user's orders
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/{id}/` - Get order details

