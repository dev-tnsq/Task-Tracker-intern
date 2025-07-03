import { useState } from 'react';
import { Task } from '@/types/task';
import { Trash2, Edit, Check, Calendar, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  searchTerm?: string;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit, searchTerm }: TaskItemProps) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDeleteClick = () => {
    if (showConfirmDelete) {
      onDelete(task.id);
    } else {
      setShowConfirmDelete(true);
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onToggle(task.id);
      setIsAnimating(false);
    }, 150);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false, isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isOverdue: false };
    } else {
      return { text: `Due in ${diffDays} days`, isOverdue: false };
    }
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="search-highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-item bg-card rounded-lg border border-border p-4 shadow-sm transition-all duration-300 ${
      task.completed ? 'task-completed' : ''
    } ${isOverdue ? 'task-overdue' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isAnimating ? 'check-animation' : ''
          } ${
            task.completed
              ? 'bg-success border-success text-success-foreground'
              : 'border-muted-foreground hover:border-primary hover:scale-110'
          }`}
        >
          {task.completed && <Check size={14} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
            {searchTerm ? highlightText(task.title, searchTerm) : task.title}
          </h4>
          
          {task.description && (
            <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
              {searchTerm ? highlightText(task.description, searchTerm) : task.description}
            </p>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span key={tag} className="task-tag text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Created {formatDate(task.createdAt)}</span>
            
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${
                formatDueDate(task.dueDate).isOverdue 
                  ? 'text-destructive font-medium' 
                  : formatDueDate(task.dueDate).isToday 
                    ? 'text-warning font-medium'
                    : ''
              }`}>
                {formatDueDate(task.dueDate).isOverdue && <AlertCircle size={12} />}
                <Calendar size={12} />
                <span>{formatDueDate(task.dueDate).text}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-secondary rounded-md transition-colors duration-200 hover:scale-105"
            title="Edit task"
          >
            <Edit size={16} className="text-muted-foreground" />
          </button>
          
          <button
            onClick={handleDeleteClick}
            className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
              showConfirmDelete
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'hover:bg-secondary'
            }`}
            title={showConfirmDelete ? 'Click again to confirm' : 'Delete task'}
          >
            <Trash2 size={16} className={showConfirmDelete ? 'text-destructive-foreground' : 'text-muted-foreground'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;