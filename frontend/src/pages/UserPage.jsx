// HomePage

import { useRecipes } from "../model_controller/useRecipes.js";
import { SearchBar, RecipeList } from "../views/SearchViews.jsx";

export default function UserPage() {
  const { query, setQuery, results, loading, error, search } = useRecipes();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Find a Recipe</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={search}
        disabled={loading}
      />

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <RecipeList recipes={results} />
    </div>
  );
}
