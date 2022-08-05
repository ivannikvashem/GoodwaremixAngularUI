import {Injectable} from '@angular/core';
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
  getAttributes(searchQuery: string, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        // .set('code', code)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('searchQuery', searchQuery)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/Attribute', opt);
  }

  getAttributeById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Attribute/'+ id, this.httpOptions);
  }

  // Log ENDPOINT

  getLogs(pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/Log', opt);
  }

  // Product ENDPOINT

  getProducts(searchQuery: string, withInternalCodeSelector: boolean, selectedSuppId: string, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('supplierId', selectedSuppId)
        .set('withInternalCode', withInternalCodeSelector ?? false)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('searchQuery', searchQuery)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/AngProduct', opt);
  }

  // Suppliers ENDPOINT

  getSuppliers(searchQuery: any, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('queryString', searchQuery)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
    };
    console.log("req: "+JSON.stringify(opt));
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/supplier', opt);
  }

  fetchDataFromSupplier(supplierName: any) {
/*    let opt = {
      params: new HttpParams()
        .set('supplierName', supplierName ?? 10)
    };
    opt = Object.assign(opt, this.httpOptions);*/
    return this.http.post<any>(this.apiURL + '/supplier/fetch/' + supplierName, {}, this.httpOptions);
  }
}
