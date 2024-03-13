import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";
import {ApiClient} from "../../service/httpClient";
import {NotificationService} from "../../service/notification-service";
import {HttpParamsModel} from "../../models/service/http-params.model";

export class SchedulerTaskDataSource implements DataSource<SchedulerTask> {

  private TaskListSubject = new BehaviorSubject<SchedulerTask[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['filter.pageNumber', 'filter.pageSize', 'sortField', 'sortDirection'];
  private params:HttpParamsModel[] = [];

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

  private createParamsObj(arg:IArguments, paramKeys:string[]) {
    let params:HttpParamsModel[] = [];
    for (let i = 0; i < arg.length; i++) {
      if (paramKeys[i] == 'sortDirection')
        arg[i] = (arg[i] == "desc" ? "-1" : "1")
      if (paramKeys[i] == 'filter.pageNumber')
        arg[i] = (arg[i] ? arg[i] + 1 : 1)
      params.push(new HttpParamsModel(paramKeys[i], arg[i]));
    }
    return params;
  }

  loadPagedData(pageIndex:number = 1, pageSize:number = 12, sortActive:string = "date", sortDirection:string = "desc"):any {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);
    this.api.getRequest('SchedulerTask', this.params)
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

  insertTask(schedulerTask:SchedulerTask) {
    return this.api.postRequest('/SchedulerTask/', schedulerTask)
  }
  updateTask(schedulerTask:SchedulerTask) {
    return this.api.putRequest('/SchedulerTask/', schedulerTask)
  }

  deleteTask(id: string) {
  this.api.deleteRequest(`SchedulerTask/${id}`).subscribe( () => {
      let newdata = this.TaskListSubject.value.filter(row => row.id != id );
      this.TaskListSubject.next(newdata);
    },
    err => {
      console.log(err);
    });
  }

  submitSchedulerTask(task:SchedulerTask) {
    if (task.id) {
      this.updateTask(task).subscribe( () => {
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
      this.insertTask(task).subscribe( id => {
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
      this.api.postRequest('Quartz/startQuartz',[id]).subscribe( {
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
      this.api.postRequest('Quartz/stopQuartz',[id]).subscribe({
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

  startTaskList(selectedTasks:string[]) {
    this.api.postRequest('Quartz/startQuartz', selectedTasks).subscribe( {
      next:() => {
        this._notyf.onSuccess('Задачи запущены')
      }, error:error => {
        this._notyf.onError('Ошибка' +JSON.stringify(error))
      }})
  }

  stopTaskList(selectedTasks:string[]) {
    this.api.postRequest('Quartz/stopQuartz',selectedTasks).subscribe({
      next:() => {
        this._notyf.onSuccess('Задачи остановлены')
      }, error:error => {
        this._notyf.onError('Ошибка' +JSON.stringify(error))
      }})
  }
}
