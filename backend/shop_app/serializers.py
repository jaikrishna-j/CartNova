from rest_framework import serializers
from shop_app.models import Product, Cart, CartItem
from django.contrib.auth import get_user_model
from shop_app.product_recommender import get_similar_products

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "slug", "image", "description", "category", "price"]



class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ["id", "name", "price", "slug", "image", "description", "similar_products"]

    def get_similar_products(self, product):
        # Use TF-IDF and cosine similarity for recommendations based on title and description
        similar_products = get_similar_products(product, n_recommendations=4)
        serializer = ProductSerializer(similar_products, many=True)
        return serializer.data


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ["id", "quantity", "product", "total"]

    def get_total(self, cartitem):
        price = cartitem.product.price * cartitem.quantity
        return price


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ["id", "cart_code", "items", "sum_total", "num_of_items",  "created_at", "modified_at"]

    def get_sum_total(self, cart):
        items = cart.items.all()
        total = sum([item.product.price * item.quantity for item in items])
        return total
    
    def get_num_of_items(self, cart):
        items = cart.items.all()
        total = sum([item.quantity for item in items])
        return total

class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ["id", "cart_code", "num_of_items"]

    def get_num_of_items(self,cart):
        num_of_items = sum([item.quantity for item in cart.items.all()])
        return num_of_items


# --- NEW SERIALIZER FOR ORDER HISTORY ---
class NewCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    order_id = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField() # Corrected from order_data
    class Meta:
        model = CartItem
        fields = ["id" , "product" , "quantity" , "order_id" , "order_date"]
        
    def get_order_id(self, cartitem):
        order_id = cartitem.cart.cart_code
        return order_id
        
    def get_order_date(self, cartitem):
        # Use modified_at from the cart, as that's when payment was completed
        order_date = cartitem.cart.modified_at 
        return order_date

# --- UPDATED USER SERIALIZER ---
class UserSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "first_name", "last_name", "email", "city", "state", "address", "phone", "profile_image", "items"]

    def get_items(self, user):
        # Fetches the 10 most recent *items* from *paid* carts
        cartitems = CartItem.objects.filter(cart__user = user, cart__paid = True).order_by('-cart__modified_at')[:10]
        serializer = NewCartItemSerializer(cartitems, many=True)
        return serializer.data