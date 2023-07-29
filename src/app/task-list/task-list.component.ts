import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { HistoryDialogComponent } from '../history-dialog/history-dialog.component';

type PriorityOrder = { [priority: string]: number };

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'dueDate', 'priority', 'status', 'actions'];
  tasks!: MatTableDataSource<Task>;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchAllTasks();
  }

  fetchAllTasks() {
    this.taskService.getAllTasks().subscribe(
      (tasks: Task[]) => {
        this.tasks = new MatTableDataSource(tasks);
        this.tasks.sort = this.sort;
      },
      (error: any) => {
        console.log('Error fetching tasks:', error);
      }
    );
  }

  editTask(task: Task) {
    task.isEdit = true;
  }

  saveTask(task: Task) {
    task.isEdit = false;
    const taskId = task._id;
    if (!taskId) {
      console.error('Task ID is undefined');
      return;
    }
    const taskData: Task = { ...task }; 
    this.taskService.updateTask(taskId, taskData).subscribe(
      (updatedTask) => {
        console.log('Task updated successfully:', updatedTask);
        this.openHistoryDialog(updatedTask);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  cancelEdit(task: Task) {
    task.isEdit = false;
  }

  deleteTask(task: Task) {
    if (!task || !task._id) {
      console.error('Invalid task data:', task);
      return;
    }

    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task._id).subscribe(
        () => {
          console.log('Task deleted successfully:', task._id);
          
          this.fetchAllTasks();
        },
        (error) => {
          console.error('Error deleting task:', error);
        }
      );
    }
  }

  
  exportTasksToCSV() {
    const csvContent = this.convertTasksToCSV(); 
    this.downloadCSV(csvContent); 
  }

 
  convertTasksToCSV(): string {
    const tasksCSV = [
      ['Title', 'Description', 'Due Date', 'Priority', 'Status'],
      ...this.tasks.data.map((task) => [
        task.title,
        task.description,
        task.dueDate.toISOString(), 
        task.priority,
        task.status,
      ]),
    ];

    
    return tasksCSV.map((row) => row.join(',')).join('\n');
  }

  
  downloadCSV(csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  
  openHistoryDialog(task: Task): void {
    this.dialog.open(HistoryDialogComponent, {
      data: {
        history: task.history || [], 
      },
    });
  }

  
  viewHistory(task: Task): void {
    this.openHistoryDialog(task);
  }

  
  sortTasksByDueDate(sortOrder: 'asc' | 'desc') {
    const sort: Sort = { active: 'dueDate', direction: sortOrder }; 
    this.onSortChange(sort); 
  }

  onSortChange(sort: Sort) {
    const data = this.tasks.data.slice(); 
    if (!sort.active || sort.direction === '') {
      this.tasks.data = data; 
      return;
    }

    this.tasks.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      if (sort.active === 'dueDate') {
        return this.compareDates(new Date(a.dueDate), new Date(b.dueDate), isAsc);
      }
      return 0;
    });
  }


  compareDates(a: Date, b: Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


  handleActionClick(action: (task: Task) => void, task: Task) {
    action(task);
  }
  
}