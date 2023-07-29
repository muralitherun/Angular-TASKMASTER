import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task, HistoryEntry } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [TaskService]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: [null, Validators.required],
      priority: ['low', Validators.required],
      status: ['to-do', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.isEditMode) {
        // Update existing task
        const taskId = this.taskForm.get('_id')?.value;
        const taskData: Task = this.taskForm.value;
        this.taskService.updateTask(taskId, taskData).subscribe(() => {
          
          console.log('Task updated successfully!');
          this.isEditMode = false;
        });
      } else {
        // Create new task
        this.taskService.addTask(this.taskForm.value).subscribe(() => {
          
          console.log('Task added successfully!');
          window.location.reload();
        });
      }
    }
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.taskForm.enable();
  }
}