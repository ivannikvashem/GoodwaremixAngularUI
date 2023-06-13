import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";

export class Filter {
  attributeName:string;
  type:string;
  attributeValues:string[] = []
}

export class SelectedFiltersList {
  attributeSearchFilters:Filter[] = [];
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

  // loadPagedData - isCardLayout param should be removed
  loadPagedData(isCardLayout = true,queryString = "", selectedSuppId = '', pageIndex = 0, pageSize = 10, selectedAttributes:any | null, sortActive:string, sortDirection:string, withInternalCodeSelector?:boolean) {
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
        // the REAL crutch thing
        if (!isCardLayout) {
          for (let product of body.data) {
            product['documentsModel'] = [];
            this.api.getDocumentsDTOById(product.documents).subscribe(docs => {
              for (let doc of docs.body) {
                delete doc['supplierId']
                delete doc['url']
                delete doc['file']
                delete doc['id']
                product.documentsModel.push(doc)
              }
            })
          }
        }
        // the REAL crutch thing END
        this.ProductListSubject.next(body.data)
        this.rowCount = body.totalRecords;
      });
  }

  deleteProduct(id: any) {
    this.api.deleteProductById(id).subscribe( () => {
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
