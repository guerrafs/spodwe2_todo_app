import { useState } from "react";
import "./App.css"; 

export const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Registration failed");
      onRegister();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleRegister} className="form">
        <h1>Cadastro</h1>
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
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="form-button">
          Cadastrar
        </button>
      </form>
    </div>
  );
};
