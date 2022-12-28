import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {UserInterface} from "../type/user.interface";
import {ApiClient} from "../../service/httpClient";

export class UsersDataSource implements DataSource<UserInterface> {

  private UserListSubject = new BehaviorSubject<UserInterface[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api: ApiClient) {  }

  connect(collectionViewer: CollectionViewer): Observable<UserInterface[]> {
    return this.UserListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.UserListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(pageIndex = 1, pageSize = 10, sortActive = "Date", sortDirection = "desc"): any {
    this.loadingSubject.next(true);
    this.api.getUsers(pageIndex, pageSize, sortActive, sortDirection)
      .pipe(
        map(res => {
          return res.body;
        }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(body => {
        this.UserListSubject.next(body.data)
        this.rowCount = body.totalRecords;
      });
  }
}