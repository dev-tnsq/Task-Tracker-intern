import { useState, useRef, useEffect } from 'react';
import { Task } from '@/types/task';
import { Calendar, Tag, Plus, Edit } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editingTask?: Task;
  onCancel?: () => void;
}

const TaskForm = ({ onSubmit, editingTask, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [tags, setTags] = useState<string[]>(editingTask?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        tags: tags.length > 0 ? tags : undefined,
        completed: editingTask?.completed || false,
      });
      
      if (!editingTask) {
        setTitle('');
        setDescription('');
        setDueDate('');
        setTags([]);
        setNewTag('');
        titleRef.current?.focus();
      }
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-md task-item-enter">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {editingTask ? (
          <>
            <Edit size={20} />
            Edit Task
          </>
        ) : (
          <>
            <Plus size={20} />
            Add New Task
          </>
        )}
      </h3>
      
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Task Title *
          </label>
          <input
            ref={titleRef}
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="What needs to be done?"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            placeholder="Add more details..."
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar size={16} />
            Due Date (optional)
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={getTodayDate()}
            className="form-input"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Tag size={16} />
            Tags (optional)
          </label>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span key={tag} className="task-tag group cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                  #{tag}
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                </span>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="form-input flex-1"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary"
              disabled={!newTag.trim()}
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={!title.trim()}
          >
            {editingTask ? 'Update Task' : 'Add Task'}
            <span className="text-xs opacity-75 ml-2">⌘↵</span>
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary px-6"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;