# CartNova Backend

Django REST Framework backend for CartNova e-commerce platform with MySQL database, JWT authentication, and payment gateway integration.

## 🛠️ Tech Stack

- **Django 5.2.7** - Web framework
- **Django REST Framework** - REST API toolkit
- **MySQL** - Database
- **JWT Authentication** - Token-based auth
- **django-allauth** - Authentication library
- **django-cors-headers** - CORS handling
- **Razorpay** - Payment gateway
- **PayPal SDK** - Payment integration
- **NumPy & Pandas** - Data processing for recommendations

## 📋 Prerequisites

- **Python 3.13+** (or Python 3.8+)
- **MySQL 8.0+**

## 🚀 Installation & Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   
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

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE cartnova_db;
   ```

5. **Configure database settings**
   
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

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

9. **Run the development server**
   ```bash
   python manage.py runserver
   ```
   
   The backend will be available at `http://127.0.0.1:8000`

## 📁 Project Structure

```
backend/
├── cartnova/               # Django project settings
│   ├── settings.py        # Project settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI configuration
├── core/                   # Core app (users, authentication)
│   ├── models.py          # User models
│   ├── views.py           # Authentication views
│   └── urls.py            # Core URLs
├── shop_app/               # E-commerce app (products, cart, orders)
│   ├── models.py          # Product, Cart, Order models
│   ├── views.py           # API views
│   ├── serializers.py     # DRF serializers
│   ├── search_algorithm.py # Search functionality
│   ├── product_recommender.py # Recommendation algorithm
│   └── urls.py            # Shop app URLs
├── manage.py               # Django management script
└── requirements.txt        # Python dependencies
```

## 🎯 Usage

### Development Server

```bash
python manage.py runserver
```

### Create Migrations

```bash
python manage.py makemigrations
```

### Apply Migrations

```bash
python manage.py migrate
```

### Create Superuser

```bash
python manage.py createsuperuser
```

### Collect Static Files

```bash
python manage.py collectstatic
```

## 🌐 Deployment

### Render

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
- `POST /accounts/google-login/` - Google OAuth login
- `GET /accounts/google/login/` - Google OAuth login redirect

### Products
- `GET /products/` - List all products (supports query params: page, q, category, pageSize)
- `GET /categories/` - List all categories
- `GET /product_detail/<slug>/` - Get product details by slug

### Cart
- `GET /get_cart` - Get user's cart
- `POST /add_item/` - Add item to cart
- `POST /update_quantity/` - Update cart item quantity
- `POST /delete_cartitem/` - Remove cart item
- `GET /product_in_cart` - Check if product is in cart
- `GET /get_cart_stat` - Get cart statistics

### User
- `GET /get_username` - Get current username
- `GET /user_info` - Get user information
- `POST /update_user/` - Update user profile

### Payment & Orders
- `POST /initiate_payment/` - Initiate payment
- `POST /verify_payment/` - Verify payment
- `GET /order_history/` - Get user's order history

### Other
- `GET /api/image-proxy/` - Image proxy endpoint
- `POST /contact/` - Contact form submission

