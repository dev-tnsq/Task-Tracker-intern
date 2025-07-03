import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Task, TaskFilter, DeletedTask } from '@/types/task';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import TaskFilterComponent from './TaskFilter';
import ThemeToggle from './ThemeToggle';
import Snackbar from './Snackbar';
import { Plus, Search } from 'lucide-react';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskTracker_tasks', []);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletedTask, setDeletedTask] = useState<DeletedTask | null>(null);
  
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    switch (filter) {
      case 'completed':
        return filtered.filter(task => task.completed);
      case 'pending':
        return filtered.filter(task => !task.completed);
      default:
        return filtered;
    }
  }, [tasks, filter, searchTerm]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
  }), [tasks]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      task.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setShowAddForm(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete) {
      setDeletedTask({
        task: taskToDelete,
        timestamp: Date.now()
      });
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleUndoDelete = () => {
    if (deletedTask) {
      setTasks(prev => [deletedTask.task, ...prev]);
      setDeletedTask(null);
    }
  };

  const handleDismissSnackbar = () => {
    setDeletedTask(null);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    newTask: () => {
      if (!showAddForm && !editingTask) {
        setShowAddForm(true);
      }
    },
    focusSearch: () => {
      searchRef.current?.focus();
    },
    saveTask: () => {
      // This will be handled by the form's onKeyDown
    },
    escape: () => {
      if (showAddForm || editingTask) {
        setShowAddForm(false);
        setEditingTask(null);
      }
      if (searchTerm) {
        setSearchTerm('');
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Task Tracker</h1>
              <p className="text-muted-foreground">Welcome back, {username}!</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={onLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Add Task Button */}
          {!showAddForm && !editingTask && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Task
              <span className="text-xs opacity-75 ml-1">(N)</span>
            </button>
          )}
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks... (/)"
              className="form-input pl-10 w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Task Form */}
        {(showAddForm || editingTask) && (
          <div className="mb-8">
            <TaskForm
              onSubmit={editingTask ? handleEditTask : handleAddTask}
              editingTask={editingTask || undefined}
              onCancel={() => {
                setShowAddForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {/* Task Filters */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <TaskFilterComponent
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
            />
          </div>
        )}

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found for "{searchTerm}"
          </div>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {tasks.length === 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">🎯 Ready to get productive?</h3>
                    <p>Create your first task and start achieving your goals!</p>
                    <p className="text-xs mt-2 opacity-75">Press 'N' to add a new task</p>
                  </div>
                ) : searchTerm ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">🔍 No tasks match your search</h3>
                    <p>Try adjusting your search terms or create a new task.</p>
                  </div>
                ) : filter === 'completed' ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">🎉 No completed tasks yet</h3>
                    <p>Complete some tasks to see your achievements here!</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium mb-2">✨ All caught up!</h3>
                    <p>Great job! All your tasks are completed.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
                searchTerm={searchTerm}
              />
            ))
          )}
        </div>

        {/* Keyboard Shortcuts Hint */}
        {tasks.length > 0 && !showAddForm && !editingTask && (
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Keyboard shortcuts: <kbd className="px-2 py-1 bg-muted rounded">N</kbd> new task • 
            <kbd className="px-2 py-1 bg-muted rounded mx-1">/</kbd> search • 
            <kbd className="px-2 py-1 bg-muted rounded">⌘↵</kbd> save
          </div>
        )}
      </main>

      {/* Snackbar for undo delete */}
      <Snackbar
        deletedTask={deletedTask}
        onUndo={handleUndoDelete}
        onDismiss={handleDismissSnackbar}
      />
    </div>
  );
};

export default Dashboard;