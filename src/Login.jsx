import { useState } from "react";
import "./App.css"; 

export const Login = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage("Usuário não encontrado ou senha incorreta.");
        } else {
          setErrorMessage("Erro ao realizar login. Tente novamente.");
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="form">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="form-button">
          Login
        </button>
        <p className="form-text">
          Não tem uma conta?{" "}
          <a href="#" onClick={onSwitchToRegister} className="form-link">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
};
