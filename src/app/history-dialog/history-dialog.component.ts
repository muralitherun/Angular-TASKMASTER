import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoryEntry } from '../models/task.model';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.css']
})
export class HistoryDialogComponent {
  history: HistoryEntry[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { history: HistoryEntry[] }) {
    console.log('History dialog opened. History entries:', data.history);
    this.history = data.history;
  }  
}