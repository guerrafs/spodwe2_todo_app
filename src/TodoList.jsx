import { useState, useEffect } from "react";

const AddTodo = ({ addTodo }) => {
  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      const input = event.target;
      const text = input.value.trim();

      if (text) {
        await addTodo({ text, done: false });
        input.value = "";
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Adicione aqui sua nova tarefa"
      onKeyDown={handleKeyPress}
    />
  );
};

const TodoFilter = ({ setFilter }) => {
  const handleFilterClick = (event) => {
    event.preventDefault();
    const filter = event.target.id.replace("filter-", "");
    setFilter(filter);
  };

  return (
    <div className="center-content">
      <a href="#" id="filter-all" onClick={handleFilterClick}>
        Todos os itens
      </a>
      <a href="#" id="filter-done" onClick={handleFilterClick}>
        Concluídos
      </a>
      <a href="#" id="filter-pending" onClick={handleFilterClick}>
        Pendentes
      </a>
    </div>
  );
};

const TodoItem = ({ todo, markTodoAsDone }) => {
  const handleClick = () => {
    markTodoAsDone(todo.id);
  };

  return (
    <>
      {todo.done ? (
        <li style={{ textDecoration: "line-through" }}>{todo.text}</li>
      ) : (
        <li>
          {todo.text}
          <button onClick={handleClick}>Concluir</button>
        </li>
      )}
    </>
  );
};

const TodoList = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const filterBy = (todo) => {
    if (filter === "all") return true;
    if (filter === "done") return todo.done;
    if (filter === "pending") return !todo.done;
  };

  const applyFilter = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    const fetchOptions = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:3000/todos", fetchOptions);
        if (!response.ok) throw new Error("Erro ao buscar os dados");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchTodos();
  }, [token]);

  const addTodo = async (newTodo) => {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) throw new Error("Erro ao adicionar a tarefa");
      const createdTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
    }
  };

  const markTodoAsDone = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done: true }),
      });

      if (!response.ok) throw new Error("Erro ao marcar a tarefa como concluída");
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Erro ao marcar a tarefa como concluída:", error);
    }
  };

  return (
    <>
      <h1>Todo List</h1>
      <div className="center-content">
        Versão inicial da aplicação de lista de tarefas para a disciplina
        SPODWE2
      </div>
      <TodoFilter setFilter={applyFilter} />
      <AddTodo addTodo={addTodo} />

      {todos ? (
        <ul id="todo-list">
          {todos.filter(filterBy).map((todo) => (
            <TodoItem key={todo.id} todo={todo} markTodoAsDone={markTodoAsDone} />
          ))}
        </ul>
      ) : (
        <div className="center-content">Carregando...</div>
      )}
    </>
  );
};

export { TodoList };
