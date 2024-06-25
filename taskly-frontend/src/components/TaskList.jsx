import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, parseISO, format } from 'date-fns';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('User');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/tasks', {
        headers: {
          Authorization: token,
        },
      });
      const sortedTasks = res.data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setTasks(sortedTasks);
      setUpcomingTasks(sortedTasks.filter(task => {
        const daysLeft = getDueDateMessage(task.due_date);
        return task.status !== 'Completed' && daysLeft >= 0;
      }));
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/auth/user', {
        headers: {
          Authorization: token,
        },
      });
      setUsername(res.data.username);
    };

    fetchTasks();
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: token }
    };
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${taskToDelete.id}`, config);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskToDelete.id));
      setUpcomingTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  const handleMarkAsDone = async (taskId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: token }
    };
    try {
      await axios.patch(`http://localhost:3000/api/tasks/${taskId}/status`, { status: 'Completed' }, config);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: 'Completed' } : task
        )
      );
      setUpcomingTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (err) {
      console.error(err);
      alert('Error updating task status');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'notCompleted') return task.status === 'Not Completed';
    return true;
  });

  const searchedTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDueDateMessage = (dueDate) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const differenceInTime = due.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayHasTask = tasks.some(task => format(parseISO(task.due_date), 'yyyy-MM-dd') === today);
  
      if (formattedDate === today) {
        if (formattedDate === today && todayHasTask) {
          return 'bg-red-400'; // Tailwind CSS class for today's date with a task due
        }
        return 'bg-gray-300'; // Tailwind CSS class for today's date
      }
  
      if (tasks.some(task => format(parseISO(task.due_date), 'yyyy-MM-dd') === formattedDate)) {
        return 'bg-red-200'; // Tailwind CSS class for task due dates
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col p-3 pt-10 md:p-12">
      <div className="w-full p-4 mb-6 flex justify-between items-center">
        <h1 className="text-5xl font-bold">My Tasks</h1>
        <div className="flex items-center">
          <span className="mr-4 text-xl font-semibold">{username}</span>
          <button 
            className="bg-black text-white p-2 rounded-full w-12 aspect-square flex items-center justify-center hover:scale-105 active:scale-90 duration-300"
            onClick={() => setShowProfileModal(true)}
          >
            <span className="material-icons">person</span>
          </button>
        </div>
      </div>
      <div className='w-full flex flex-col 2xl:flex-row'>
        <div className='w-full 2xl:w-3/4'>
          <div className="p-4 flex items-center justify-between">
            <div>
              <label className="text-xl font-medium mr-3">Search: </label>
              <input 
                type="text" 
                className="bg-white p-2 border rounded-md shadow"
                placeholder='Insert your task title'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xl font-medium ml-3 mr-3">Filter: </label>
              <select
                className="bg-white ml-3 p-2 border rounded-md shadow"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="notCompleted">Not Completed</option>
              </select>
            </div>
          </div>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <img src="/empty-task.png" alt="" className=' w-72 h-auto'/>
              <p className="text-4xl font-semibold mb-4">You don't have any tasks!</p>
              <button 
                className="w-1/2 text-white bg-black block text-center py-2 hover:scale-105 active:scale-90 duration-300 rounded-lg font-medium"
                onClick={() => navigate('/add-task')}
              >
                Start making one
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <p className="text-4xl font-semibold mb-4">You don't have any tasks match with this filter!</p>
            </div>
          ) : searchedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <p className="text-4xl font-semibold mb-4">You don't have any tasks match with this search!</p>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-2 gap-5 relative">
              {searchedTasks.map((task) => (
                <TaskCard key={task.id} task={task} setTasks={setTasks} setTaskToDelete={setTaskToDelete} setShowDeleteModal={setShowDeleteModal} handleMarkAsDone={handleMarkAsDone} />
              ))}
            </div>
          )}
        </div>
        <div className='w-full min-h-full p-4 flex gap-5 2xl:block 2xl:w-1/4'>
          <Calendar
            className={"rounded-xl bg-white font-sans border-none shadow-md max-w-max 2xl:w-full 2xl:mb-5 min-h-max font-semibold p-2"}
            tileClassName={tileClassName}
          />
          <div className="bg-white rounded-xl shadow-md p-4 min-w-max 2xl:max-w-full">
            <h2 className="text-xl font-bold mb-4">Reminders</h2>
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <div key={task.id} className="mb-2">
                  <p>
                    <span className='font-semibold'>{task.title}</span> is due {getDueDateMessage(task.due_date) === 0 
                      ? 'today' 
                      : (<span>in <span className='font-semibold'>{getDueDateMessage(task.due_date)} day(s)</span></span>)}
                  </p>
                </div>
              ))
            ) : (
              <p>No upcoming tasks!</p>
            )}
          </div>
        </div>
      </div>

      <button 
        className="bg-black text-white p-2 rounded-full flex items-center justify-center w-20 h-20 fixed bottom-10 right-10 md:bottom-24 md:right-24 hover:scale-105 active:scale-90 duration-300"
        onClick={() => navigate('/add-task')}
      >
        <img src="add.svg" alt="" className="size-20 hover:scale-105 active:scale-90 duration-300"/>
      </button>
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl mb-4 font-semibold">Profile</h2>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:scale-105 active:scale-90 duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded ml-4 hover:scale-105 active:scale-90 duration-300"
              onClick={() => setShowProfileModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white py-1 px-3 rounded mr-2 hover:scale-105 active:scale-90 duration-300" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="bg-red-500 text-white py-1 px-3 rounded hover:scale-105 active:scale-90 duration-300" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
