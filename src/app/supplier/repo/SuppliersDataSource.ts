import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Supplier} from "../../models/supplier.model";
import {Stat} from "../../models/Stat.model";

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

  loadPagedData(searchQuery = "", pageIndex = 0, pageSize = 15, sortActive = "supplierName", sortDirection = "asc") {
    this.loadingSubject.next(true);
    this.api.getSuppliers(searchQuery, pageIndex, pageSize, sortActive, sortDirection)
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

  deleteSupplier(id: any) {
    console.log("deleting supp " + id);
    this.api.deleteSupplier(id).subscribe( res => {
        let newdata = this.SupplierListSubject.value.filter(row => row.id != id );
        this.SupplierListSubject.next(newdata);
      },
      err => {
        console.log(err);
      });
  }

  deleteSupplierProducts(id: any) {
    console.log("deleting supp " + id + " products");
    this.api.deleteSupplierProducts(id).subscribe( res => {
        console.log(JSON.stringify(res));

        const newSuppliers = this.SupplierListSubject.getValue().map(s =>
          s.id === id
            ? { ...s, stat: new Stat() }
            : s
        );

        this.SupplierListSubject.next(newSuppliers);
      },
      err => {
        console.log(err);
      })
  }
}
