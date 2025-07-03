import { TaskFilter as FilterType } from '@/types/task';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`filter-pill ${
            currentFilter === filter.key ? 'filter-pill-active' : 'filter-pill-inactive'
          }`}
        >
          {filter.label}
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            currentFilter === filter.key 
              ? 'bg-primary-foreground text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;