from django.urls import path
from . import views
from . import image_proxy

urlpatterns = [
    path("products/", views.product_list, name="product_list"), 
    path("categories/", views.category_list, name="category_list"),
    path("product_detail/<slug:slug>/", views.product_detail, name="product_detail"),
    path("add_item/", views.add_item, name="add_item"),
    path("product_in_cart", views.product_in_cart, name="product_in_cart"),
    path("get_cart_stat", views.get_cart_stat , name="get_cart_stat"),
    path("get_cart", views.get_cart, name="get_cart"),
    path("update_quantity/", views.update_quantity, name="update_quantity"),
    path("delete_cartitem/", views.delete_cartitem, name="delete_cartitem"),
    path("get_username", views.get_username, name="get_username"),
    path("user_info", views.user_info, name="user_info"),
    path("update_user/", views.update_user, name="update_user"),
    path("initiate_payment/", views.initiate_payment, name="initiate_payment"),
    path("verify_payment/", views.verify_payment, name="verify_payment"),
    path("order_history/", views.order_history, name="order_history"),
    path("api/image-proxy/", image_proxy.image_proxy, name="image_proxy"),
    path("contact/", views.contact_us, name="contact_us"),
]
