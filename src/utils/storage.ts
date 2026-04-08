/**
 * SessionStorage wrapper with JSON serialization.
 * All operations are wrapped in try/catch for private browsing mode
 * where sessionStorage may throw.
 */

/**
 * Save data to sessionStorage as JSON.
 */
export function saveState(key: string, data: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Silently fail in private browsing mode
  }
}

/**
 * Load and parse data from sessionStorage.
 * Returns null if the key is missing or data is invalid.
 */
export function loadState<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Remove a single key from sessionStorage.
 */
export function clearState(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

/**
 * Clear all sessionStorage data.
 */
export function clearAll(): void {
  try {
    sessionStorage.clear();
  } catch {
    // Silently fail
  }
}
