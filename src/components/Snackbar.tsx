import { useState, useEffect } from 'react';
import { DeletedTask } from '@/types/task';

interface SnackbarProps {
  deletedTask: DeletedTask | null;
  onUndo: () => void;
  onDismiss: () => void;
}

const Snackbar = ({ deletedTask, onUndo, onDismiss }: SnackbarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (deletedTask) {
      setIsVisible(true);
      setIsExiting(false);
      
      const timer = setTimeout(() => {
        handleExit();
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [deletedTask]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  const handleUndo = () => {
    onUndo();
    handleExit();
  };

  if (!isVisible || !deletedTask) return null;

  return (
    <div className={`snackbar ${isExiting ? 'snackbar-exit' : ''}`}>
      <span className="text-sm">
        <strong>{deletedTask.task.title}</strong> deleted
      </span>
      <button
        onClick={handleUndo}
        className="text-primary hover:text-primary-hover font-medium text-sm transition-colors"
      >
        Undo
      </button>
      <button
        onClick={handleExit}
        className="text-muted-foreground hover:text-foreground text-lg leading-none transition-colors"
      >
        ×
      </button>
    </div>
  );
};

export default Snackbar;