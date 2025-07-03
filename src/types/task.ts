export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  tags?: string[];
}

export type TaskFilter = 'all' | 'completed' | 'pending';

export interface DeletedTask {
  task: Task;
  timestamp: number;
}