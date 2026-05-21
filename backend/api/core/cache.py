import asyncio
import time
from functools import wraps
from typing import Any, Callable, Optional, TypeVar

F = TypeVar("F", bound=Callable[..., Any])


class CacheEntry:
    """Represents a cached entry with TTL."""

    def __init__(self, value: Any, ttl_seconds: int):
        self.value = value
        self.created_at = time.time()
        self.ttl_seconds = ttl_seconds

    def is_expired(self) -> bool:
        """Check if cache entry has expired."""
        return time.time() - self.created_at > self.ttl_seconds


class MemoryCache:
    """Simple in-memory cache with TTL support."""

    _instance: Optional["MemoryCache"] = None
    _store: dict[str, CacheEntry] = {}

    def __new__(cls) -> "MemoryCache":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def set(self, key: str, value: Any, ttl_seconds: int = 3600) -> None:
        """Store a value in cache with TTL."""
        self._store[key] = CacheEntry(value, ttl_seconds)

    def get(self, key: str) -> Optional[Any]:
        """Retrieve a value from cache."""
        if key not in self._store:
            return None

        entry = self._store[key]
        if entry.is_expired():
            del self._store[key]
            return None

        return entry.value

    def delete(self, key: str) -> None:
        """Delete a cache entry."""
        if key in self._store:
            del self._store[key]

    def clear(self) -> None:
        """Clear all cache entries."""
        self._store.clear()


def cache(ttl_seconds: int = 3600) -> Callable[[F], F]:
    """Decorator to cache async function results with TTL."""

    def decorator(func: F) -> F:
        cache_instance = MemoryCache()

        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            cache_key = f"{func.__module__}.{func.__name__}:{args}:{kwargs}"

            cached_value = cache_instance.get(cache_key)
            if cached_value is not None:
                return cached_value

            result = await func(*args, **kwargs)
            cache_instance.set(cache_key, result, ttl_seconds)
            return result

        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            cache_key = f"{func.__module__}.{func.__name__}:{args}:{kwargs}"

            cached_value = cache_instance.get(cache_key)
            if cached_value is not None:
                return cached_value

            result = func(*args, **kwargs)
            cache_instance.set(cache_key, result, ttl_seconds)
            return result

        if asyncio.iscoroutinefunction(func):
            return async_wrapper  # type: ignore
        return sync_wrapper  # type: ignore

    return decorator


cache_instance = MemoryCache()
