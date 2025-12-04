from django.db import models
from django.utils.text import slugify
from django.conf import settings

class Product(models.Model):

    PRODUCT_CATEGORY_CHOICES = (
        ("Electronics", "ELECTRONICS"),
        ("Beauty", "BEAUTY"),
        ("Sports", "SPORTS"),
        ("Books", "BOOKS"),
        ("Toys", "TOYS"),
        ("Furniture", "FURNITURE"),
        ("Appliances", "APPLIANCES"),
        ("Footwear", "FOOTWEAR"),
        ("Accessories", "ACCESSORIES"),
        ("Kitchen", "KITCHEN"),
        ("Watches", "WATCHES"),
        ("Jewellery", "JEWELLERY"),
        ("Stationery", "STATIONERY"),
        ("Groceries", "GROCERIES"),
        ("Clothing", "CLOTHING"),
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, blank=True, null=True, unique=True)
    image = models.TextField(blank=True, null=True)  
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=70, choices=PRODUCT_CATEGORY_CHOICES, blank=True, null=True)

    class Meta:
        """
        Defines default model options.
        Ordering is added to prevent UnorderedObjectListWarning ERROR during pagination.
        """
        ordering = ['name']

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            unique_slug = base_slug
            counter = 1
            while Product.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
                unique_slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = unique_slug

        super().save(*args, **kwargs)


class Cart(models.Model):
    cart_code = models.CharField(max_length=11, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.cart_code
    

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in cart {self.cart.id}"
    
class Transaction(models.Model):
    ref = models.CharField(max_length=255, unique=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=20, default='INR')
    status = models.CharField(max_length=20, default='pending')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transaction {self.ref} - {self.status}"