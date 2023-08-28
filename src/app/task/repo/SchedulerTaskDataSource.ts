import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";
import {ApiClient} from "../../service/httpClient";
import {NotificationService} from "../../service/notification-service";

export class SchedulerTaskDataSource implements DataSource<SchedulerTask> {

  private TaskListSubject = new BehaviorSubject<SchedulerTask[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api:ApiClient, private _notyf: NotificationService) {}

  connect(collectionViewer: CollectionViewer): Observable<SchedulerTask[]> {
    return this.TaskListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.TaskListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(pageIndex = 1, pageSize = 10, sortActive = "date", sortDirection = "desc"):any {
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
    this.api.deleteTask(id).subscribe( () => {
        let newdata = this.TaskListSubject.value.filter(row => row.id != id );
        this.TaskListSubject.next(newdata);
      },
      err => {
        console.log(err);
      });
  }

  submitSchedulerTask(task:SchedulerTask) {
    if (task.id) {
      this.api.updateTask(task).subscribe( () => {
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
      this.api.insertTask(task).subscribe( id => {
        let newData;
        if (task.id) {
          newData = this.TaskListSubject.value.map(x => {
            if (x.id === task.id) {
              return Object.assign(x,task)
            }
            return x;
          });
        } else {
          task.id = id.body;
          newData = this.TaskListSubject.value;
          newData.push(task)
        }
        this.TaskListSubject.next(newData)
      })
    }

  }

  taskOnExecute(id:string, state:boolean) {
    if (state) {
      this.api.startTask(id).subscribe( {
        next:() => {
          let newData = this.TaskListSubject.value.map(x => x.id === id ? {...x, isEnable:state}: x)
          this.TaskListSubject.next(newData)
          this._notyf.onSuccess('Задача запущена')
        },
        error:error => {
          this._notyf.onError('Ошибка запуска' + error)
        }
      })
    } else {
      this.api.stopTask(id).subscribe({
        next:() => {
          let newData = this.TaskListSubject.value.map(x => x.id === id ? {...x, isEnable:state}: x)
          this.TaskListSubject.next(newData)
          this._notyf.onSuccess('Задача остановлена')
        },
        error:error => {
          this._notyf.onError('Ошибка остановки' + error)
        }
      })
    }
  }

}
