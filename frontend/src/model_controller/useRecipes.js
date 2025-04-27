import { useState } from "react";

// state and data logic for UserPage

export function useRecipes() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ query });
      const res = await fetch(
        `http://localhost:3000/recipes/search?${params.toString()}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { query, setQuery, results, loading, error, search };
}
