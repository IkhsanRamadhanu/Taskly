import React from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
    const navigate = useNavigate(); // useNavigate alih-alih useHistory

    return (
        <div className='scroll-smooth bg-gray-200 min-h-screen'>
            <header className="flex justify-between items-center py-5 px-4 md:px-10 border-b border-gray-300 duration-300">
                <div className="flex items-center">
                <img src="/logo.png" alt="Taskly Logo" className="w-6 h-6 mr-2" />
                <span className='font-bold'>Taskly</span>
                </div>
                <nav>
                <ul className="flex">
                    <li><a href="#" className="text-gray-900 font-bold rounded-full hover:bg-gray-300 duration-300 p-2">Home</a></li>
                    <li><a href="#feature" className="text-gray-900 font-bold rounded-full hover:bg-gray-300 duration-300 p-2">Features</a></li>
                </ul>
                </nav>
                <div className="flex items-center hover:scale-105 active:scale-90 duration-300">
                <button className="flex items-center text-white bg-black py-2 px-4 rounded-md" onClick={() => navigate('/login')}>
                    <img src="/login_icon.png" alt="Login Icon" className="w-4 h-4 mr-2" />
                    Login
                </button>
                </div>
            </header>
            <main className='flex w-full justify-center scroll-smooth'>
                <div className=' max-w-6xl p-4 scroll-smooth'>
                    <div className="w-full flex items-center justify-between py-5 flex-wrap md:justify-center">
                        <div className="text-section max-w-lg">
                            <h1 className="text-4xl font-bold md:text-6xl duration-300">Your Simple and Efficient Task Manager</h1>
                            <p className="mt-4 text-sm max-w-96 md:text-base duration-300">Our mission is to simplify your task management with intuitive features and seamless integration.</p>
                            <button className="bg-black text-white py-2 px-4 mt-5 rounded-full shadow-xl text-xs md:text-base hover:scale-110 active:scale-95 duration-300" onClick={() => navigate('/signup')}>Get Started</button>
                        </div>
                        <div className="image-section">
                            <img src="/landing-page-pict.png" alt="Task Manager Illustration" className="max-w-full h-auto duration-300" />
                        </div>
                    </div>
                    <section className="features py-16 text-center scroll-smooth" id='feature'>
                        <h2 className="text-2xl font-bold mb-10">Features</h2>
                        <div className="feature-cards flex justify-center gap-5 flex-wrap">
                            <div className="feature-card w-72 p-5 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Easy to Use</h3>
                            <p>Our web is designed with simplicity in mind, making it easy for anyone to use.</p>
                            </div>
                            <div className="feature-card w-72 p-5 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Organize Tasks</h3>
                            <p>Organize your tasks with categories and priorities to stay on top of your work.</p>
                            </div>
                            <div className="feature-card w-72 p-5 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Set Reminders</h3>
                            <p>Never miss a deadline with our built-in reminder feature.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
  );
}

export default App;
