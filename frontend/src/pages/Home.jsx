import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

let firstRender = true;
function Home() {
  const { user, setUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  // console.log(user);

  const refreshToken = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/refresh", {
        method: "GET",
        withCredentials: true,
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    refreshToken();
    const interval = setInterval(refreshToken, 1000 * 29);
    return () => clearInterval(interval);
  }, []);

  // useEffect(
  //   function () {
  //     async function getProducts() {
  //       try {
  //         const data = await fetch("http://localhost:4000/products", {
  //           headers: { Authorization: `Bearer ${user.token}` },
  //         });
  //         // console.log(data);
  //         if (data.ok) {
  //           const products = await data.json();
  //           setProducts(products);
  //           // console.log(products);
  //         } else {
  //           setError("Not authorized");
  //         }
  //       } catch (error) {
  //         console.log(error.message);
  //       }
  //     }

  //     getProducts();
  //   },
  //   [user.token]
  // );

  function handleLogout(e) {
    e.preventDefault();
    setUser(null);
  }
  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }
  return (
    <div>
      <h1>hello {user.user.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
