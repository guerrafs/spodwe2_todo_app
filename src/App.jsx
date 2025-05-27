import "./App.css";
import { useState } from "react";
import { TodoList } from "./TodoList";
import { Login } from "./Login";
import { Register } from "./Register";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <main className="container">
      {token ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <TodoList token={token} />
        </>
      ) : isRegistering ? (
        <Register onRegister={() => setIsRegistering(false)} />
      ) : (
        <Login onLogin={setToken} onSwitchToRegister={() => setIsRegistering(true)} />
      )}
    </main>
  );
}

export default App;
