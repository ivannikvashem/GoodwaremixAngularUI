import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {SchedulerTaskDataSource} from "../repo/SchedulerTaskDataSource";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {TaskEditComponent} from "../task-edit/task-edit.component";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {MatLegacyPaginator as MatPaginator} from "@angular/material/legacy-paginator";
import {merge, tap} from "rxjs";
import {NotificationService} from "../../service/notification-service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatLegacyTableDataSource as MatTableDataSource} from "@angular/material/legacy-table";

@Component({
  selector: 'app-task-index',
  templateUrl: './task-index.component.html',
  styleUrls: ['./task-index.component.css']
})
export class TaskIndexComponent implements OnInit {

  displayedColumns: string[] = ['select', 'status', 'task', 'supplier', 'duration', 'actions'];
  selection = new SelectionModel<SchedulerTask>(true, []);
  dataSource: SchedulerTaskDataSource;
  taskDataSource = new MatTableDataSource<SchedulerTask>()
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
    this.dataSource.connect(null).subscribe(x => {
      this.taskDataSource.data = x;
    })
  }

  addTask() {
    this.openTaskEditDialog();
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

  executeTask(id:string, state:boolean) {
    this.dataSource.taskOnExecute(id,state)
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.taskDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.taskDataSource.data);
  }

  startSelectedTasks() {
    this.dataSource.startTaskList(this.selection.selected.map(x => x.id));
  }

  stopSelectedTasks() {
    this.dataSource.stopTaskList(this.selection.selected.map(x => x.id));
  }
}
