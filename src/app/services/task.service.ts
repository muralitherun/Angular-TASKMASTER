import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://violet-tick-veil.cyclic.app/tasks';

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map(tasks => {
        return tasks.map(task => {
          return {
            ...task,
            dueDate: new Date(task.dueDate) // CONVERRSION: 'dueDate' string to a 'Date' object
          };
        });
      })
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(taskId: string, taskData: Task): Observable<any> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.put(url, taskData);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${taskId}`);
  }
}