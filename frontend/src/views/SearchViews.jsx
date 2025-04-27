// SearchBar and RecipeList UI components.
//  Uses function that are passed in via props from UserPage.js

export function SearchBar({ value, onChange, onSearch, disabled }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Search Recipe"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: "1.5rem", width: "50%", padding: "0.5rem" }}
      />
      <button
        onClick={onSearch}
        disabled={disabled}
        style={{ fontSize: "1.2rem", marginLeft: "0.5rem" }}
      >
        {disabled ? "Searching…" : "Search"}
      </button>
    </div>
  );
}

export function RecipeList({ recipes }) {
  if (recipes.length === 0) return <p>No results.</p>;
  return (
    <div>
      {recipes.map((r) => (
        <div key={r.recipe_id} style={{ margin: "1rem 0" }}>
          <h3>{r.title}</h3>
          <p>{r.description}</p>
        </div>
      ))}
    </div>
  );
}
