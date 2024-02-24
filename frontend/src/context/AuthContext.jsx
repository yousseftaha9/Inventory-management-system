import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // const refreshToken = async () => {
  //   try {
  //     const response = await fetch("http://localhost:4000/user/refresh", {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     const data = await response.json();
  //     setUser(data.user);
  //   } catch (error) {
  //     console.error("Error refreshing token:", error);
  //   }
  // };

  // useEffect(() => {
  //   refreshToken();
  //   const interval = setInterval(refreshToken, 1000 * 29);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
