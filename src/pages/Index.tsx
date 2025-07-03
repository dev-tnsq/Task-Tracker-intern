import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [username, setUsername] = useLocalStorage('taskTracker_username', '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (username) {
      setIsLoggedIn(true);
    }
  }, [username]);

  const handleLogin = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn || !username) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard username={username} onLogout={handleLogout} />;
};

export default Index;
