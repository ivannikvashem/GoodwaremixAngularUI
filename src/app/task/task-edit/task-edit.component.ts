import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {DataStateService} from "../../shared/data-state.service";


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
              private api:ApiClient,
              private dss:DataStateService
  ) { }

  fb:FormGroup = new FormGroup({
    nameTask: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
    configList: new FormControl(),
    startDate: new FormControl<Date | null>(null, Validators.required),
    cron: new FormControl<string>('', Validators.required),
    isEnable: new FormControl<boolean>(false, Validators.required)
  })


  ngOnInit(): void {
    if (this.data.oldTask !== undefined) {
      this.api.getSupplierById(this.data.oldTask.supplierId).subscribe(x => {
        this.supplier = x.body as Supplier;
        this.selectedSupplier = x.body;
        this.dss.setSelectedSupplier(this.supplier.id, this.supplier.supplierName);
      });
      this.selectedSupplier.id = this.data.oldTask.supplierId;
      this.fb.get('nameTask').setValue(this.data.oldTask.nameTask);
      this.fb.get('description').setValue(this.data.oldTask.description);
      this.fb.get('cron').setValue(this.data.oldTask.cron);
      this.fb.get('startDate').setValue(this.data.oldTask.startDate.toString().substring(0, this.data.oldTask.startDate.toString().length - 1));
      this.fb.get('isEnable').setValue(this.data.oldTask.isEnable);
    }
    this.dss.getSelectedSupplier().subscribe(x => {
      this.supplier = x;
    })
  }

  onSubmitClick() {
    if (this.data.oldTask !== undefined) {
      this.task.id = this.data.oldTask.id;
    }
    this.task.supplierId = this.supplier.id;
    this.task.nameTask = this.fb.get('nameTask').value;
    this.task.description = this.fb.get('description').value;
    this.task.cron = this.fb.get('cron').value;
    this.task.startDate = this.fb.get('startDate').value + 'Z';
    this.task.isEnable = this.fb.get('isEnable').value;
    this.data.newTask = this.task;
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.supplier = supplier;
  }
}
