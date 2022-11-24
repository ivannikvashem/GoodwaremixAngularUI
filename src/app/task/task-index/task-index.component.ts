import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {SchedulerTaskDataSource} from "../repo/SchedulerTaskDataSource";
import {MatDialog} from "@angular/material/dialog";
import {TaskEditComponent} from "../task-edit/task-edit.component";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {MatTable} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {merge, tap} from "rxjs";
import {NotificationService} from "../../service/notification-service";

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
    public dialog:MatDialog,
    private _notyf:NotificationService
  ) { this.dataSource = new SchedulerTaskDataSource(this.api,this._notyf) }
  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.

    //todo доделать нормальный pipe и обработку ошибок
    merge(this.paginator.page)
      .pipe(
        tap( () => {
          this.loadData();
        })
      )
      .subscribe();
  }

  loadData() {
    this.dataSource.loadPagedData(this.paginator?.pageIndex || 0, this.paginator?.pageSize || 10,'date','asc')
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
        this.dataSource.submitSchedulerTask(result.newTask)
      }
      this.loadData()
    });
  }

  deleteTask(id:string) {
    this.dataSource.deleteTask(id)
  }

  executeTask(id:string, isStart:boolean) {
    this.dataSource.taskOnExecute(id,isStart)
  }

}
