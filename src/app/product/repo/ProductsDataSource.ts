import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";
import {NotificationService} from "../../service/notification-service";
import {environment} from "../../../environments/environment";

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
  public pageCountSize:number;

  constructor(private api: ApiClient, private _notyf:NotificationService) {}

  connect(collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.ProductListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ProductListSubject.complete();
    this.loadingSubject.complete();
  }

  // loadPagedData - isCardLayout param should be removed
  loadPagedData(isCardLayout = true,queryString = "", selectedSuppId = '', pageIndex = 0, pageSize = 10, selectedAttributes:any | null, sortActive:string, sortDirection:string, isModerated:boolean, withInternalCodeSelector:boolean) {
    if (this.loadingSubject.value == true)
      return;
    this.loadingSubject.next(true);
    this.api.getProducts(queryString, selectedSuppId, pageIndex, pageSize, selectedAttributes, sortActive, sortDirection, isModerated, withInternalCodeSelector)
      .pipe(
        tap(() => {
          this.loadingSubject.next(true);
        }),
        map((res:any) => {
          return res.body;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe(body => {
        // the REAL crutch thing
        if (!isCardLayout) {
          for (let product of body.data) {
            if (product.documents) {
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
        }
        // the REAL crutch thing END
        this.ProductListSubject.next(body.data)
        this.rowCount = body.totalRecords;
        this.pageCountSize = body.data.length;
      });
  }

  deleteProduct(id: any) {
    this.api.deleteProductById(id).subscribe( () => {
        let newdata = this.ProductListSubject.value.filter(row => row.id != id );
        this.ProductListSubject.next(newdata);
      },
      err => {
        this._notyf.onError('Ошибка удаления товара' + environment.production ? '' : err)
      });
  }

  downloadImages(products:Product[]) {
    products.forEach((product, i) => {
      setTimeout(() => {
        if (product.internalCode) {
          this.api.downloadProductImageByIC(product.internalCode).pipe(map( (res:any) => {
            return {filename: product.internalCode, data: new Blob([res], {type: 'image/' + res.type.split('/')[1]})}
          })).subscribe(res => {
            this.imgDownloadAction(res);
          })
        }
        else if (product.vendorId) {
          this.api.downloadProductImageByVendorId(product.vendorId).pipe(map((res:any) => {
            return {filename: product.vendorId, data: new Blob([res], {type: 'image/' + res.type.split('/')[1]})}
          })).subscribe(res => {
            this.imgDownloadAction(res);
          })
        }
      }, i * 200)
    })
  }

  private imgDownloadAction(res:any) {
    if (res.data) {
      let url = window.URL.createObjectURL(res.data);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = res.filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
