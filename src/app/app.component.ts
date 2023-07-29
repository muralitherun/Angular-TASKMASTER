import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isTaskListVisible: boolean = true;
  isTaskFormVisible: boolean = false;

  showTaskForm() {
    this.isTaskFormVisible = true;
    this.isTaskListVisible = false;
  }

  showTaskList() {
    this.isTaskFormVisible = false;
    this.isTaskListVisible = true;
  }
}