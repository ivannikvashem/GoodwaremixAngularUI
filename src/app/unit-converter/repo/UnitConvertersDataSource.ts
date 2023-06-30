import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {UnitConverter} from "../../models/unitConverter.model";

export class UnitConvertersDataSource implements DataSource<UnitConverter> {

  private UnitConverterListSubject = new BehaviorSubject<UnitConverter[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

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

  loadPagedData(searchQuery:string, pageIndex:number, pageSize:number): any {
    this.loadingSubject.next(true);
    this.api.getConverterUnits(searchQuery, pageIndex, pageSize)
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

  addUnitConverter(unit:UnitConverter) {
    // would like to get id after unit was added
    this.api.addConverterUnit(unit).subscribe((x:any) => {
      unit.id = x.body;
      this.UnitConverterListSubject.next(this.UnitConverterListSubject.getValue().concat([unit]))
    })

  }

  updateUnitConverter(unit:UnitConverter) {
    this.api.updateConverterUnit(unit).subscribe();
  }

  deleteUnitConverter(unitId:string) {
    this.api.deleteConverterUnit(unitId).subscribe({
      next: () => {
        this.UnitConverterListSubject.next(this.UnitConverterListSubject.value.filter(x => x.id !== unitId))
      }
    });
  }
}
