import { useState } from "react";
import authAxios from "../utils/axios";
import toast from "react-hot-toast";

export default function TaskForm({ task, onSuccess, tasks, setTasks }) {
  const [form, setForm] = useState(
    task || { title: "", description: "", status: "pending", dueDate: "" }
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if (task) {
        await authAxios.put(`/tasks/${task._id}`, form);
        const updatedTasks = tasks.map((t) =>
          t._id === task._id ? form : t
        );
        setTasks(updatedTasks);
      } else {
        const newTask = await authAxios.post("/tasks", form);
        setTasks([...tasks, newTask.data?.task])
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Task save failed");
    }
    setLoading(false)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          placeholder="Task title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition bg-white"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          placeholder="Task description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition bg-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition bg-white"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="datetime-local"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition bg-white"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold rounded-lg shadow-md transition"
        disabled={loading}
      >
        {task ? loading ? "Updating..." : "Update Task" : loading ? "Adding.." : "Add Task"}
      </button>
    </form>
  );
}
