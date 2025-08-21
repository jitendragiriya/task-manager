import { useState, useEffect } from "react";
import authAxios from "../utils/axios";
import TaskForm from "../components/TaskForm";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const { data } = await authAxios.get("/tasks");
      setTasks(data?.tasks);
    } catch (error) {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSuccess = () => {
    setShowModal(false);
    setEditingTask(null);
    toast.success(editingTask ? "Task updated!" : "Task added!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Status badge
  const getStatusBadge = (status) => {
    let color = "bg-gray-200 text-gray-700";
    if (status === "completed") color = "bg-green-200 text-green-800";
    if (status === "in_progress") color = "bg-yellow-200 text-yellow-800";
    if (status === "pending") color = "bg-yellow-200 text-yellow-800";
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-100 p-4">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-sky-800">
            My Tasks ✨
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-sky-400 hover:bg-sky-500 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              + Add Task
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tasks */}
        {tasks.length === 0 ? (
          <p className="text-sky-600 text-center py-6">
            No tasks yet. Start by adding one! 🌸
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="group p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-sky-100"
              >
                <div className="flex flex-col h-full justify-between capitalize">
                  <div>
                    <h2 className="font-semibold text-xl text-sky-800 mb-2 group-hover:text-sky-600 transition">
                      {task.title}
                    </h2>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {task.description}
                    </p>
                    <p className="text-sm text-sky-700 sm:flex items-center gap-2">
                      {getStatusBadge(task.status)}
                      <span className="text-gray-500">|</span>
                      Due:
                      <span className="font-medium text-gray-800 lowercase">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleString()
                          : "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setShowModal(true);
                      }}
                      className="px-4 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 text-sm font-medium rounded-lg shadow-sm transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this task?")) {
                          try {
                            await authAxios.delete(`/tasks/${task._id}`);
                            toast.success("Task deleted successfully!");
                            fetchTasks();
                          } catch (error) {
                            toast.error(error.response?.data?.message || "Delete failed");
                          }
                        }
                      }}
                      className="text-red-500 font-medium ml-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white/95 rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 relative border-indigo-100 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-sky-800">
                {editingTask ? "Edit Task" : "Add Task"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTask(null);
                }}
                className="text-sky-600 hover:text-sky-800 text-xl"
              >
                ✕
              </button>

            </div>
            <TaskForm task={editingTask} onSuccess={handleSuccess} setTasks={setTasks} tasks={tasks} />
          </div>
        </div>
      ) : null
      }
    </div >
  );
}
