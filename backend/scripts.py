import os
import django
import csv
import sys
import ast
from django.utils.text import slugify

# Set Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'cartnova.settings'
django.setup()

from shop_app.models import Product

# Force stdout and stderr to UTF-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Paths
csv_file_path = 'flipkart_com-ecommerce_sample_edited.csv'
log_file_path = 'import_log.txt'

with open(log_file_path, 'w', encoding='utf-8') as log_file:
    try:
        with open(csv_file_path, 'r', encoding='utf-8', errors='replace') as file:
            reader = csv.DictReader(file)

            for row_number, row in enumerate(reader, start=1):
                try:
                    # Read and clean fields
                    product_name = row.get('product_name', '').strip()
                    slug = slugify(product_name)  # unique identifier
                    description = row.get('description', '')
                    category = row.get('mapped_category', '')
                    price = row.get('retail_price', 0)

                    # Safely parse image list
                    images_list = ast.literal_eval(row.get('image', '[]'))
                    product_image = images_list[0] if images_list else ''

                    # Print to console
                    print(f"{row_number} | {product_name} | {slug} | {category} | {price}")

                    # Write to log file
                    log_file.write(f"{row_number} | {product_name} | {slug} | {category} | {price}\n")

                    # Create or update product safely
                    Product.objects.update_or_create(
                        slug=slug,
                        defaults={
                            'name': product_name,
                            'image': product_image,
                            'description': description,
                            'category': category,
                            'price': price
                        }
                    )

                except Exception as e_row:
                    error_msg = f"Error processing row {row_number}: {row}. Error: {e_row}\n"
                    print(error_msg)
                    log_file.write(error_msg)

        print("\nProduct import finished! See 'import_log.txt' for details.")

    except FileNotFoundError:
        msg = f"CSV file not found: {csv_file_path}\n"
        print(msg)
        log_file.write(msg)
    except Exception as e_file:
        msg = f"Error opening CSV file: {e_file}\n"
        print(msg)
        log_file.write(msg)
