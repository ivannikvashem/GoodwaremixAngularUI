import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "./httpClient";
import {Supplier} from "../models/supplier.model";

export class SuppliersDataSource implements DataSource<Supplier> {

  private SupplierListSubject = new BehaviorSubject<Supplier[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api: ApiClient) {  }

  connect(collectionViewer: CollectionViewer): Observable<Supplier[]> {
    return this.SupplierListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.SupplierListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(searchQuery = "", pageIndex = 0, pageSize = 10): any {
    this.loadingSubject.next(true);

    this.api.getSuppliers(searchQuery, pageIndex, pageSize)
      .pipe(
        map(res => {
          return res.body;
        }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(body => {
        this.SupplierListSubject.next(body.data)
        this.rowCount = body.totalRecords;
      });
  }
}
