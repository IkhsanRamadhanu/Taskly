import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import background from '/background.png';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('');
  const [originalTask, setOriginalTask] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        const token = localStorage.getItem('token');
        try {
          const res = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
            headers: { Authorization: token }
          });
          const task = res.data;
          setTitle(task.title || '');
          setDescription(task.description || '');
          setDueDate(task.due_date ? format(parseISO(task.due_date), 'yyyy-MM-dd') : ''); // Format date correctly
          setLink(task.link || '');
          setStatus(task.status || '');
          setOriginalTask(task);
          setIsLoaded(true);
        } catch (err) {
          console.error('Error fetching task:', err);
          alert('Error fetching task');
        }
      };
      fetchTask();
    } else {
      setIsLoaded(true);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: token } };
    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/tasks/${id}`, { title, description, due_date: dueDate, link, status }, config);
      } else {
        await axios.post('http://localhost:3000/api/tasks', { title, description, due_date: dueDate, link, status: 'not completed' }, config);
      }
      navigate('/tasks');
    } catch (err) {
      console.error('Error saving task', err);
      alert('Error saving task');
    }
  };

  const hasChanges = () => {
    if (!originalTask) return true;
    return (
      originalTask.title !== title ||
      originalTask.description !== description ||
      originalTask.due_date.split('T')[0] !== dueDate ||
      originalTask.link !== link
    );
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col p-14 items-center" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <h1 className="text-5xl font-bold mb-12">{id ? 'Edit Task' : 'Add Task'}</h1>
      <div className="mx-auto bg-white p-4 rounded-xl shadow-lg w-full max-w-[50rem]">
        <button className="border border-black text-black py-1 px-3 rounded mb-4 hover:scale-105 active:scale-90 duration-300" onClick={() => navigate('/tasks')}>Back</button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-black rounded w-full py-1 px-2 mt-1 shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Task Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-black rounded w-full py-1 px-2 mt-1 shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Task Due</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-black rounded w-full py-1 px-2 mt-1 shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Task Link (optional)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border border-black rounded w-full py-1 px-2 mt-1 shadow-sm"
            />
          </div>
          {hasChanges() && (
            <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:scale-105 active:scale-90 duration-300">Save</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
