import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, setTasks, setTaskToDelete, setShowDeleteModal, handleMarkAsDone }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(task.status);

  const handleMarkAsDoneInternal = async (e) => {
    e.stopPropagation(); // Prevent click propagation to the card
    handleMarkAsDone(task.id);
    setStatus('Completed');
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent click propagation to the card
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent click propagation to the card
    navigate(`/edit-task/${task.id}`);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div
      className="bg-white p-4 rounded-2xl shadow-md cursor-pointer hover:scale-105 active:scale-90 duration-300"
      onClick={() => navigate(`/task-detail/${task.id}`)}
    >
      <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
      <p className="text-gray-700 mb-1 font-medium">Due date: {formatDate(task.due_date)}</p>
      <p className="text-gray-700 mb-1 font-medium">
        Status: <span className={status === 'Completed' ? 'text-green-500' : 'text-red-500'}>{status}</span>
      </p>
      <div className="flex mt-4 justify-between">
        <div>
          {status !== 'Completed' && (
            <button className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:scale-105 active:scale-90 duration-300" onClick={handleEdit}>Edit</button>
          )}
          <button className="bg-red-500 text-white py-1 px-3 rounded mr-2 hover:scale-105 active:scale-90 duration-300" onClick={handleDelete}>Delete</button>
        </div>
        {status !== 'Completed' && (
          <button className="bg-black text-white py-1 px-3 rounded hover:scale-105 active:scale-90 duration-300" onClick={handleMarkAsDoneInternal}>Mark as Done</button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
