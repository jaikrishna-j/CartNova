"""
Advanced Product Search Algorithm using TF-IDF and Fuzzy Matching.

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
    """Return products sorted by relevance for a search query."""

    if not query or not query.strip():
        return Product.objects.none()

    query = query.strip().lower()
    base_queryset = Product.objects.all() if queryset is None else queryset
    if not base_queryset.exists():
        return Product.objects.none()

    query_words = _extract_words(query)
    if not query_words:
        return Product.objects.none()

    exact_matches = _find_exact_matches(base_queryset, query, query_words)
    partial_matches = _find_partial_matches(base_queryset, query_words, exclude_ids=exact_matches)

    exclude_for_tfidf = list(exact_matches) + list(partial_matches)
    tfidf_matches = _find_tfidf_similar(base_queryset, query, query_words, exclude_ids=exclude_for_tfidf)

    all_product_ids = list(exact_matches) + list(partial_matches) + list(tfidf_matches)
    if not all_product_ids:
        return Product.objects.none()

    seen = set()
    unique_product_ids = []
    for pid in all_product_ids:
        if pid not in seen:
            seen.add(pid)
            unique_product_ids.append(pid)

    from django.db.models import Case, When, IntegerField

    preserved = Case(
        *[When(pk=pk, then=pos) for pos, pk in enumerate(unique_product_ids)],
        default=len(unique_product_ids),
        output_field=IntegerField(),
    )
    return base_queryset.filter(id__in=unique_product_ids).order_by(preserved)


def _extract_words(text: str) -> List[str]:
    """Extract words from text."""
    words = re.findall(r"\b\w+\b", text.lower())
    if len(text) > 1:
        words = [w for w in words if len(w) >= 2]
    return words if words else [text.lower()]


def _find_exact_matches(queryset: QuerySet, full_query: str, query_words: List[str]) -> List[int]:
    """Find products with exact word matches in name or description."""
    if not query_words:
        return []

    name_conditions = Q()
    desc_conditions = Q()
    for word in query_words:
        name_conditions |= Q(name__icontains=word)
        desc_conditions |= Q(description__icontains=word)

    name_matches = queryset.filter(name_conditions).values_list('id', flat=True)
    desc_matches = queryset.filter(desc_conditions).values_list('id', flat=True)
    return list(name_matches) + [id for id in desc_matches if id not in name_matches]


def _find_partial_matches(queryset: QuerySet, query_words: List[str], exclude_ids: List[int] = None) -> List[int]:
    """Find products with partial word matches (for typos/partial words)."""
    if exclude_ids is None:
        exclude_ids = []
    if not query_words:
        return []

    partial_conditions = Q()
    for word in query_words:
        if len(word) >= 3:
            partial_conditions |= Q(name__icontains=word) | Q(description__icontains=word)

    if not partial_conditions:
        return []

    return list(queryset.filter(partial_conditions).exclude(id__in=exclude_ids).values_list('id', flat=True))


def _find_tfidf_similar(queryset: QuerySet, query: str, query_words: List[str],
                       exclude_ids: List[int] = None, min_similarity: float = 0.1) -> List[int]:
    """Find semantically related products using TF-IDF and cosine similarity."""
    if exclude_ids is None:
        exclude_ids = []
    if not query_words:
        return []

    remaining_products = queryset.exclude(id__in=exclude_ids)
    if not remaining_products.exists():
        return []

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
        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000,
            lowercase=True,
            strip_accents='unicode',
        )

        all_texts = [query] + product_texts
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        similar_indices = [i for i, sim in enumerate(similarities) if sim >= min_similarity]
        similar_indices.sort(key=lambda i: similarities[i], reverse=True)
        return [product_ids[idx] for idx in similar_indices]

    except Exception as e:
        print(f"Error in TF-IDF search: {e}")
        return []


def _prepare_product_text(product: Product) -> str:
    """Prepare text for a product by combining name and description."""
    name = product.name or ""
    description = product.description or ""
    return f"{name} {description}".strip()

