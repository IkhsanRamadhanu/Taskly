import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import background from '/background.png';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to sign up with:', { username, password }); // Log data yang dikirim
      const response = await axios.post('http://localhost:3000/api/auth/signup', { username, password });
      console.log('Sign up response:', response); // Log respons
      navigate('/login'); // Gunakan navigate untuk navigasi
    } catch (err) {
      console.error('Error creating account:', err);
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error('Server responded with:', err.response.status, err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
      } else {
        // Something else happened
        console.error('Error', err.message);
      }
      alert('Error creating account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <button className="border border-black text-black py-1 px-3 rounded mb-4 hover:scale-105 active:scale-90 duration-300 absolute left-5 top-4" onClick={() => navigate('/landing-page')}>Back</button>
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[40rem] flex flex-col items-center border">
        <div className="flex items-center mb-3">
          <img src="/logo.png" alt="Taskly Logo" className="w-9 h-auto mr-4" />
          <span className='font-bold text-3xl'>Taskly</span>
        </div>
        <div className='w-full flex justify-between items-start gap-4'>
          <img src="/signup-pict.png" alt="Login Vector" className=' w-64 h-64 w'/>
          <div className='w-full h-full flex flex-col justify-start'>
            <h2 className="text-2xl mb-1 font-semibold">Sign Up</h2>
            <div>
              <label className="block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Create username'
                className="border border-black rounded w-full py-1 px-2 mt-1 shadow-sm"
                required
              />
            </div>
            <div className="mt-2">
              <label className="block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Create password'
                className="border border-black rounded w-full py-1 px-2 mt-1 shadow-sm"
                required
              />
            </div>
            <div className=' flex mt-4 justify-end gap-4 self-center'>
                <button type="button" className="border border-black text-black w-24 font-medium py-1 px-4 rounded hover:scale-105 active:scale-90 duration-300" onClick={() => navigate('/login')}>
                Log In
                </button>
                <button type="submit" className="bg-black text-white w-24 font-medium py-1 px-4 rounded hover:scale-105 active:scale-90 duration-300">
                Sign Up
                </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
