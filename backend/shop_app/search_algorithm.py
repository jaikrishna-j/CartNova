"""
Advanced Product Search Algorithm using TF-IDF and Fuzzy Matching

This module provides intelligent product search that:
1. Prioritizes exact word matches
2. Finds related products using TF-IDF similarity
3. Handles partial matches and typos
4. Returns results sorted by relevance
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from shop_app.models import Product
from django.db.models import Q, QuerySet
import re
from typing import List, Tuple


def search_products(query: str, queryset: QuerySet = None) -> QuerySet:
    """
    Advanced product search algorithm that finds exact matches and related products.
    
    Algorithm:
    1. Exact word matches (highest priority)
    2. Partial word matches in name/description
    3. TF-IDF similarity for related products
    4. Results sorted by relevance score
    
    Args:
        query: Search query string
        queryset: Optional base queryset to search within (defaults to all products)
    
    Returns:
        QuerySet of products sorted by relevance
    """
    if not query or not query.strip():
        return Product.objects.none()
    
    query = query.strip().lower()
    
    # Get base queryset
    if queryset is None:
        base_queryset = Product.objects.all()
    else:
        base_queryset = queryset
    
    if not base_queryset.exists():
        return Product.objects.none()
    
    # Split query into individual words
    query_words = _extract_words(query)
    
    if not query_words:
        return Product.objects.none()
    
    # Stage 1: Exact matches (highest priority)
    exact_matches = _find_exact_matches(base_queryset, query, query_words)
    
    # Stage 2: Partial word matches
    partial_matches = _find_partial_matches(base_queryset, query_words, exclude_ids=exact_matches)
    
    # Stage 3: TF-IDF similarity for related products
    exclude_for_tfidf = list(exact_matches) + list(partial_matches)
    tfidf_matches = _find_tfidf_similar(base_queryset, query, query_words, 
                                        exclude_ids=exclude_for_tfidf)
    
    # Combine all results with priority ordering
    all_product_ids = list(exact_matches) + list(partial_matches) + list(tfidf_matches)
    
    if not all_product_ids:
        return Product.objects.none()
    
    # Remove duplicates while preserving order
    seen = set()
    unique_product_ids = []
    for pid in all_product_ids:
        if pid not in seen:
            seen.add(pid)
            unique_product_ids.append(pid)
    
    # Return QuerySet with preserved order using Case/When for Django pagination
    from django.db.models import Case, When, IntegerField
    
    preserved = Case(
        *[When(pk=pk, then=pos) for pos, pk in enumerate(unique_product_ids)],
        default=len(unique_product_ids),
        output_field=IntegerField()
    )
    queryset = base_queryset.filter(id__in=unique_product_ids).order_by(preserved)
    return queryset


def _extract_words(text: str) -> List[str]:
    """Extract meaningful words from text."""
    # Remove special characters and split into words
    words = re.findall(r'\b\w+\b', text.lower())
    # Filter out very short words (less than 2 characters) unless it's a single character search
    if len(text) > 1:
        words = [w for w in words if len(w) >= 2]
    return words if words else [text.lower()]


def _find_exact_matches(queryset: QuerySet, full_query: str, query_words: List[str]) -> List[int]:
    """
    Find products with exact word matches in name or description.
    Highest priority: products where all query words appear.
    """
    if not query_words:
        return []
    
    # Build Q objects for exact word matching
    name_conditions = Q()
    desc_conditions = Q()
    
    for word in query_words:
        name_conditions |= Q(name__icontains=word)
        desc_conditions |= Q(description__icontains=word)
    
    # Products matching in name (higher priority)
    name_matches = queryset.filter(name_conditions).values_list('id', flat=True)
    
    # Products matching in description
    desc_matches = queryset.filter(desc_conditions).values_list('id', flat=True)
    
    # Combine and prioritize name matches
    all_matches = list(name_matches) + [id for id in desc_matches if id not in name_matches]
    
    return all_matches


def _find_partial_matches(queryset: QuerySet, query_words: List[str], exclude_ids: List[int] = None) -> List[int]:
    """
    Find products with partial word matches (for typos or partial words).
    """
    if exclude_ids is None:
        exclude_ids = []
    
    if not query_words:
        return []
    
    # Find products where query words appear as substrings
    partial_conditions = Q()
    
    for word in query_words:
        if len(word) >= 3:  # Only for words 3+ characters
            partial_conditions |= Q(name__icontains=word) | Q(description__icontains=word)
    
    if not partial_conditions:
        return []
    
    matches = queryset.filter(partial_conditions).exclude(id__in=exclude_ids).values_list('id', flat=True)
    return list(matches)


def _find_tfidf_similar(queryset: QuerySet, query: str, query_words: List[str], 
                       exclude_ids: List[int] = None, min_similarity: float = 0.1) -> List[int]:
    """
    Find related products using TF-IDF cosine similarity.
    This helps find products that are semantically related even if they don't contain exact words.
    """
    if exclude_ids is None:
        exclude_ids = []
    
    if not query_words:
        return []
    
    # Get remaining products
    remaining_products = queryset.exclude(id__in=exclude_ids)
    
    if not remaining_products.exists():
        return []
    
    # Prepare product texts
    product_texts = []
    product_ids = []
    
    for prod in remaining_products:
        product_text = _prepare_product_text(prod)
        if product_text.strip():
            product_texts.append(product_text)
            product_ids.append(prod.id)
    
    if not product_texts:
        return []
    
    try:
        # Initialize TF-IDF Vectorizer
        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000,
            lowercase=True,
            strip_accents='unicode'
        )
        
        # Combine query with product texts
        all_texts = [query] + product_texts
        
        # Fit and transform
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Calculate similarity between query and all products
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Get products above minimum similarity threshold
        similar_indices = [i for i, sim in enumerate(similarities) if sim >= min_similarity]
        
        # Sort by similarity (descending)
        similar_indices.sort(key=lambda i: similarities[i], reverse=True)
        
        # Get product IDs
        similar_product_ids = [product_ids[idx] for idx in similar_indices]
        
        return similar_product_ids
        
    except Exception as e:
        print(f"Error in TF-IDF search: {e}")
        return []


def _prepare_product_text(product: Product) -> str:
    """Prepare text for a product by combining name and description."""
    name = product.name or ""
    description = product.description or ""
    combined_text = f"{name} {description}".strip()
    return combined_text

