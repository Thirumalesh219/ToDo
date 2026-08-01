import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import "../styles/Todo.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiAddLargeFill } from "react-icons/ri";
import { toast } from "sonner";

function Todo() {
  const [fetching, setFetching] = useState(false);
  const [tasks, setTasks] = useState([]);
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const task = useRef();
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("all");
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const fetchTasks = async (currentPage = page, currentStatus = status) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    setFetching(true);

    const res = await axios.get(
      `${BASE_URL}/todo?page=${currentPage}&limit=5&status=${currentStatus}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks(res.data.tasks);
    setPage(res.data.currentPage);
    setTotalPages(res.data.totalPages);
    setCounts(res.data.counts || {
      total: 0,
      completed: 0,
      pending: 0,
    });
  } catch (err) {
    console.error(err);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  } finally {
    setFetching(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMessage("");
    navigate("/login");
  };

  const addItem = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const inputValue = task.current.value.trim();

    if (!inputValue) {
      setMessage("Please enter a task");
      return;
    }

    const payload = { task: inputValue };
    task.current.value = "";
    task.current.focus();

    setMessage("");

    try {
      await axios.post(`${BASE_URL}/addtodo`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task added successfully");
      fetchTasks(1,status);
    } catch (err) {
      console.error("Failed to add task:", err);
      toast.error("Failed to add task");
    }
  };

  
  useEffect(() => {
    fetchTasks(page,status);
  }, [page, status]);

  useEffect(()=>{
    task.current?.focus();
  },[])

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
      const nextPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      if(page !== nextPage)
        setPage(nextPage)
      else
        fetchTasks(page,status)
      toast.success("Your task updated successfully");
    } catch (err) {
      toast.error("Failed to update your task");
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
      const nextPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      
      if(page !== nextPage)
        setPage(nextPage)
      else
        fetchTasks(page,status)

      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete your task");
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

        {message && (
          <div className="error-message">
              <span>{message}</span>
              <button 
                  className="close-button"
                  type="button"
                  onClick={() => setMessage("")}
              >
                  x
              </button>
          </div>
        )}

        <div>
        <div className="toolbar">
          <select
            data-testid="status-filter"
            value={status}
            disabled={fetching}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <div className="task-counts">
            <span>Total: {counts.total}</span>
            <span>Pending: {counts.pending}</span>
            <span>Completed: {counts.completed}</span>
          </div>
        </div>

        {fetching ? (
          <Loading />
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>
              {status === "all"
                ? "No tasks found."
                : status === "pending"
                ? "No pending tasks found."
                : "No completed tasks found."}
            </p>
          </div>
        ) : (
          <>
            <ul className="todo-list">
              {tasks.map((item) => (
                <li
                  key={item._id}
                  data-testid="todo-item"
                  className={`todo-item ${item.isdone ? "done" : ""}`}
                >
                  <label className="todo-label">
                    <input
                      data-testid={`todo-checkbox-${item._id}`}
                      type="checkbox"
                      checked={item.isdone}
                      onChange={() => updateItem(item._id, item.isdone)}
                    />
                    <span>{item.task}</span>
                  </label>

                  <button
                    data-testid={`delete-task-${item._id}`}
                    className="todo-delete-button"
                    onClick={() => deleteItem(item._id)}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              data-testid="previous-page"
              disabled={page === 1 || fetching}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              data-testid="next-page"
              disabled={page === totalPages || fetching}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default Todo;
