from django.contrib import admin
from .models import Product, Cart, CartItem, Transaction


class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price")
    search_fields = ("name", "category")
    list_filter = ("category",)
    prepopulated_fields = {"slug": ("name",)}

class TransactionAdmin(admin.ModelAdmin):
    # --- 2. ADD THE NEW METHOD to the list display ---
    list_display = ('user', 'ref', 'get_products', 'status', 'amount', 'currency', 'created_at')
    list_filter = ('status', 'user', 'currency')
    search_fields = ('ref', 'user__username', 'cart__cart_code')
    ordering = ('-created_at',)
    list_per_page = 25

    # --- 1. CREATE THE METHOD to get product names ---
    def get_products(self, obj):
        """
        Retrieves the related Cart for the Transaction (obj),
        then gets all CartItems in that cart, and returns
        a comma-separated string of the product names.
        """
        if obj.cart:
            # This joins the names of all products in the cart
            return ", ".join([item.product.name for item in obj.cart.items.all()])
        return "No associated cart"
    
    # This sets the column header name in the admin panel
    get_products.short_description = 'Products in Cart'

class CartAdmin(admin.ModelAdmin):
    list_display = ('cart_code', 'user', 'paid', 'created_at', 'modified_at')
    list_filter = ('paid', 'user')
    search_fields = ('cart_code', 'user__username')
    ordering = ('-modified_at',)
    list_per_page = 25

class CartItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'get_cart_user', 'get_cart_code')
    list_filter = ('cart__user',)
    search_fields = ('product__name', 'cart__user__username', 'cart__cart_code')
    ordering = ('cart__user', 'cart')
    list_per_page = 25

    def get_cart_code(self, obj):
        return obj.cart.cart_code
    get_cart_code.short_description = 'Cart Code' # Column header name

    def get_cart_user(self, obj):
        if obj.cart.user:
            return obj.cart.user.username
        return 'Anonymous' # Show 'Anonymous' if cart has no user
    get_cart_user.short_description = 'User' # Column header name

admin.site.register(Product, ProductAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(CartItem, CartItemAdmin)