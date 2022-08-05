import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "./httpClient";
import {Log} from "../models/log.model";

export class LogsDataSource implements DataSource<Log> {

  private LogListSubject = new BehaviorSubject<Log[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

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

  loadPagedData(pageIndex = 1, pageSize = 10): any {
    this.loadingSubject.next(true);

    this.api.getLogs(pageIndex, pageSize)
      .pipe(
        map(res => {
          return res.body;
        }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(body => {
        this.LogListSubject.next(body.data)
        this.rowCount = body.totalRecords;
      });
  }
}
