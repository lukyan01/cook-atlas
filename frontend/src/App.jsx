// App.jsx
import { Routes, Route, Link } from "react-router-dom";
import UserPage from "./pages/UserPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </>
  );
}
