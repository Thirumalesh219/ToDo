import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import "../styles/Todo.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiAddLargeFill } from "react-icons/ri";

function Todo() {
  const [fetching, setFetching] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const task = useRef();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setFetching(true);
      const res = await axios.get(`${BASE_URL}/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data.tasks);
      setUser(res.data.user[0]?.username || "User");
    } catch (err) {
      console.error("Failed to fetch Todo items:", err);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const addItem = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const inputValue = task.current.value.trim();

    if (!inputValue) return;

    const payload = { task: inputValue };
    task.current.value = "";

    try {
      await axios.post(`${BASE_URL}/addtodo`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateItem = async (id, currentStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${BASE_URL}/updatetodo/${id}`,
        {
          isdone: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };
  const deleteItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/deletetodo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  return (
    <div className="todo-page-wrapper">
      <div className="todo-container">
        <div className="todo-header">
          <h1>Welcome, {user}</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <form className="todo-form" onSubmit={addItem}>
          <input
            className="todo-input"
            type="text"
            placeholder="Enter a new task"
            ref={task}
          />
          <button className="todo-add-button" type="submit" disabled={fetching}>
            <RiAddLargeFill />
          </button>
        </form>

        {fetching ? (
          <Loading />
        ) : (
          <ul className="todo-list">
            {tasks.map((item) => (
              <li
                key={item._id}
                className={`todo-item ${item.isdone ? "done" : ""}`}
              >
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={item.isdone}
                    onChange={() => updateItem(item._id, item.isdone)}
                  />
                  <span>{item.task}</span>
                </label>
                <button
                  className="todo-delete-button"
                  onClick={() => deleteItem(item._id)}
                >
                  <RiDeleteBin6Line />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Todo;
