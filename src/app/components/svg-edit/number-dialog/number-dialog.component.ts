import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-number-dialog',
  templateUrl: './number-dialog.component.html',
  styleUrls: ['./number-dialog.component.css']
})
export class NumberDialogComponent {
  selectedNumber: number | null = null;
  selectedDirection: string = 'N'; // ✅ Default value
  directions: string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; // ✅ Ensure it's an array

  constructor(
    public dialogRef: MatDialogRef<NumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmSelection(): void {
    this.dialogRef.close({
      number: this.selectedNumber,
      direction: this.selectedDirection, // ✅ Should now update correctly
    });
  }
}
