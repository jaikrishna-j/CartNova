"""
Product Recommendation System using TF-IDF Vectorizer and Cosine Similarity

This module provides product recommendations based on semantic similarity
between product titles and descriptions.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from shop_app.models import Product
import numpy as np


def get_similar_products(product, n_recommendations=4):
    """Return similar products based on TF-IDF vectorization and cosine similarity."""

    all_products = Product.objects.exclude(id=product.id)
    if not all_products.exists():
        return []

    current_product_text = _prepare_product_text(product)

    product_texts = []
    product_ids = []
    for prod in all_products:
        product_text = _prepare_product_text(prod)
        if product_text.strip():
            product_texts.append(product_text)
            product_ids.append(prod.id)

    if not product_texts:
        return []

    vectorizer = TfidfVectorizer(
        stop_words='english',
        ngram_range=(1, 2),
        max_features=5000,
        lowercase=True,
        strip_accents='unicode',
    )

    all_texts = [current_product_text] + product_texts

    try:
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        top_indices = np.argsort(cosine_similarities)[::-1][:n_recommendations]

        similar_product_ids = [product_ids[idx] for idx in top_indices]
        similar_products = Product.objects.filter(id__in=similar_product_ids)
        id_to_product = {prod.id: prod for prod in similar_products}

        ordered_products = [id_to_product[pid] for pid in similar_product_ids if pid in id_to_product]
        return ordered_products[:n_recommendations]

    except Exception as e:
        print(f"Error in get_similar_products: {e}")
        return []


def _prepare_product_text(product):
    """Prepare text for a product by combining name and description."""
    name = product.name or ""
    description = product.description or ""
    return f"{name} {description}".strip()

