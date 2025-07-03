import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [, setStoredUsername] = useLocalStorage('taskTracker_username', '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setStoredUsername(username.trim());
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Task Tracker
            </h1>
            <p className="text-muted-foreground">
              Welcome! Please enter your name to get started.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter your name..."
                autoFocus
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full py-3 text-lg"
              disabled={!username.trim()}
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;