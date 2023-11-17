import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Supplier} from "../../models/supplier.model";
import {Stat} from "../../models/Stat.model";

export class SuppliersDataSource implements DataSource<Supplier> {

  private SupplierListSubject = new BehaviorSubject<Supplier[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;
  public pageCount = 0;

  constructor(private api: ApiClient) {  }

  connect(collectionViewer: CollectionViewer): Observable<Supplier[]> {
    return this.SupplierListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.SupplierListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(searchQuery:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string) {
    this.loadingSubject.next(true);
    this.api.getSuppliers(searchQuery, pageIndex, pageSize, sortActive, sortDirection)
      .pipe(
        map(res => {
          for (let supplier of res.body.data) {
            this.api.getSupplierLastStats(supplier.id).subscribe(stat => {
              if (stat.body) {
                supplier.productQty = stat.body.productQty;
                supplier.lastImport = stat.body.lastImport;
                supplier.productQtyWithCode = stat.body.productQtyWithCode;
              }
            })
          }
          return res.body;
        }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(body => {
        this.SupplierListSubject.next(body.data)
        this.rowCount = body.totalRecords;
        this.pageCount = body.data?.length;
      });
  }

  deleteSupplier(id: any) {
    this.api.deleteSupplier(id).subscribe( () => {
        let newdata = this.SupplierListSubject.value.filter(row => row.id != id );
        this.SupplierListSubject.next(newdata);
      },
      err => {
      });
  }

  deleteSupplierProducts(id: any) {
    this.api.deleteSupplierProducts(id).subscribe( () => {
        const newSuppliers = this.SupplierListSubject.getValue().map(s =>
          s.id === id
            ? { ...s, stat: new Stat() }
            : s
        );

        this.SupplierListSubject.next(newSuppliers);
      },
      err => {
      })
  }
}
