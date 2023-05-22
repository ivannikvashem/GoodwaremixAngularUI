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
  public rowCount:number = -1;

  constructor(private api: ApiClient) {}

  connect(collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.ProductListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ProductListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(queryString = "", selectedSuppId = '', pageIndex = 0, pageSize = 10, selectedAttributes:SelectedFilterAttributes[], sortActive:string, sortDirection:string, withInternalCodeSelector?:boolean) {
    this.loadingSubject.next(true);
    this.api.getProducts(queryString, selectedSuppId, pageIndex, pageSize, selectedAttributes, sortActive, sortDirection, withInternalCodeSelector)
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

  downloadImages(internalCode:string) {
    if (internalCode) {
      const downloadAction = document.createElement('a')
      downloadAction.target = '_blank'
      downloadAction.href = 'http://172.16.41.56:5105/api/files/internalCode/' + internalCode
      downloadAction.click()
    }
  }

}
