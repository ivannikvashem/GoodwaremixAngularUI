import {Injectable, Type} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiClient {

  // Define API
   //apiURL = environment.apiURL;
   //loginServerURL = environment.loginServerURL;
  apiURL = 'http://localhost:5105/api';

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
  getAttributes(searchQuery: string, supplierId: string, pageIndex: number, pageSize: number, fixed?: boolean, sortField?: string, sortDirection?: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
        // .set('sortField', sortField)
        // .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    if (sortField && sortDirection) {
      opt.params = opt.params.append('sortField', sortField);
      opt.params = opt.params.append('sortDirection', sortDirection == "desc" ? "-1" : "1");
    }
    if (supplierId) {
      opt.params = opt.params.append('supplierId', supplierId);
    }
    //if (typeof (fixed) == "boolean") {
      opt.params = opt.params.append('fixedFilter', fixed ? fixed : false);
    //}
    console.log("props: " + JSON.stringify(opt));
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/Attribute', opt);
  }

  getAttributeById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Attribute/'+ id, this.httpOptions);
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

  getProducts(searchQuery: string, withInternalCodeSelector: boolean, selectedSuppId: string, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('supplierId', selectedSuppId)
        .set('withInternalCode', withInternalCodeSelector ?? false)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/Product', opt);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Product/' +id, this.httpOptions);
  }

  // Suppliers ENDPOINT

  getSuppliers(searchQuery: any, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/supplier', opt);
  }

  getSupplierById(supplierId: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/supplier/id/' + supplierId, this.httpOptions);
  }

  getSupplierByName(supplierName: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/supplier/' + supplierName, this.httpOptions);
  }

  fetchDataFromSupplier(supplierName: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/supplier/fetch/' + supplierName, {}, this.httpOptions);
  }

  internalCodeBindForSupplier(supplierName: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/supplier/internalBind/' + supplierName + "?action=bind", {}, this.httpOptions);
  }

  updateSupplier(supplier: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/supplier/' , {...supplier}, this.httpOptions);
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

  // INIT ENDPOINT
  fixSupplierStat() {
    return this.http.post<any>(this.apiURL + '/init/?action=fix', {}, this.httpOptions);
  }
}
