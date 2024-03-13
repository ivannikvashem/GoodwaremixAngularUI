import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Log} from "../models/log.model";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {ApiResponseModel} from "../../models/service/api-response.model";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})

export class LogsDataSource implements DataSource<Log> {

  private LogListSubject = new BehaviorSubject<Log[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['searchFilter', 'filter.pageNumber', 'filter.pageSize', 'sortField', 'sortDirection'];
  private params:HttpParamsModel[] = [];


  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api: ApiClient) {  }

  connect(collectionViewer: CollectionViewer): Observable<Log[]> {
    return this.LogListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.LogListSubject.complete();
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

  loadPagedData(supplierId:string, pageIndex:number = 1, pageSize:number = 12, sortActive:string =  "date", sortDirection:string = "desc") {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);

    this.api.getRequest('Logs', this.params)
      .pipe(
        map(res => {
          return res.body;
        }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe((body:ApiResponseModel) => {
        this.LogListSubject.next(body.data as Log[])
        this.rowCount = body.totalRecords;
      });
  }

  getLogsRequest() {
    return this.api.getRequest('logs', [])
  }

  deleteAllLogs() {
    this.api.deleteRequest('Logs').subscribe( {next: () => {
        let newdata = new Array<Log>();
        this.LogListSubject.next(newdata);
      },
      error: err => {
        //this._notyf.onError(err.message)
      }});
  }
}
