import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";

export class SelectedFilterAttributes {
  attributeName:string
  selectedValues:string[] = []
}

export class ProductsDataSource implements DataSource<Product> {

  private ProductListSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api: ApiClient) {}

  connect(collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.ProductListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ProductListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(queryString = "", withInternalCodeSelector = false, selectedSuppId = '', pageIndex = 0, pageSize = 10, selectedAttributes:SelectedFilterAttributes[]) {
    this.loadingSubject.next(true);
    this.api.getProducts(queryString, withInternalCodeSelector, selectedSuppId, pageIndex, pageSize, selectedAttributes)
      .pipe(
        tap(() => {
          this.loadingSubject.next(true);
        }),
        map((res:any) => {
          return res.body;
        }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(body => {
        this.ProductListSubject.next(body.data)
        this.rowCount = body.totalRecords;
      });
  }

  deleteProduct(id: any) {
    console.log("deleting product " + id);
    this.api.deleteProductById(id).subscribe( res => {
        let newdata = this.ProductListSubject.value.filter(row => row.id != id );
        this.ProductListSubject.next(newdata);
      },
      err => {
        //this._notyf.onError(err.message)
      });
  }

}