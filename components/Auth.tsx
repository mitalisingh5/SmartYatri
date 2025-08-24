import React, { useState } from 'react';

interface AuthProps {
    onAuthSuccess: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle actual authentication logic.
        // For this example, we'll get a display name and call the success callback.
        const displayName = isLogin ? email.split('@')[0] : username;
        onAuthSuccess(displayName);
    };

    const toggleAuthMode = () => {
        setIsLogin(prev => !prev);
    };

    const inputStyles = "w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition duration-200";
    const labelStyles = "block text-sm font-medium text-slate-600 mb-1";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="flex items-center space-x-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <span className="text-2xl font-bold text-slate-800">Smart Trip Planner</span>
            </div>
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
                <p className="text-slate-500 text-center mb-6">{isLogin ? 'Log in to plan your next adventure.' : 'Sign up to get started with personalized trip planning.'}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label htmlFor="username" className={labelStyles}>Username</label>
                                <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className={inputStyles} placeholder="e.g., travelbug" required />
                            </div>
                             <div>
                                <label htmlFor="phone" className={labelStyles}>Phone Number</label>
                                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={inputStyles} placeholder="e.g., +1 555-123-4567" />
                            </div>
                        </>
                    )}
                    <div>
                        <label htmlFor="email" className={labelStyles}>Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={inputStyles} placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label htmlFor="password" className={labelStyles}>Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={inputStyles} placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                        {isLogin ? 'Log In' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-600 mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleAuthMode} className="font-semibold text-orange-500 hover:text-orange-600 ml-1 focus:outline-none">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;