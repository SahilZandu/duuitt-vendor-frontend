// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Verify from "./pages/Verify";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/verify" element={<Verify />} /> */}
      {/* <Route path="/register" element={<Register />} /> */}
    </Routes>
  );
}

export default App;
