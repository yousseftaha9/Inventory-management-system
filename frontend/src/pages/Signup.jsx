import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, user } = useAuth();

  const sendRequest = async () => {
    const res = await axios
      .post("http://localhost:4000/user/register", {
        username: username,
        password: password,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    console.log(data);
    return data;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log(JSON.stringify({ username, password, role }));
      const response = await fetch("http://localhost:4000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUser(data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          placeholder="Your role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button>Submit</button>
      </form>
      <Link to="/login">Login</Link>
      {error && <h1>{error}</h1>}
    </>
  );
}

export default Signup;
