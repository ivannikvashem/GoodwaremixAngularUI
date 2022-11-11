import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {SchedulerTaskDataSource} from "../../repo/SchedulerTaskDataSource";
import {MatDialog} from "@angular/material/dialog";
import {TaskEditComponent} from "../shared/task-edit/task-edit.component";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-task-index',
  templateUrl: './task-index.component.html',
  styleUrls: ['./task-index.component.css']
})
export class TaskIndexComponent implements OnInit {

  displayedColumns: string[] = ['task', 'supplier', 'actions'];
  dataSource: SchedulerTaskDataSource;
  supplierId = '';

  constructor(
    public api: ApiClient,
    public dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSource = new SchedulerTaskDataSource(this.api)
    this.getTasks()
  }

  getTasks() {
    this.dataSource.loadPagedData(0,10,'date','asc')
  }

  addTask() {
    this.openTaskEditDialog()
  }

  editTask(task:any) {
    this.openTaskEditDialog(task)
  }

  openTaskEditDialog(oldTask?:any): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      data: { oldTask: oldTask, newTask: new SchedulerTask() },
      autoFocus:false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.api.updateTask(result.newTask).subscribe()
        this.getTasks()
      }
    });
  }

  deleteTask(id:string) {
    this.dataSource.deleteTask(id)
    this.getTasks()
  }

  startTask(id:string) {
    this.api.startTask(id).subscribe( x => {
      console.log('st tsk', x)
    })
    this.getTasks()
  }

  stopTask(id:string) {
    this.api.stopTask(id).subscribe( x => {
      console.log('st tsk', x)
    })
    this.getTasks()
  }
}
