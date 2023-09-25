import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Supplier} from "../models/supplier.model";
import {environment} from '../../environments/environment';
import {Product} from "../models/product.model";
import {Attribute} from "../models/attribute.model";
import {SchedulerTask} from "../models/schedulerTask.model";
import {AuthService} from "../auth/service/auth.service";
import {UnitConverter} from "../models/unitConverter.model";

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

  constructor(private http: HttpClient, private auth: AuthService) { }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
       Authorization: 'Bearer ' + this.auth.getToken(),
      'Access-Control-Allow-Headers': 'access-control-allow-methods,access-control-allow-origin,authorization,content-type',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
    }),
    observe: 'response' as 'body' // it's possible to see response status
  };

  //#region Attributes ENDPOINTS
  getAttributes(searchQuery: any, supplierId: string, pageIndex: number, pageSize: number, fixed?: boolean, sortField?: string, sortDirection?: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('searchFilter', searchQuery)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    if (sortField && sortDirection) {
      opt.params = opt.params.append('sortField', sortField);
      opt.params = opt.params.append('sortDirection', sortDirection == "desc" ? "-1" : "1");
    }
    if (supplierId != null) {
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

  swapAttribute(sourceId: string, destId: string, convertId?:string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('sourceId', sourceId)
        .set('destionationId', destId)
    };
    if (convertId != undefined && convertId != null) {
      opt.params = opt.params.append('convertId', convertId)
    }

    opt = Object.assign(opt, this.httpOptions);
    return this.http.post<any>(this.apiURL + '/Attributes/swap/', {}, opt);
  }

  switchFixAttribute(id: string): Observable<any> {
    return this.http.post<any>(this.apiURL + '/Attributes/' + id + '/fix/', {}, this.httpOptions);
  }

  insertAttribute (attribute: Attribute) {
    return this.http.post<any>(this.apiURL + '/Attributes/', attribute, this.httpOptions);
  }

  updateAttribute (attribute: Attribute) {
    return this.http.put<any>(this.apiURL + '/Attributes/', attribute, this.httpOptions);
  }

  deleteAttribute (id: string) {
    return this.http.delete<any>(this.apiURL + '/Attributes/' + id, this.httpOptions);
  }

  deleteProductAttribute (id:string)  {
    return this.http.delete(this.apiURL+ '/Attributes/' + id, this.httpOptions)
  }
  //#endregion

  //#region Log ENDPOINT
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

  //#endregion

  //#region Product ENDPOINT
  getProducts(searchQuery: string, selectedSuppId: string, pageIndex: number, pageSize: number, attributes:any, sortField:string, sortDirection:string, isVerified?:boolean, withInternalCodeSelector?: boolean) {
    let opt = {
      params: new HttpParams()
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };

    if (selectedSuppId)
      opt.params = opt.params.append('supplierId', selectedSuppId);
    if (searchQuery)
      opt.params = opt.params.append('searchFilter', searchQuery);
    if (typeof (isVerified) == "boolean")
      opt.params = opt.params.append('isChange', isVerified);
    if (typeof (withInternalCodeSelector) == "boolean")
      opt.params = opt.params.append('withInternalCode', withInternalCodeSelector);
    if (sortField)
      opt.params = opt.params.append('sortField', sortField);
    if (attributes.attributeSearchFilters?.length > 0)
      opt.params = opt.params.append('attributeSearch', JSON.stringify(attributes))
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Product[]>(this.apiURL + '/Products/', opt);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Products/' +id, this.httpOptions);
  }

  bindProductInternalCodeById(id: string): Observable<any> {
    //also possible to extract internal name here and on API
    return this.http.patch<any>(this.apiURL + '/products/' + id + '/intCode', this.httpOptions);
  }

  insertProduct(product:Product): Observable<any> {
    return this.http.put(this.apiURL + '/Products/', product, this.httpOptions);
  }

  updateProduct(product:Product): Observable<any> {
    return this.http.post(this.apiURL + '/Products/', product, this.httpOptions)
  }

  deleteProductById(productId:string) {
    return this.http.delete<any>(this.apiURL + '/Products/' + productId, this.httpOptions);
  }
  //#endregion

  //#region Suppliers ENDPOINT

  getSuppliers(searchQuery: any, pageIndex: number, pageSize: number, sortField: string, sortDirection: string) {
    let opt = {
      params: new HttpParams()
        .set('pagination.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pagination.pageSize', pageSize ?? 15)
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

  insertSupplier(supplier: Supplier): Observable<any> {
    return this.http.post<any>(this.apiURL + '/suppliers/', supplier, this.httpOptions);
  }

  updateSupplier(supplier: Supplier): Observable<any> {
    return this.http.put<any>(this.apiURL + '/suppliers/', supplier, this.httpOptions);
  }

  postSupplier(supplier: any): Observable<any> {
    let body = { ...supplier };
    return this.http.post<any>(this.apiURL + '/suppliers', body, this.httpOptions)
  }

  deleteSupplierProducts(id: any): Observable<any> {
    return this.http.delete<any>(this.apiURL + '/products/' + id + '/products', this.httpOptions);
  }

  deleteSupplier(id: any): Observable<any> {
    return this.http.delete<any>(this.apiURL + '/suppliers/' + id, this.httpOptions);
  }

  getBrands(searchQuery: any) {
    let opt = {
      params: new HttpParams()
        .set('searchFilter', searchQuery)
    }
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get(this.apiURL+ '/Suppliers/Brend', opt)
  }

  //#endregion

  //#region TASK ENDPOINT

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

  insertTask(schedulerTask:SchedulerTask): Observable<any> {
    return this.http.post<any>(this.apiURL + '/SchedulerTask/', schedulerTask, this.httpOptions)
  }

  updateTask(schedulerTask: SchedulerTask): Observable<any> {
    return this.http.put<any>(this.apiURL + '/SchedulerTask/', schedulerTask, this.httpOptions)
  }

  deleteTask(id:string): Observable<any> {
    return this.http.delete(this.apiURL + '/SchedulerTask/' + id, this.httpOptions);
  }

  startTask(id:string): Observable<any> {
    return this.http.post(this.apiURL + '/Quartz/startQuartz/' + id, this.httpOptions)
  }

  stopTask(id:string): Observable<any> {
    return this.http.get(this.apiURL + '/Quartz/stopQuartz/' + id, this.httpOptions)
  }

  //#endregion

  //uploadPhoto
  uploadPhoto(files: File[], productId:string): Observable<any> {
    let formData = new FormData();
    for (const photo of files) {
      formData.append('files', photo)
    }
    return this.http.post(this.apiURL + '/files/images/'+productId, formData, {headers:{"ContentType": "multipart/form-data"}})
  }
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
    return this.http.get(this.apiURL + '/suppliers/DownloadFileJson',opt)
  }

  // INIT ENDPOINT
  fixSupplierStat() {
    return this.http.post<any>(this.apiURL + '/service/cleanstat', {}, this.httpOptions);
  }

  fullInit() {
    return this.http.post<any>(this.apiURL + '/service/initOld', {}, this.httpOptions);
  }

  checkImageStatusCode(url:string) {
    return this.http.get(url)
  }

  //#region User ENDPOINT
  getUsers(pageIndex: number, pageSize: number, sortField: string, sortDirection: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/users', opt);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/users/' + id, this.httpOptions);
  }

  addUser(user: any): Observable<any> {
    delete user.id;
    delete user.lastLogin;
    console.log("SENDING: " + JSON.stringify(user));
    return this.http.post(this.apiURL + '/users/', user, this.httpOptions);
  }

  updateUser(id: string, user: any): Observable<any> {
    console.log(JSON.stringify(user));
    return this.http.post(this.apiURL + '/users/' + id, user, this.httpOptions);
  }

  deleteUser(id: string) {
    return this.http.delete(this.apiURL + '/users/' + id, this.httpOptions);
  }
  //#endregion

  //#region Document ENDPOINT
  getDocuments(searchString:string, pageIndex: number, pageSize: number, supplierId:string, sortField: string, sortDirection: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('searchFilter', searchString)
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection == "desc" ? "-1" : "1")
    };
    if (supplierId != undefined) {
      opt.params = opt.params.append('supplierId', supplierId);
    }
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/documents', opt);
  }

  getDocumentById(id:string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/documents/document/' + id, this.httpOptions);
  }

  getDocumentsDTOById(ids:string[]): Observable<any> {
    let query = ''
    for (let id of ids) {
      query += 'documentsId='+id+'&'
    }
    return this.http.get<any>(this.apiURL + '/documents/documentsDTO?' + query, this.httpOptions);
  }

  getDocumentsById(ids:string[]): Observable<any> {
    let query = ''
    for (let id of ids) {
      query += 'documentsId='+id+'&'
    }
    return this.http.get<any>(this.apiURL + '/documents/documents?' + query, this.httpOptions);
  }

  addDocument(document:any): Observable<any> {
    return this.http.post(this.apiURL + '/documents/', document, this.httpOptions);
  }

  updateDocument(document:any): Observable<any> {
    return this.http.put(this.apiURL + '/documents/', document, this.httpOptions);
  }

  deleteDocument(id:string) {
    return this.http.delete(this.apiURL + '/documents/documentDelete/' + id, this.httpOptions);
  }

  uploadDocument(file: File, documentId:string): Observable<any> {
    let formData = new FormData();
    formData.append('file', file)
    return this.http.post(this.apiURL + '/files/documents/'+documentId, formData, {headers:{"ContentType": "multipart/form-data"}})
  }
  //#endregion

  //#region UnitConverter ENDPOINT
  getConverterUnits(searchString:string, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('searchFilter', searchString)
        .set('filter.pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('filter.pageSize', pageSize ?? 10)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get(this.apiURL + '/unitConverter', opt)
  }

  addConverterUnit(unit:UnitConverter) {
    return this.http.put(this.apiURL + '/unitConverter/', unit, this.httpOptions);
  }

  updateConverterUnit(unit:UnitConverter) {
    return this.http.post(this.apiURL + '/unitConverter/', unit, this.httpOptions);
  }

  deleteConverterUnit(id:string) {
    return this.http.delete(this.apiURL + '/unitConverter/delete/' + id, this.httpOptions);
  }
  //#endregion

  checkIfServerAlive(): Observable<any> {
    return this.http.get(this.apiURL + '/logs', this.httpOptions)
  }

  getSupplierStats(supplierId:string, sortField?: string, sortDirection?: string): Observable<any> {
    let opt = {
      params: new HttpParams()
    };

    if (supplierId != null) {
      opt.params = opt.params.append('supplierId', supplierId);
    }
    if (sortField && sortDirection) {
      opt.params = opt.params.append('sortField', sortField);
      opt.params = opt.params.append('sortDirection', sortDirection == "desc" ? "-1" : "1");
    }
    opt = Object.assign(opt, this.httpOptions);

    return this.http.get(this.apiURL + '/statistics', opt) // 624d278141034b896a223e4c
  }

  getTotalStats(): Observable<any> {
    return this.http.get(this.apiURL + '/statistics/total' , this.httpOptions)
  }
}
