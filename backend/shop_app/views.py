# shop_app/views.py

from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import PermissionDenied
from django.db import transaction  # Import transaction
from django.core.mail import send_mail, EmailMessage, get_connection
from django.template.loader import render_to_string

from shop_app.serializers import (
    ProductSerializer, DetailedProductSerializer, CartItemSerializer,
    SimpleCartSerializer, CartSerializer, UserSerializer, NewCartItemSerializer
)
from shop_app.models import Product, Cart, CartItem, Transaction
from shop_app.search_algorithm import search_products
from decimal import Decimal
import uuid
import requests
import razorpay
import base64
import traceback

BASE_URL = "http://localhost:5173"


# --- Initialize Razorpay client ---
razorpay_client = None
try:
    print("Attempting to initialize Razorpay client...")
    key_id = settings.RAZORPAY_KEY_ID
    key_secret = settings.RAZORPAY_KEY_SECRET
    if not key_id or not key_secret:
        print("ERROR: Razorpay Key ID or Secret Key is missing in settings.py")
    else:
        razorpay_client = razorpay.Client(auth=(key_id, key_secret))
        print("Razorpay client initialized successfully.")
except AttributeError as e:
     print(f"ERROR: Razorpay keys not found in settings.py. Details: {e}")
except Exception as e:
    print(f"CRITICAL ERROR initializing Razorpay client: {e}")
    traceback.print_exc()
# --- End Razorpay Initialization ---


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(["GET"])
def category_list(request):
    """
    Returns a unique list of categories.
    """
    categories = list(Product.PRODUCT_CATEGORY_CHOICES)
    data = [{"value": k.lower(), "label": v} for k, v in categories]
    return Response(data)

@api_view(["GET"])
def product_list(request):
    """
    Returns paginated/filtered product list with advanced search algorithm.
    Uses TF-IDF and fuzzy matching for better search results.
    """
    queryset = Product.objects.all()
    query = request.query_params.get('q', None)
    category = request.query_params.get('category', None)

    # Apply category filter first (if no search query)
    if category and category.lower() != 'all' and not query:
        queryset = queryset.filter(category__iexact=category)
    
    # Apply advanced search algorithm if query exists
    if query and query.strip():
        # Use advanced search algorithm that finds exact matches and related products
        queryset = search_products(query.strip(), queryset)
        # Note: When searching, category is ignored (handled in frontend)
    elif category and category.lower() != 'all':
        # Only apply category filter when there's no search query
        queryset = queryset.filter(category__iexact=category)

    paginator = CustomPageNumberPagination()
    page = paginator.paginate_queryset(queryset, request)

    if page is not None:
        serializer = ProductSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = ProductSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def product_detail(request, slug):
    """
    Returns product details.
    """
    try:
        product = Product.objects.get(slug=slug)
        serializer = DetailedProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def add_item(request):
    """
    Adds item to cart.
    """
    try:
        cart_code = request.data.get("cart_code")
        product_id = request.data.get("product_id")

        if not cart_code or not product_id:
             return Response({"error": "Cart code or Product ID missing."}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(cart_code=cart_code)
        product = Product.objects.get(id=product_id)
        cartitem, created = CartItem.objects.get_or_create(cart=cart, product=product)

        cartitem.quantity = 1 # Always set quantity to 1 on add
        cartitem.save()

        serializer = CartItemSerializer(cartitem)
        return Response(
            {"data": serializer.data, "message": "Item added/updated in cart"},
            status=status.HTTP_201_CREATED
        )
    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in add_item: {e}")
        traceback.print_exc()
        return Response({"error": "Failed to add item to cart."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def product_in_cart(request):
    """
    Checks if product is in cart.
    """
    cart_code = request.query_params.get("cart_code")
    product_id = request.query_params.get("product_id")

    if not cart_code or not product_id:
         return Response({"error": "Cart code or Product ID missing."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.get(cart_code=cart_code)
        product = Product.objects.get(id=product_id)
        exists = CartItem.objects.filter(cart=cart, product=product).exists()
        return Response({'product_in_cart': exists})
    except (Cart.DoesNotExist, Product.DoesNotExist):
        return Response({'product_in_cart': False}) # Not found means not in cart
    except Exception as e:
        print(f"Error in product_in_cart check: {e}")
        return Response({'error': 'Could not check cart status.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_cart_stat(request):
    """
    Gets basic cart stats (number of items).
    """
    cart_code = request.query_params.get("cart_code")
    if not cart_code:
        return Response({"num_of_items": 0})

    try:
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
        serializer = SimpleCartSerializer(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({"num_of_items": 0})
    except Exception as e:
        print(f"Error in get_cart_stat: {e}")
        return Response({"error": "Could not get cart status."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_cart(request):
    """
    Gets full cart details.
    """
    cart_code = request.query_params.get("cart_code")
    empty_cart_response = {"items": [], "sum_total": 0, "num_of_items": 0}
    if not cart_code:
        return Response(empty_cart_response)

    try:
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response(empty_cart_response)
    except Exception as e:
        print(f"Error in get_cart: {e}")
        return Response({"error": "Could not get cart details."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
def update_quantity(request):
    """
    Updates item quantity in cart or deletes if quantity <= 0.
    """
    try:
        cartitem_id = request.data.get("item_id")
        quantity_str = request.data.get("quantity")

        if cartitem_id is None or quantity_str is None:
            return Response({'error': 'Item ID or quantity missing.'}, status=status.HTTP_400_BAD_REQUEST)

        quantity = int(quantity_str)

        if quantity <= 0:
            try:
                cartitem = CartItem.objects.get(id=cartitem_id)
                item_id = cartitem.id
                cartitem.delete()
                print(f"Deleted item {item_id} due to zero quantity.")
                return Response({"message": "Item removed"}, status=status.HTTP_204_NO_CONTENT)
            except CartItem.DoesNotExist:
                return Response({'message': 'Item already removed'}, status=status.HTTP_404_NOT_FOUND)
        else:
            cartitem = CartItem.objects.get(id=cartitem_id)
            cartitem.quantity = quantity
            cartitem.save()
            serializer = CartItemSerializer(cartitem)
            return Response({"data": serializer.data, "message": "Quantity updated"})

    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid quantity provided.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error in update_quantity: {e}")
        traceback.print_exc()
        return Response({'error': 'Failed to update quantity.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def delete_cartitem(request):
    """
    Deletes item from cart.
    """
    cartitem_id = request.data.get("item_id")
    if not cartitem_id:
        return Response({"error": "Item ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cartitem = CartItem.objects.get(id=cartitem_id)
        item_id = cartitem.id
        cartitem.delete()
        print(f"Deleted cart item {item_id}")
        return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except CartItem.DoesNotExist:
        return Response({"message": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in delete_cartitem: {e}")
        traceback.print_exc()
        return Response({"message": "Failed to delete item"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    """
    Gets logged-in user's username.
    """
    return Response({"username": request.user.username})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    """
    Gets logged-in user's info.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    """
    Updates logged-in user's info.
    """
    user = request.user
    data = request.data.copy()
    
    # Handle profile image removal
    if request.data.get('remove_profile_image') == 'true':
        # Delete the existing profile image if it exists
        if user.profile_image:
            user.profile_image.delete(save=False)
        data['profile_image'] = None
    
    # Handle file upload separately if present
    elif 'profile_image' in request.FILES:
        data['profile_image'] = request.FILES['profile_image']
    
    serializer = UserSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- PayPal: Function to get Access Token ---
def get_paypal_access_token():
    """ Fetches PayPal OAuth2 token """
    url = f"{settings.PAYPAL_API_BASE_URL}/v1/oauth2/token"
    auth_str = f"{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}"
    auth = base64.b64encode(auth_str.encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    try:
        response = requests.post(url, headers=headers, data=data, timeout=10)
        response.raise_for_status()
        return response.json()["access_token"]
    except requests.exceptions.RequestException as e:
        print(f"Error getting PayPal token: {e}")
        raise ConnectionError("Could not connect to PayPal.") from e


# --- Combined Payment Initiation View ---
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@csrf_exempt
def initiate_payment(request):
    print("\n--- Initiating Payment ---")
    if not request.user.is_authenticated:
        print("User not authenticated.")
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    cart_code = request.data.get("cart_code")
    gateway = request.data.get("gateway")
    print(f"User: {request.user.username}, Cart Code: {cart_code}, Gateway: {gateway}")

    if not cart_code or not gateway:
        print("Missing cart_code or gateway.")
        return Response({'error': 'Cart code or gateway identifier missing.'}, status=status.HTTP_400_BAD_REQUEST)

    # --- Cart Fetching ---
    cart = None
    try:
        print(f"Fetching cart {cart_code} for user {request.user.id}...")
        cart = Cart.objects.get(cart_code=cart_code, user=request.user, paid=False)
        print("Found cart belonging to user.")
    except Cart.DoesNotExist:
        try:
            print(f"Cart not found for user. Trying anonymous cart {cart_code}...")
            cart = Cart.objects.get(cart_code=cart_code, user=None, paid=False)
            print("Found anonymous cart. Associating with user.")
            cart.user = request.user
            cart.save()
        except Cart.DoesNotExist:
            print(f"Cart {cart_code} not found or already paid.")
            return Response({'error': 'Cart not found, already paid, or invalid.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
         print(f"Unexpected error fetching cart: {e}")
         traceback.print_exc()
         return Response({'error': 'Error retrieving cart.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if not cart:
         print("Cart object could not be determined.")
         return Response({'error': 'Cart could not be processed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if not cart.items.exists():
         print(f"Cart {cart_code} is empty.")
         return Response({'error': 'Cannot process payment for an empty cart.'}, status=status.HTTP_400_BAD_REQUEST)

    # --- Payment Processing ---
    try:
        print("Calculating cart total...")
        amount_decimal = sum([item.quantity * item.product.price for item in cart.items.all()])
        tax = Decimal("4.00")
        total_amount_decimal = amount_decimal + tax
        print(f"Subtotal: {amount_decimal}, Tax: {tax}, Total: {total_amount_decimal}")

        # --- Razorpay Logic ---
        if gateway == 'razorpay':
            print("Processing Razorpay...")
            if not razorpay_client:
                print("ERROR: Razorpay client is None.")
                return Response({'error': 'Payment provider (Razorpay) configuration error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            currency = "INR"
            amount_in_paisa = int(total_amount_decimal * 100)
            if amount_in_paisa <= 0:
                 print(f"ERROR: Calculated Razorpay amount <= 0 ({amount_in_paisa} paisa).")
                 return Response({'error': 'Invalid order total amount.'}, status=status.HTTP_400_BAD_REQUEST)

            receipt_id = f"receipt_{cart.cart_code}_{uuid.uuid4().hex[:6]}"
            razorpay_order_data = {
                "amount": amount_in_paisa,
                "currency": currency,
                "receipt": receipt_id,
                "payment_capture": '1'
            }
            print(f"Creating Razorpay order with data: {razorpay_order_data}")

            try:
                razorpay_order = razorpay_client.order.create(data=razorpay_order_data)
                print(f"Razorpay order created: {razorpay_order['id']}")
            except razorpay.errors.BadRequestError as rzp_err:
                 print(f"ERROR from Razorpay API (Bad Request): {rzp_err}")
                 error_msg = str(rzp_err)
                 try:
                     error_data = rzp_err.args[0]
                     if isinstance(error_data, dict) and 'description' in error_data:
                         error_msg = error_data['description']
                 except:
                     pass
                 return Response({'error': f'Payment provider error: {error_msg}'}, status=status.HTTP_400_BAD_REQUEST)
            except razorpay.errors.ServerError as rzp_err:
                 print(f"ERROR from Razorpay API (Server Error): {rzp_err}")
                 return Response({'error': 'Payment provider server error.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            except Exception as rzp_err:
                 print(f"UNEXPECTED ERROR during Razorpay order creation: {rzp_err}")
                 traceback.print_exc()
                 return Response({'error': 'Failed to initiate payment with provider.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print("Updating/Creating transaction record...")
            transaction_obj, created = Transaction.objects.update_or_create(
                ref=razorpay_order['id'],
                defaults={
                    'cart': cart,
                    'amount': total_amount_decimal,
                    'currency': currency,
                    'user': request.user,
                    'status': 'created'
                }
            )
            print(f"Transaction {transaction_obj.ref} {'created' if created else 'updated'}.")

            response_data = {
                'gateway': 'razorpay',
                'order_id': razorpay_order['id'],
                'amount': amount_in_paisa,
                'currency': currency,
                'key': settings.RAZORPAY_KEY_ID
            }
            return Response(response_data, status=status.HTTP_200_OK)

        # --- PayPal Logic ---
        elif gateway == 'paypal':
            print("Processing PayPal...")
            currency = "USD"
            try:
                access_token = get_paypal_access_token()
            except ConnectionError as token_err:
                print(f"ERROR getting PayPal token: {token_err}")
                return Response({'error': 'Could not connect to PayPal.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            except Exception as token_err:
                print(f"UNEXPECTED ERROR getting PayPal token: {token_err}")
                traceback.print_exc()
                return Response({'error': 'Could not connect to PayPal.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            url = f"{settings.PAYPAL_API_BASE_URL}/v2/checkout/orders"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            conversion_rate = Decimal("83.0")
            total_amount_usd = (total_amount_decimal / conversion_rate).quantize(Decimal("0.01"))
            total_amount_str_for_paypal = f"{total_amount_usd:.2f}"
            print(f"Converted INR {total_amount_decimal} to USD {total_amount_str_for_paypal}")

            if total_amount_usd <= Decimal("0"):
                print("ERROR: Calculated PayPal amount <= 0")
                return Response({'error': 'Invalid order total for PayPal.'}, status=status.HTTP_400_BAD_REQUEST)

            payload = {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "amount": {
                        "currency_code": currency,
                        "value": total_amount_str_for_paypal
                    },
                    "reference_id": cart.cart_code
                }]
            }
            print(f"Creating PayPal order with payload: {payload}")

            try:
                response = requests.post(url, headers=headers, json=payload, timeout=15)
                response.raise_for_status()
                paypal_order = response.json()
                print(f"PayPal order created: {paypal_order['id']}")
            except requests.exceptions.HTTPError as paypal_err:
                 print(f"ERROR from PayPal API (HTTP {paypal_err.response.status_code}): {paypal_err.response.text}")
                 error_detail = "Could not create PayPal order."
                 try:
                     error_data = paypal_err.response.json()
                     error_detail = error_data.get('message', error_detail)
                     if 'details' in error_data and isinstance(error_data['details'], list):
                         error_detail += " " + " ".join([d.get('description', '') for d in error_data['details']])
                 except:
                     pass
                 return Response({'error': f'PayPal Error: {error_detail.strip()}'}, status=paypal_err.response.status_code)
            except requests.exceptions.RequestException as paypal_err:
                 print(f"ERROR connecting to PayPal API: {paypal_err}")
                 return Response({'error': 'Could not connect to PayPal.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            except Exception as paypal_err:
                 print(f"UNEXPECTED ERROR during PayPal order creation: {paypal_err}")
                 traceback.print_exc()
                 return Response({'error': 'Failed to create PayPal order.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print("Updating/Creating transaction record...")
            transaction_obj, created = Transaction.objects.update_or_create(
                ref=paypal_order['id'],
                defaults={
                    'cart': cart,
                    'amount': total_amount_decimal,
                    'currency': "INR",
                    'user': request.user,
                    'status': 'created'
                }
            )
            print(f"Transaction {transaction_obj.ref} {'created' if created else 'updated'}.")
            
            # Extract approval URL from PayPal order links
            approval_url = None
            if 'links' in paypal_order:
                for link in paypal_order['links']:
                    if link.get('rel') == 'approve':
                        approval_url = link.get('href')
                        break
            
            response_data = {
                'gateway': 'paypal', 
                'order_id': paypal_order['id'],
                'approval_url': approval_url
            }
            return Response(response_data, status=status.HTTP_200_OK)

        else:
            print(f"Invalid gateway specified: {gateway}")
            return Response({'error': 'Invalid payment gateway specified.'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"!!! UNEXPECTED Payment Error ({gateway}): {e}")
        traceback.print_exc()
        return Response({'error': 'Payment init server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- Combined Payment Verification View ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def verify_payment(request):
    """ Verifies payment after callback from gateway """
    payment_data = request.data
    gateway = payment_data.get('gateway')
    user = request.user
    print(f"\n--- Verifying Payment ---")
    print(f"User: {user.username}, Gateway: {gateway}, Data: {payment_data}")

    if not gateway:
        print("Missing gateway.")
        return Response({"error": "Gateway missing."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if gateway == 'razorpay':
            print("Verifying Razorpay...")
            razorpay_order_id = payment_data.get('razorpay_order_id')
            razorpay_payment_id = payment_data.get('razorpay_payment_id')
            razorpay_signature = payment_data.get('razorpay_signature')

            if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
                print("Missing Razorpay data.")
                return Response({"error": "Missing Razorpay data."}, status=status.HTTP_400_BAD_REQUEST)

            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            if not razorpay_client:
                print("ERROR: RZP client None for verification.")
                return Response({"error": "RZP config error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                print("Calling verify_payment_signature...")
                razorpay_client.utility.verify_payment_signature(params_dict)
                print("Signature OK.")
            except razorpay.errors.SignatureVerificationError as sig_err:
                 print(f"RZP Sig Verify FAILED: {sig_err}")
                 return Response({"error": "Invalid signature."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as rzp_err:
                 print(f"ERROR during RZP sig verify: {rzp_err}")
                 traceback.print_exc()
                 return Response({"error": "Failed sig verify."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                with transaction.atomic():
                    print(f"Looking for RZP txn ref={razorpay_order_id} user={user.id}")
                    transaction_obj = Transaction.objects.select_for_update().get(ref=razorpay_order_id, user=user)

                    if transaction_obj.status == 'success':
                        print("Already success.")
                        return Response({"status": "success", "message": "Already verified."}, status=status.HTTP_200_OK)

                    print("Updating RZP txn status...")
                    transaction_obj.status = 'success'
                    transaction_obj.save()

                    cart = transaction_obj.cart
                    if cart.user != user:
                        print(f"PERM DENIED: Cart {cart.cart_code}")
                        raise PermissionDenied("Cart owner mismatch.")

                    print(f"Marking cart {cart.cart_code} paid...")
                    cart.paid = True
                    cart.save()
                    print("RZP OK.")
                return Response({"status": "success", "message": "Payment verified."}, status=status.HTTP_200_OK)

            except Transaction.DoesNotExist:
                 print(f"RZP Txn not found")
                 return Response({"error": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)
            except PermissionDenied as pd_err:
                 return Response({"error": str(pd_err)}, status=status.HTTP_403_FORBIDDEN)
            except Exception as db_err:
                 print(f"Error updating DB (RZP): {db_err}")
                 traceback.print_exc()
                 return Response({"error": "Failed DB update."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif gateway == 'paypal':
            print("Verifying PayPal...")
            paypal_order_id = payment_data.get('paypal_order_id')
            if not paypal_order_id:
                print("Missing PayPal ID.")
                return Response({"error": "Missing PayPal ID."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                access_token = get_paypal_access_token()
            except ConnectionError as token_err:
                 print(f"ERROR getting PayPal token: {token_err}")
                 return Response({'error': 'PayPal connection error.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            except Exception as token_err:
                 print(f"UNEXPECTED ERROR getting PayPal token: {token_err}")
                 traceback.print_exc()
                 return Response({'error': 'PayPal connection error.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            url = f"{settings.PAYPAL_API_BASE_URL}/v2/checkout/orders/{paypal_order_id}/capture"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            print(f"Capturing PayPal order: {paypal_order_id}")

            try:
                response = requests.post(url, headers=headers, timeout=15)
                response.raise_for_status()
                capture_data = response.json()
                print(f"PayPal capture status: {capture_data.get('status')}")
            except requests.exceptions.HTTPError as paypal_err:
                 print(f"ERROR capturing PayPal (HTTP {paypal_err.response.status_code}): {paypal_err.response.text}")
                 error_detail = "Failed capture."
                 try:
                     error_detail = paypal_err.response.json().get('message', error_detail)
                 except:
                     pass
                 return Response({'error': f'PayPal Error: {error_detail}'}, status=paypal_err.response.status_code)
            except requests.exceptions.RequestException as paypal_err:
                 print(f"ERROR connecting PayPal capture: {paypal_err}")
                 return Response({'error': 'PayPal connection error.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            except Exception as paypal_err:
                 print(f"UNEXPECTED ERROR PayPal capture: {paypal_err}")
                 traceback.print_exc()
                 return Response({'error': 'Failed capture.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if capture_data.get('status') == 'COMPLETED':
                try:
                    with transaction.atomic():
                        print(f"Looking for PayPal txn ref={paypal_order_id} user={user.id}")
                        transaction_obj = Transaction.objects.select_for_update().get(ref=paypal_order_id, user=user)

                        if transaction_obj.status == 'success':
                            print("Already success.")
                            return Response({"status": "success", "message": "Already verified."}, status=status.HTTP_200_OK)

                        print("Updating PayPal txn status...")
                        transaction_obj.status = 'success'
                        transaction_obj.save()

                        cart = transaction_obj.cart
                        if cart.user != user:
                            print(f"PERM DENIED: Cart {cart.cart_code}")
                            raise PermissionDenied("Cart owner mismatch.")

                        print(f"Marking cart {cart.cart_code} paid...")
                        cart.paid = True
                        cart.save()
                        print("PayPal OK.")
                    return Response({"status": "success", "message": "Payment verified."}, status=status.HTTP_200_OK)
                except Transaction.DoesNotExist:
                     print(f"PayPal Txn not found")
                     return Response({"error": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)
                except PermissionDenied as pd_err:
                     return Response({"error": str(pd_err)}, status=status.HTTP_403_FORBIDDEN)
                except Exception as db_err:
                     print(f"Error updating DB (PayPal): {db_err}")
                     traceback.print_exc()
                     return Response({"error": "Failed DB update."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                 print(f"PayPal status not COMPLETED")
                 return Response({"error": "PayPal capture not completed."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(f"Invalid gateway: {gateway}")
            return Response({'error': 'Invalid gateway.'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"!!! UNEXPECTED ERROR verify_payment ({gateway}): {e}")
        traceback.print_exc()
        return Response({"error": "Unexpected verification error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- Order History View ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    """
    Fetches paid cart items for the user
    """
    try:
        paid_cart_items = CartItem.objects.filter(
            cart__user=request.user,
            cart__paid=True
        ).order_by('-cart__modified_at').select_related('product', 'cart')

        serializer = NewCartItemSerializer(paid_cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error fetching order history for user {request.user.id}: {e}")
        traceback.print_exc()
        return Response({"error": "Could not retrieve order history."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@csrf_exempt
def contact_us(request):
    """
    Handle contact form submissions and send emails.
    Sends email to admin and auto-response to user.
    """
    try:
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()

        # Validation
        if not all([name, email, subject, message]):
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Admin email (your email)
        admin_email = "jaikrishnajaisankar2005@gmail.com"
        
        # Email to admin - Contact form submission
        admin_subject = f"Contact Form: {subject}"
        admin_message = f"""
New contact form submission from CartNova:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This email was sent from the CartNova contact form.
        """.strip()

        try:
            # Verify email settings are configured
            if not settings.EMAIL_HOST_PASSWORD:
                return Response(
                    {"error": "Email service is not configured. Please contact the administrator."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Get email connection with explicit authentication
            connection = get_connection(
                host=settings.EMAIL_HOST,
                port=settings.EMAIL_PORT,
                username=settings.EMAIL_HOST_USER,
                password=settings.EMAIL_HOST_PASSWORD,
                use_tls=settings.EMAIL_USE_TLS,
            )

            # Send email to admin
            send_mail(
                subject=admin_subject,
                message=admin_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin_email],
                connection=connection,
                fail_silently=False,
            )

            # Auto-response email to user
            user_subject = "Thank you for contacting CartNova"
            user_message = f"""
Dear {name},

Thank you for reaching out to CartNova!

We have received your message regarding "{subject}" and appreciate you taking the time to contact us.

Our team will review your inquiry and get back to you within 24 hours.

If you have any urgent concerns, please feel free to contact us directly at {admin_email}.

Best regards,
The CartNova Team

---
This is an automated response. Please do not reply to this email.
            """.strip()

            # Send auto-response to user
            send_mail(
                subject=user_subject,
                message=user_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                connection=connection,
                fail_silently=False,
            )

            return Response(
                {"message": "Your message has been sent successfully. We will get back to you within 24 hours."},
                status=status.HTTP_200_OK
            )

        except Exception as email_error:
            print(f"Error sending email: {email_error}")
            traceback.print_exc()
            return Response(
                {"error": "Failed to send email. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        print(f"Error in contact_us view: {e}")
        traceback.print_exc()
        return Response(
            {"error": "An error occurred. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )