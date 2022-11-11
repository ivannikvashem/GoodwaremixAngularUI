import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {SchedulerTask} from "../models/schedulerTask.model";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";
import {ApiClient} from "./httpClient";

export class SchedulerTaskDataSource implements DataSource<SchedulerTask> {

  private TaskListSubject = new BehaviorSubject<SchedulerTask[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api:ApiClient) {}

  connect(collectionViewer: CollectionViewer): Observable<SchedulerTask[]> {
    return this.TaskListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.TaskListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(pageIndex = 1, pageSize = 10, sortActive = "Date", sortDirection = "desc"):any {
    this.loadingSubject.next(true);
    console.log("Sort: " + sortActive + ", " + sortDirection);
    this.api.getTasks(pageIndex, pageSize, sortActive, sortDirection)
      .pipe(
        map(res => {
          return res.body;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(body => {
        this.TaskListSubject.next(body.data)
        this.rowCount = body.totalRecords;
      });
  }

  deleteTask(id: any) {
    console.log("deleting supp " + id);
    this.api.deleteTask(id).subscribe( res => {
        let newdata = this.TaskListSubject.value.filter(row => row.id != id );
        this.TaskListSubject.next(newdata);
      },
      err => {
        console.log(err);
      });
  }

}
