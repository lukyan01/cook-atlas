import { useEffect, useState } from 'react';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    creator_id: '',
    title: '',
    description: '',
    cook_time: '',
    prep_time: '',
    skill_level: '',
    source_platform: '',
    source_url: '',
  });

  const [updateId, setUpdateId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [deleteId, setDeleteId] = useState('');

  const fetchRecipes = async () => {
    try {
      // Append a timestamp to bypass cache
      const res = await fetch(`http://localhost:3000/recipes?timestamp=${Date.now()}`);
      const data = await res.json();
      console.log('Fetched recipes:', data);
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleInsert = async () => {
    try {
      await fetch('http://localhost:3000/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });
      alert('Recipe inserted!');
      fetchRecipes();
    } catch (err) {
      console.error('Insert error:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch('http://localhost:3000/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe_id: updateId,
          title: updateTitle,
          description: updateDescription,
        }),
      });
      alert('Recipe updated!');
      fetchRecipes();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch('http://localhost:3000/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id: deleteId }),
      });
      alert('Recipe deleted!');
      fetchRecipes();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>CookAtlas Admin Interface</h1>

      <h2>Insert New Recipe</h2>
      {Object.keys(newRecipe).map((field) => (
        <div key={field}>
          <input
            placeholder={field.replace('_', ' ')}
            value={newRecipe[field]}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, [field]: e.target.value })
            }
            style={{ margin: '5px', padding: '5px', width: '300px' }}
          />
        </div>
      ))}
      <button onClick={handleInsert} style={{ marginTop: '10px' }}>
        Insert
      </button>

      <h2>Update Recipe</h2>
      <input
        placeholder="Recipe ID"
        value={updateId}
        onChange={(e) => setUpdateId(e.target.value)}
        style={{ margin: '5px' }}
      />
      <input
        placeholder="New Title"
        value={updateTitle}
        onChange={(e) => setUpdateTitle(e.target.value)}
        style={{ margin: '5px' }}
      />
      <input
        placeholder="New Description"
        value={updateDescription}
        onChange={(e) => setUpdateDescription(e.target.value)}
        style={{ margin: '5px' }}
      />
      <button onClick={handleUpdate} style={{ marginTop: '10px' }}>
        Update
      </button>

      <h2>Delete Recipe</h2>
      <input
        placeholder="Recipe ID"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
        style={{ margin: '5px' }}
      />
      <button onClick={handleDelete}>Delete</button>

      <h2>All Recipes</h2>
      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: '20px', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Creator</th>
            <th>Title</th>
            <th>Description</th>
            <th>Cook Time</th>
            <th>Prep Time</th>
            <th>Skill Level</th>
            <th>Source Platform</th>
            <th>Source URL</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.recipe_id}>
              <td>{r.recipe_id}</td>
              <td>{r.creator_id}</td>
              <td>{r.title}</td>
              <td>{r.description}</td>
              <td>{r.cook_time}</td>
              <td>{r.prep_time}</td>
              <td>{r.skill_level}</td>
              <td>{r.source_platform}</td>
              <td>
                <a href={r.source_url} target="_blank" rel="noreferrer">
                  link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Debug: show raw JSON */}
      <h2>Debug JSON Output</h2>
      <pre>{JSON.stringify(recipes, null, 2)}</pre>
    </div>
  );
}

export default App;
