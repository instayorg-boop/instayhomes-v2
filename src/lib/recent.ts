// "Continue where you left off": the last listing someone opened and the last search they ran.
// Kept in this browser only; nothing breaks when storage is blocked, the sections just stay hidden.
import { useMemo, useSyncExternalStore } from "react";

export type RecentListing = {
  href: string;
  title: string;
  area: string;
  image: string;
  fromPrice: string;
  available: string;
};

export type RecentSearch = { label: string; universityId: string };

function createStore<T>(key: string) {
  const listeners = new Set<() => void>();
  const read = () => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  };
  return {
    use(): T | null {
      const raw = useSyncExternalStore(subscribe, read, () => null);
      return useMemo(() => {
        if (!raw) return null;
        try {
          return JSON.parse(raw) as T;
        } catch {
          return null;
        }
      }, [raw]);
    },
    set(value: T) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage blocked: nothing to remember.
      }
      listeners.forEach((listener) => listener());
    },
  };
}

const listingStore = createStore<RecentListing>("nestaway-recent-listing");
const searchStore = createStore<RecentSearch>("nestaway-recent-search");

export const useRecentListing = listingStore.use;
export const rememberListing = listingStore.set;
export const useRecentSearch = searchStore.use;
export const rememberSearch = searchStore.set;
