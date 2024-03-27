import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";
import {NotificationService} from "../../service/notification-service";
import {environment} from "../../../environments/environment";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {Injectable} from "@angular/core";
import {DocumentsDataSource} from "../../document/repo/DocumentsDataSource";
import {ApiResponseModel} from "../../models/service/api-response.model";

export class Filter {
  attributeName: string;
  type: string;
  attributeValues: string[] = []
}

export class SelectedFiltersList {
  attributeSearchFilters: Filter[] = [];
}

@Injectable({
  providedIn: 'root'
})

export class ProductsDataSource implements DataSource<Product> {

  private ProductListSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['searchFilter', 'supplierId', 'filter.pageNumber', 'filter.pageSize', 'attributeSearch', 'sortField', 'sortDirection', 'categoryId', 'availabilityCategory', 'isModerated', 'withInternalCode'];
  private params: HttpParamsModel[] = [];

  public loading$ = this.loadingSubject.asObservable();
  public rowCount: number = -1;
  public pageCountSize: number;
  public isCardLayout: boolean;

  constructor(private api: ApiClient, private _notyf: NotificationService, private documentsDS: DocumentsDataSource) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Product[]> {
    return this.ProductListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ProductListSubject.complete();
    this.loadingSubject.complete();
  }

  private createParamsObj(arg: IArguments, paramKeys: string[]) {
    let params: HttpParamsModel[] = [];
    for (let i = 0; i < arg.length; i++) {
      if (paramKeys[i] == 'sortDirection')
        arg[i] = (arg[i] == "desc" ? "-1" : "1")
      if (paramKeys[i] == 'filter.pageNumber')
        arg[i] = (arg[i] ? arg[i] + 1 : 1)
      if (paramKeys[i] == 'categoryId')
        arg[i] = (arg[i] == 0 ? undefined : arg[i])
      params.push(new HttpParamsModel(paramKeys[i], arg[i]));
    }
    return params;
  }

  loadPagedData(queryString: string, selectedSuppId: string, pageIndex: number, pageSize: number, selectedAttributes: any | null, sortActive: string, sortDirection: string, categoryId: string, containsCategory: boolean, isModerated: boolean, withInternalCodeSelector: boolean) {
    if (this.loadingSubject.value == true)
      return;
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);

    this.api.getRequest('Products', this.params)
      .pipe(
        tap(() => {
          this.loadingSubject.next(true);
        }),
        map((res: any) => {
          return res.body;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe(res => {
        this.getTotalRecordsCount(this.params).subscribe(count => {
          this.rowCount = count.body;
        })

        let products = res as ApiResponseModel;

        // the REAL crutch thing
        if (!this.isCardLayout) {
          for (let product of products.data as any[]) {
            if (product.documents) {
              product['documentsModel'] = [];
              this.documentsDS.getDocumentsById(product.documents, 'documentsDTO').subscribe(docs => {
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
        this.ProductListSubject.next(products.data as Product[])
        this.pageCountSize = products.data?.length;
    });
  }

  private getTotalRecordsCount(params: HttpParamsModel[]) {
    return this.api.getRequest('Products/ProductPageCount', params)
  }

  getProductById(id: string) {
    return this.api.getRequest(`Products/${id}`, [])
  }

  insertProduct(product: Product) {
    return this.api.postRequest('Products', product)
  }

  updateProduct(product: Product) {
    return this.api.putRequest('Products', product)
  }

  deleteProduct(id: string) {
    this.api.deleteRequest(`Products/${id}`).subscribe(() => {
        let newdata = this.ProductListSubject.value.filter(row => row.id != id);
        this.ProductListSubject.next(newdata);
      },
      err => {
        this._notyf.onError('Ошибка удаления товара' + environment.production ? '' : err)
      });
  }

  bindProductInternalCodeById(id: string) {
    return this.api.patchRequest(`Products/${id}/intCode`)
  }

  downloadImages(products: Product[], jpegFormat: boolean, createArchive: boolean) {
    let errorCounter = 0;
    let promises: Promise<any>[] = [];

    products.forEach((product, i) => {
      let promise = new Promise<void>((resolve) => {
        setTimeout(() => {
          let downloadObservable;
          this.params = [{key: 'jpg', value: jpegFormat}, {key: 'createArchive', value: createArchive}];
          if (product.internalCode)
            downloadObservable = this.api.getRequest(`files/internalCode/${product.internalCode}`, this.params, {
              observe: 'response',
              responseType: 'blob'
            });
          else if (product.vendorId)
            downloadObservable = this.api.getRequest(`files/vendorId/${product.vendorId}`, this.params, {
              observe: 'response',
              responseType: 'blob'
            });

          if (downloadObservable) {
            downloadObservable.pipe(map((res: any) => {
              return {
                filename: (product.internalCode || product.vendorId) + (res.body.type.includes('.') ? '' : '.') + res.body.type.split('/')[1],
                data: new Blob([res.body], {type: (createArchive ? 'application/' : 'image/') + (res.body.type.includes('.') ? res.body.type.split('/.')[1] : res.body.type.split('/')[1])})
              };
            })).subscribe({
              next: res => {
                this.downloadAction(res);
                resolve();
              },
              error: () => {
                errorCounter += 1;
                resolve();
              }
            });
          } else {
            resolve();
          }
        }, i * 200);
      });
      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      if (errorCounter > 0) {
        this._notyf.onError('Ошибка скачивания (' + errorCounter + ' товаров)')
      }
    });
  }

  downloadAsXLS(products: Product[]) {
    this.api.postRequest('Products/createFile_xlsx', products.map(x => x.id), [], {
      observe: 'response',
      responseType: 'blob'
    }).pipe(map((res: any) => {
      const currentDate = new Date();
      return {
        filename: 'Выгрузка_' + currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear() + '.' + res.body.type.split('/')[1],
        data: new Blob([res.body], {type: 'application/' + res.body.type.split('/')[1]})
      }
    })).subscribe(res => {
      this.downloadAction(res);
    })
  }

  uploadPhoto(files: File[], productId: string) {
    let formData = new FormData();
    for (const photo of files) {
      formData.append('files', photo)
    }

    return this.api.postRequest(`files/images/${productId}`, formData, [], {headers: {"ContentType": "multipart/form-data"}})
  }

  importProducts(file: File, supplierId: string) {
    let formData = new FormData();
    formData.append('file', file)
    return this.api.postRequest(`files/importXlsxFile/${supplierId}`, formData, [], {headers: {"ContentType": "multipart/form-data"}})
  }

  private downloadAction(res: any) {
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
