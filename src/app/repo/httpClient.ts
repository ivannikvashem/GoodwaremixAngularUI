import {Injectable, Type} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Supplier} from "../models/supplier.model";
import {environment} from '../../environments/environment';
import {Product} from "../models/product.model";
import {ProductImageViewmodel} from "../models/viewmodels/productImage.viewmodel";

@Injectable({
  providedIn: 'root'
})

export class ApiClient {
  private apiURL = environment.apiURL;
  // Define API
   //apiURL = environment.apiURL;
   //loginServerURL = environment.loginServerURL;
  //apiURL = 'http://localhost:5105/api';
  //apiURL = 'http://172.16.50.123:5105/api';
  //apiURL = 'http://172.16.41.246:5105/api';

  constructor(private http: HttpClient) { }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Authorization: 'Bearer ' + window.sessionStorage.getItem('access-token'),
      'Access-Control-Allow-Headers': 'access-control-allow-methods,access-control-allow-origin,authorization,content-type',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
    }),
    observe: 'response' as 'body' // it's possible to see response status
  };

  // Attributes ENDPOINTS
  getAttributes(searchQuery: any, supplierId: string, pageIndex: number, pageSize: number, fixed?: boolean, sortField?: string, sortDirection?: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
        // .set('sortField', sortField)
        // .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    if (sortField && sortDirection) {
      opt.params = opt.params.append('sortField', sortField);
      opt.params = opt.params.append('sortDirection', sortDirection == "desc" ? "-1" : "1");
    }
    if (supplierId != "") {
      opt.params = opt.params.append('supplierId', supplierId);
    }
    if (typeof (fixed) == "boolean") {
      opt.params = opt.params.append('fixedFilter', fixed);
    }
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/Attribute', opt);
  }

  getAttributeById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Attribute/'+ id, this.httpOptions);
  }

  swapAttribute(attributeUpdate: string, attributeDelete: string): Observable<any> {
    let body = { attributeUpdate: attributeDelete, attributeDelete: attributeUpdate };
    return this.http.post<any>(this.apiURL + '/Attribute', JSON.stringify(body), this.httpOptions);
  }

  deleteProductAttribute (id:string)  {
    return this.http.delete(this.apiURL+ '/Attribute/' + id, this.httpOptions)
  }
  // Log ENDPOINT

  getLogs(pageIndex: number, pageSize: number, sortField: string, sortDirection: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/Log', opt);
  }

  flushLogs(): Observable<boolean> {
    return this.http.delete<any>(this.apiURL + '/Log/DeleteLogs', this.httpOptions);
  }

  // Product ENDPOINT

  getProducts(searchQuery: string, withInternalCodeSelector: boolean, selectedSuppId: string, pageIndex: number, pageSize: number) {
    let opt = {
      params: new HttpParams()
        .set('supplierId', selectedSuppId)
        .set('withInternalCode', withInternalCodeSelector ?? false)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Product[]>(this.apiURL + '/Product', opt);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Product/' +id, this.httpOptions);
  }

  updateProduct(imgProduct:ProductImageViewmodel): Observable<any> {
    const formData = new FormData()
    formData.append('product', JSON.stringify(imgProduct.product))
    for (const photo of imgProduct.files) {
      console.log(photo)
      formData.append('files', photo)
    }
    return this.http.post(this.apiURL + '/product/', formData, {headers:{"ContentType": "multipart/form-data"}})
  }

  deleteProductById(productId:string) {
    return this.http.delete<any>(this.apiURL + '/product/' + productId, this.httpOptions);
  }

  // Suppliers ENDPOINT

  getSuppliers(searchQuery: any, pageIndex: number, pageSize: number, sortField: string, sortDirection: string) {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/supplier', opt);
  }

  getSupplierById(supplierId: string){
    return this.http.get<any>(this.apiURL + '/supplier/id/' + supplierId, this.httpOptions);
  }

  getSupplierByName(supplierName: string): Observable<any> {
    return this.http.get<Supplier>(this.apiURL + '/supplier/' + supplierName, this.httpOptions);
  }

  fetchDataFromSupplier(supplierName: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/supplier/fetch/' + supplierName, {}, this.httpOptions);
  }

  internalCodeBindForSupplier(supplierName: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/supplier/internalBind/' + supplierName + "?action=bind", {}, this.httpOptions);
  }

  updateSupplier(supplier: Supplier): Observable<any> {
    return this.http.post<any>(this.apiURL + '/supplier/', supplier, this.httpOptions);
  }
  //
  postSupplier(supplier: any): Observable<any> {
    let body = { ...supplier };
    return this.http.post<any>(this.apiURL + '/Supplier', body, this.httpOptions)
  }

  deleteSupplierProducts(id: any): Observable<any> {
    return this.http.delete<any>(this.apiURL + '/supplier?supplierId=' + id, this.httpOptions);
  }

  deleteSupplier(id: any): Observable<any> {
    return this.http.delete<any>(this.apiURL + '/supplier/' + id, this.httpOptions);
  }



  // //fileUpload
  // upload(file: File): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();
  //
  //   formData.append('file', file);
  //
  //   const req = new HttpRequest('POST', `${this.apiURL}/upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json'
  //   });
  //
  //   return this.http.request(req);
  // }
  //
  // getFiles(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/files`);
  // }

  downloadTableFile(table:string, supplierId:string) {
    let opt = { params: new HttpParams().set('table', table).set('supplierId', supplierId) };
    if (supplierId != "") {
      opt.params = opt.params.append('supplierId', supplierId);
    }
    opt = Object.assign(opt, {observe:'response', responseType:'blob'});

    return this.http.get(this.apiURL +'/supplier/DownloadFileJson',{observe:'response', responseType:'blob'})
  }

  // INIT ENDPOINT
  fixSupplierStat() {
    return this.http.post<any>(this.apiURL + '/init/?action=fix', {}, this.httpOptions);
  }

  fullInit() {
    return this.http.post<any>(this.apiURL + '/init/fullInit', {}, this.httpOptions);
  }
}
