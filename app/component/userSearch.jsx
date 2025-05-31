// src/components/UserSearch.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce"; // optional, but recommended for fewer requests

export default function UserSearch({ setReceiverId, token }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]); // array of { _id, username, name, isOnline, lastSeen }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedFetchRef = useRef(null);

  // ───────────────────────────────────────────────────────────────────────────
  // 1) Debounced fetch function (fires 300ms after the user stops typing)
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Create a debounced version of fetchResults
    debouncedFetchRef.current = debounce(async (term) => {
      if (!term.trim() || !token) {
        setResults([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/user/search/${term}`,
          {
            headers: {
              token,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setResults(data.users || []);
      } catch (err) {
        console.error("Error searching users:", err);
        setError("Failed to fetch results.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 1000); // 300ms debounce
  }, [token]);

  // ───────────────────────────────────────────────────────────────────────────
  // 2) Whenever searchTerm changes, call the debounced fetch
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    debouncedFetchRef.current(searchTerm);
  }, [searchTerm]);

  // ───────────────────────────────────────────────────────────────────────────
  // 3) Cleanup debounce on unmount
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      debouncedFetchRef.current.cancel();
    };
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // 4) Render
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        type="text"
        className="w-full border rounded-md px-3 py-2 mb-2"
        placeholder="Search users by username..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      {loading && <p className="text-sm text-gray-500">Searching…</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}

      {/* ─────────────── Results List ─────────────── */}
      {results.length > 0 && (
        <ul className="bg-white border rounded-md max-h-60 overflow-y-auto">
          {results.map((u) => (
            <li
              key={u._id}
              className="px-3 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                // When someone clicks a result:
                // 1) Call parent callback so it knows which user was selected
                setReceiverId(u._id);
                // 2) (Optional) you could also navigate to a “chat” page:
                // router.push(`/chat/${u._id}`);
              }}
            >
              <div>
                <p className="font-medium">{u.username}</p>
                <p className="text-xs text-gray-500">{u.name}</p>
              </div>
              <div>
                {u.isOnline ? (
                  <span className="text-green-500 text-xs">● Online</span>
                ) : (
                  <span className="text-gray-400 text-xs">
                    Last seen {new Date(u.lastSeen).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
