import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import background from '/background.png';

const TaskDetail = () => {
  const [task, setTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
          headers: { Authorization: token }
        });
        const fetchedTask = res.data;
        setTask(fetchedTask);
      } catch (err) {
        console.error('Error fetching task:', err);
        alert('Error fetching task');
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: token }
    };
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`, config);
      navigate('/tasks');
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  const handleMarkAsDone = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: token }
    };
    try {
      await axios.patch(`http://localhost:3000/api/tasks/${id}/status`, { status: 'Completed' }, config);
      setTask((prevTask) => ({ ...prevTask, status: 'Completed' }));
    } catch (err) {
      console.error(err);
      alert('Error updating task status');
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col p-14 items-center" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <h1 className="text-5xl font-bold mb-12">Task Detail</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[50rem]">
        <button className="border border-black text-black py-1 px-3 rounded mb-4 hover:scale-105 active:scale-90 duration-300" onClick={() => navigate('/tasks')}>Back</button>
        <h2 className="text-4xl mb-6 font-bold">{task.title}</h2>
        <p className="text-gray-700 mb-0 font-semibold text-xl">Description:</p>
        <p className="text-gray-700 mb-4 text-xl">{task.description}</p>
        <p className="text-gray-700 mb-4 text-xl"><span className='font-semibold'>Due Date: </span>{formatDate(task.due_date)}</p>
        {task.link && (
          <p className="text-blue-500 mb-4 text-xl font-semibold w-max underline hover:font-bold duration-300"><a href={task.link} target="_blank">Link Tugas</a></p>
        )}
        <p className="mb-4 text-xl font-medium">
          <span className='font-semibold'>Status: </span><span className={task.status === 'Completed' ? 'text-green-500' : 'text-red-500'}>{task.status}</span>
        </p>
        <div className="flex mt-6 justify-between">
        <div>
          {task.status !== 'Completed' && (
            <button className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:scale-105 active:scale-90 duration-300" onClick={() => navigate(`/edit-task/${task.id}`)}>Edit</button>
          )}
          <button className="bg-red-500 text-white py-1 px-3 rounded mr-2 hover:scale-105 active:scale-90 duration-300" onClick={() => setShowDeleteModal(true)}>Delete</button>
        </div>
        {task.status !== 'Completed' && (
          <button className="bg-black text-white py-1 px-3 rounded hover:scale-105 active:scale-90 duration-300" onClick={handleMarkAsDone}>Mark as Done</button>
        )}
        </div>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-md">
              <p className="mb-4">Are you sure you want to delete this task?</p>
              <div className="flex justify-end">
                <button className="bg-gray-500 text-white py-1 px-3 rounded mr-2" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="bg-red-500 text-white py-1 px-3 rounded" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
