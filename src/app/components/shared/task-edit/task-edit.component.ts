import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SchedulerTask} from "../../../models/schedulerTask.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Supplier} from "../../../models/supplier.model";
import {ApiClient} from "../../../repo/httpClient";

export interface DialogData {
  newTask?: SchedulerTask;
  oldTask?: SchedulerTask;
}

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {

  task:SchedulerTask = new SchedulerTask()
  selectedSupplier:Supplier = new Supplier()
  supplier:Supplier = new Supplier()

  constructor(public dialogRef:MatDialogRef<TaskEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data:DialogData,
              private api:ApiClient
  ) { }

  fb:FormGroup = new FormGroup({
    nameTask: new FormControl(),
    description: new FormControl(),
    configList: new FormControl(),
    startAt: new FormControl(),
    hours: new FormControl(),
    minutes: new FormControl(),
    seconds: new FormControl(),
    isEnable: new FormControl()
  })

  ngOnInit(): void {
    if (this.data.oldTask !== undefined) {
      this.api.getSupplierById(this.data.oldTask.supplierId).subscribe(x => {
        this.supplier = x.body as Supplier
      })
      this.selectedSupplier.id = this.data.oldTask.supplierId
      this.fb.get('nameTask').setValue(this.data.oldTask.nameTask)
      this.fb.get('description').setValue(this.data.oldTask.description)
      this.fb.get('startAt').setValue(this.data.oldTask.startAt)
      this.fb.get('hours').setValue(this.data.oldTask.hours)
      this.fb.get('minutes').setValue(this.data.oldTask.minutes)
      this.fb.get('seconds').setValue(this.data.oldTask.seconds)
    }
  }

  onSubmitClick() {
    if (this.data.oldTask !== undefined) {
      this.task.id = this.data.oldTask.id
    }
    this.task.supplierId = this.supplier.id
    this.task.nameTask = this.fb.get('nameTask').value
    this.task.description = this.fb.get('description').value
    this.task.startAt = this.fb.get('startAt').value
    this.task.hours = this.fb.get('hours').value
    this.task.minutes = this.fb.get('minutes').value
    this.task.seconds = this.fb.get('seconds').value
    this.data.newTask = this.task
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.supplier = supplier;
  }
}
