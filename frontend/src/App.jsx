import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import UserAccount from "./components/UserAccount";
import NotFoundPage from "./pages/NotFoundPage";
import Signup from "./pages/Signup";

function App() {
  const { user } = useAuth();
  // console.log(user);

  // if (!user) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />

        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

        <Route path="/account" element={<UserAccount />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
