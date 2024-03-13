import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {UserInterface} from "../type/user.interface";
import {ApiClient} from "../../service/httpClient";
import {HttpParamsModel} from "../../models/service/http-params.model";

export class UsersDataSource implements DataSource<UserInterface> {

  private UserListSubject = new BehaviorSubject<UserInterface[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['filter.pageNumber', 'filter.pageSize', 'sortField', 'sortDirection'];
  private params:HttpParamsModel[] = [];

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

  loadPagedData(pageIndex = 1, pageSize = 10, sortActive = "date", sortDirection = "desc"): any {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);

    this.api.getRequest('users', this.params)
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

  onUserListUpdate(user:any) {
    if (this.UserListSubject.value.find(x => x.id == user.id)) {
      let newData = this.UserListSubject.value.map(x => {
        if (x.id === user.id) {
          return Object.assign(x, user);
        }
        return x;
      })
      this.UserListSubject.next(newData)
    } else {
      this.UserListSubject.next(this.UserListSubject.getValue().concat([user]))
    }
  }
}
