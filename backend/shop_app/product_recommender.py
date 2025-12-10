"""
Product Recommendation System using TF-IDF Vectorizer and Cosine Similarity

This module provides product recommendations based on semantic similarity
between product titles and descriptions using Natural Language Processing (NLP).
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from shop_app.models import Product
import numpy as np


def get_similar_products(product, n_recommendations=4):
    """
    Get similar products based on TF-IDF vectorization and cosine similarity.
    
    This function analyzes product titles and descriptions to find semantically
    similar products. For example, if a product is "phone", it will recommend
    related items like "phone case", "phone tempered glass", "related phones", etc.
    
    Args:
        product (Product): The product instance for which to find similar products
        n_recommendations (int): Number of similar products to return (default: 4)
    
    Returns:
        list: List of similar Product instances, limited to n_recommendations
    """
    # Get all products except the current one
    all_products = Product.objects.exclude(id=product.id)
    
    # If there are no other products, return empty list
    if not all_products.exists():
        return []
    
    # Prepare text data: combine name and description for each product
    product_texts = []
    product_ids = []
    
    # Add the current product's text for comparison
    current_product_text = _prepare_product_text(product)
    
    # Prepare texts for all other products
    for prod in all_products:
        product_text = _prepare_product_text(prod)
        if product_text.strip():  # Only add if text is not empty
            product_texts.append(product_text)
            product_ids.append(prod.id)
    
    # If no valid product texts found, return empty list
    if not product_texts:
        return []
    
    # Initialize TF-IDF Vectorizer with English language settings
    # Using default English stop words and n-gram range (1,2) for better matching
    vectorizer = TfidfVectorizer(
        stop_words='english',  # Remove common English stop words
        ngram_range=(1, 2),    # Use unigrams and bigrams for better context
        max_features=5000,      # Limit features for efficiency
        lowercase=True,        # Convert to lowercase
        strip_accents='unicode'  # Remove accents
    )
    
    # Combine current product text with all other product texts
    all_texts = [current_product_text] + product_texts
    
    try:
        # Fit and transform the texts to TF-IDF vectors
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Calculate cosine similarity between the first vector (current product) 
        # and all other vectors
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Get indices of top N most similar products
        # Use argsort to get indices sorted by similarity (descending)
        top_indices = np.argsort(cosine_similarities)[::-1][:n_recommendations]
        
        # Get product IDs for the top similar products
        similar_product_ids = [product_ids[idx] for idx in top_indices]
        
        # Return QuerySet of similar products in the order of similarity
        # Use a custom ordering to preserve the similarity order
        similar_products = Product.objects.filter(id__in=similar_product_ids)
        
        # Create a mapping to preserve order
        id_to_product = {prod.id: prod for prod in similar_products}
        
        # Return products in similarity order
        ordered_products = [id_to_product[pid] for pid in similar_product_ids if pid in id_to_product]
        
        # If we have fewer products than requested, return what we have
        return ordered_products[:n_recommendations]
        
    except Exception as e:
        # If there's an error (e.g., all texts are empty after preprocessing),
        # fall back to returning empty list
        print(f"Error in get_similar_products: {e}")
        return []


def _prepare_product_text(product):
    """
    Prepare text for a product by combining name and description.
    
    Args:
        product (Product): Product instance
    
    Returns:
        str: Combined text from name and description
    """
    name = product.name or ""
    description = product.description or ""
    
    # Combine name and description with a space
    # This ensures both title and description keywords are considered
    combined_text = f"{name} {description}".strip()
    
    return combined_text

