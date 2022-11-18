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

  taskOnChange(task:SchedulerTask) {
    console.log(task.id)
    if (task.id !== undefined) {
      console.log('in update')
      this.api.updateTask(task).subscribe( res => {
        let newData;
        if (task.id) {
          newData = this.TaskListSubject.value.map(x => {
            if (x.id === task.id) {
              return Object.assign(x,task)
            }
            return x;
          });
        } else {
          newData = this.TaskListSubject.value;
          newData.push(task)
        }
        this.TaskListSubject.next(newData)
      })
    } else {
      console.log('in insert')
      this.api.insertTask(task).subscribe( res => {
        let newData;
        if (task.id) {
          newData = this.TaskListSubject.value.map(x => {
            if (x.id === task.id) {
              return Object.assign(x,task)
            }
            return x;
          });
        } else {
          newData = this.TaskListSubject.value;
          newData.push(task)
        }
        this.TaskListSubject.next(newData)
      })
    }

  }

  taskOnExecute(id:string, isStart:boolean) {
    if (isStart) {
      this.api.startTask(id).subscribe(resp => {
        let newData = this.TaskListSubject.value.map(x => x.id === id ? {...x, isEnable:isStart}: x)
        this.TaskListSubject.next(newData)
      })
    } else {
      this.api.stopTask(id).subscribe(resp => {
        let newData = this.TaskListSubject.value.map(x => x.id === id ? {...x, isEnable:isStart}: x)
        this.TaskListSubject.next(newData)
      })
    }
  }

}
