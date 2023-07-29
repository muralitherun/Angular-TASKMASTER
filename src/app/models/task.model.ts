export interface Task {
  _id?: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'to-do' | 'in-progress' | 'completed';
  createdAt?: Date;
  history: HistoryEntry[];
  isEdit?: boolean;
}

export interface HistoryEntry {
  timestamp: Date;
}