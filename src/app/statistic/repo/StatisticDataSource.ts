import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {ApiClient} from "../../service/httpClient";
import {catchError, finalize, map} from "rxjs/operators";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class StatisticDataSource implements DataSource<any> {
  private StatListSubject = new BehaviorSubject<any>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['supplierId',  'sortField', 'sortDirection'];
  private params:HttpParamsModel[] = [];

  public loading$ = this.loadingSubject.asObservable();

  constructor(private api: ApiClient) {}

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.StatListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.StatListSubject.complete();
    this.loadingSubject.complete();
  }

  private createParamsObj(arg:IArguments, paramKeys:string[]) {
    let params:HttpParamsModel[] = [];
    for (let i = 0; i < arg.length; i++) {
      if (paramKeys[i] == 'sortDirection')
        arg[i] = (arg[i] == "desc" ? "-1" : "1")
      params.push(new HttpParamsModel(paramKeys[i], arg[i]));
    }
    return params;
  }

  loadData(supplierId:string, sortField:string, sortDirection:string) {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);
    this.api.getRequest('statistics', this.params)
      .pipe(
      tap( () => {
        this.loadingSubject.next(true)
      }),
      map((res:any) => {
        return res.body;
      }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(body => {
        this.StatListSubject.next(body);
      });
  }

  getTotalStats() {
    return this.api.getRequest('statistics/total', []);
  }

  getSupplierLastStats(supplierId:string) {
    return this.api.getRequest(`statistics/LastSupplierStatistic/${supplierId}`, [])
  }
}
