import {Injectable, Type} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Supplier} from "../models/supplier.model";
import {environment} from '../../environments/environment';
import {Product} from "../models/product.model";
import {ProductImageViewmodel} from "../models/viewmodels/productImage.viewmodel";
import {Attribute} from "../models/attribute.model";
import {SchedulerTask} from "../models/schedulerTask.model";
import {resourceChangeTicket} from "@angular/compiler-cli/src/ngtsc/core";

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
    return this.http.get<any>(this.apiURL + '/Attributes', opt);
  }


  getAttributeById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Attributes/'+ id, this.httpOptions);
  }

  swapAttribute(sourceId: string, destId: string): Observable<any> {
    return this.http.post<any>(this.apiURL + '/Attributes/' + sourceId + '/swap/' + destId, {}, this.httpOptions);
  }

  switchFixAttribute(id: string): Observable<any> {
    return this.http.post<any>(this.apiURL + '/Attributes/' + id + '/fix/', {}, this.httpOptions);
  }

  updateAttribute (attribute: Attribute) {
    return this.http.post<any>(this.apiURL + '/Attributes/', attribute, this.httpOptions);
  }

  deleteAttribute (id: string) {
    return this.http.delete<any>(this.apiURL + '/Attributes/' + id, this.httpOptions);
  }

  deleteProductAttribute (id:string)  {
    return this.http.delete(this.apiURL+ '/Attributes/' + id, this.httpOptions)
  }
  // Log ENDPOINT
  getLogs(supplierId:string, pageIndex: number, pageSize: number, sortField: string, sortDirection: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('searchFilter', supplierId)
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/Logs', opt);
  }

  flushLogs(): Observable<boolean> {
    return this.http.delete<any>(this.apiURL + '/Logs', this.httpOptions);
  }

  // Product ENDPOINT
  getProducts(searchQuery: string, withInternalCodeSelector: boolean, selectedSuppId: string, pageIndex: number, pageSize: number, attributes:any) {
    let opt = {
      params: new HttpParams()
        .set('supplierId', selectedSuppId)
        .set('withInternalCode', withInternalCodeSelector ?? false)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
        .set('',attributes)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Product[]>(this.apiURL + '/Products/', opt);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Products/' +id, this.httpOptions);
  }

  bindProductInternalCodeById(id: string): Observable<any> {
    return this.http.patch<any>(this.apiURL + '/Products/' + id + '/intCode', this.httpOptions);
  }

  insertProduct(imgProduct:ProductImageViewmodel): Observable<any> {
    const formData = new FormData()
    formData.append('product', JSON.stringify(imgProduct.product))
/*    for (const photo of imgProduct.files) {
      console.log(photo)
      formData.append('files', photo)
    }*/
    return this.http.post(this.apiURL + '/Products/', formData, {headers:{"ContentType": "multipart/form-data"}, responseType: 'text'});
  }

  updateProduct(imgProduct:ProductImageViewmodel): Observable<any> {
    const formData = new FormData()
    formData.append('product', JSON.stringify(imgProduct.product))
    for (const photo of imgProduct.files) {
      console.log(photo)
      formData.append('files', photo)
    }
    return this.http.put(this.apiURL + '/Products/', formData, {headers:{"ContentType": "multipart/form-data"}})
  }

  deleteProductById(productId:string) {
    return this.http.delete<any>(this.apiURL + '/Products/' + productId, this.httpOptions);
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
    return this.http.get<any>(this.apiURL + '/suppliers', opt);
  }

  getSupplierById(supplierId: string){
    return this.http.get<any>(this.apiURL + '/suppliers/' + supplierId, this.httpOptions);
  }

  fetchDataFromSupplier(supplierName: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/suppliers/FetchList/' + supplierName, {}, this.httpOptions);
  }

  stopFetchDataFromSupplier(supplierName: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/suppliers/fetchStop/' + supplierName, {}, this.httpOptions);
  }

  internalCodeBindForSupplier(id: string): Observable<any> {
    return this.http.post<any>(this.apiURL + '/suppliers/internalBind/' + id, {}, this.httpOptions);
  }

  updateSupplier(supplier: Supplier): Observable<any> {
    return this.http.post<any>(this.apiURL + '/suppliers/', supplier, this.httpOptions);
  }

  postSupplier(supplier: any): Observable<any> {
    let body = { ...supplier };
    return this.http.post<any>(this.apiURL + '/suppliers', body, this.httpOptions)
  }

  deleteSupplierProducts(id: any): Observable<any> {
    return this.http.delete<any>(this.apiURL + '/suppliers/' + id + '/products/', this.httpOptions);
  }

  deleteSupplier(id: any): Observable<any> {
    return this.http.delete<any>(this.apiURL + '/suppliers/' + id, this.httpOptions);
  }

  //TASK ENDPOINT
  getTasks(pageIndex: number, pageSize: number, sortField: string, sortDirection: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/SchedulerTask', opt);
  }

  updateTask(schedulerTask: SchedulerTask): Observable<any> {
    return this.http.post<any>(this.apiURL + '/SchedulerTask/', schedulerTask, this.httpOptions)
  }

  deleteTask(id:string): Observable<any> {
    return this.http.delete(this.apiURL + '/SchedulerTask/' + id, this.httpOptions);
  }

  startTask(id:string): Observable<any> {
    return this.http.post(this.apiURL + '/Quartz/startQuartz/' + id, this.httpOptions)
  }

  stopTask(id:string): Observable<any> {
    return this.http.post(this.apiURL + '/Quartz/stopQuartz/' + id, this.httpOptions)
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


  // DOWNLOAD FILE ENDPOINT
  downloadTableFile(table:string, supplierId:string) {
    let opt = { params: new HttpParams().set('table', table) };
    if (supplierId) {
      opt.params = opt.params.append('supplierId', supplierId);
    }
    opt = Object.assign(opt, {observe:'response', responseType:'blob'});
    console.log('options', opt)
    return this.http.get(this.apiURL + '/suppliers/DownloadFileJson',opt)
  }

  // INIT ENDPOINT
  fixSupplierStat() {
    return this.http.post<any>(this.apiURL + '/service/cleanstat', {}, this.httpOptions);
  }

  fullInit() {
    return this.http.post<any>(this.apiURL + '/service/init', {}, this.httpOptions);
  }

  checkImageStatusCode(url:string) {
    return this.http.get(url)
  }
}
