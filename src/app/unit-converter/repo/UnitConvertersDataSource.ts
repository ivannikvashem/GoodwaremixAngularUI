import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {UnitConverter} from "../../models/unitConverter.model";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class UnitConvertersDataSource implements DataSource<UnitConverter> {

  private UnitConverterListSubject = new BehaviorSubject<UnitConverter[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['searchFilter',  'filter.pageNumber', 'filter.pageSize'];
  private params:HttpParamsModel[] = [];

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api: ApiClient) {  }

  connect(collectionViewer: CollectionViewer): Observable<UnitConverter[]> {
    return this.UnitConverterListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.UnitConverterListSubject.complete();
    this.loadingSubject.complete();
  }

  private createParamsObj(arg:IArguments, paramKeys:string[]) {
    let params:HttpParamsModel[] = [];
    for (let i = 0; i < arg.length; i++) {
      if (paramKeys[i] == 'filter.pageNumber')
        arg[i] = (arg[i] ? arg[i] + 1 : 1)
      params.push(new HttpParamsModel(paramKeys[i], arg[i]));
    }
    return params;
  }

  loadPagedData(searchQuery:string, pageIndex:number, pageSize:number): any {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);
    this.api.getRequest('unitConverter', this.params)
      .pipe(
        map(res => {
          return res.body;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(body => {
        this.UnitConverterListSubject.next(body.data)
        this.rowCount = body.totalRecords;
      });
  }

  insertUnitConverter(unit:UnitConverter) {
    // would like to get id after unit was added
    this.api.putRequest('unitConverter', unit).subscribe((x:any) => {
      unit.id = x.body;
      this.UnitConverterListSubject.next(this.UnitConverterListSubject.getValue().concat([unit]))
    })
  }

  updateUnitConverter(unit:UnitConverter) {
    this.api.postRequest('unitConverter', unit).subscribe();
  }

  deleteUnitConverter(unitId:string) {
    this.api.deleteRequest(`unitConverter/delete/${unitId}`).subscribe({
      next: () => {
        this.UnitConverterListSubject.next(this.UnitConverterListSubject.value.filter(x => x.id !== unitId))
      }
    });
  }
}
