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

  getSceneById(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/scenes/' + id, this.httpOptions);
  }

/*  changeScene(data: Scene): Observable<any> {
    return this.http.put<Scene>(this.apiURL + '/scenes/' + data._id, data, this.httpOptions);
  }*/

  createScene(data: any): Observable<any> {
/*    console.log("createScene method with data: " + JSON.stringify(data));
    console.log("createScene url: " + this.apiURL + '/scenes/');*/
    return this.http.post<any>(this.apiURL + '/scenes/', data, this.httpOptions);
  }

  // Product ENDPOINT

  getProducts(searchQuery: string, withInternalCodeSelector: boolean, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('withInternalCode', withInternalCodeSelector ?? false)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
        .set('searchQuery', searchQuery)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<any>(this.apiURL + '/AngProduct', opt);
  }

  // Suppliers ENDPOINT

  getSuppliers(searchQuery: string, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('queryString', searchQuery)
        .set('pageNumber', pageIndex ? pageIndex + 1 : 1)
        .set('pageSize', pageSize ?? 10)
    };
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
  // Delete item by id
/*  deleteCommand(id: string) {
    return this.http
      .delete<Command>(this.apiURL + '/commands/' + id, this.httpOptions)
      .pipe(
        retry(2),
        //catchError(this.handleError)
      )
  }*/


/*  // HttpClient API post() method => Login
  login(loginData): Observable<any> {
    return this.http.post<any>(this.apiURL + '/users/login', loginData, this.httpOptions);
  }

  // HttpClient API post() method => Login
  getCurrentUserData(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/users/current', this.httpOptions);
  }

  // HttpClient API post() method => Login
  logout(): Observable<any> {
    // this.setHeaderOptions(window.sessionStorage.getItem('access-token'));
    return this.http.post<any>(this.apiURL + '/users/logout', null, this.httpOptions);
  }

  // HttpClient API get() method => Fetch user list
  getUserOffices(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/users/offices', this.httpOptions);
  }

  // HttpClient API get() method => Fetch user list
  getUsers(): Observable<any> {
    return this.http.get<User[]>(this.apiURL + '/users', this.httpOptions);
  }

  // HttpClient API get() method => Fetch user list by query filter
  getUsersByFilter(searchQuery: string): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('searchQuery', searchQuery)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<User[]>(this.apiURL + '/users', opt);
  }

  // HttpClient API put() method => Update password or change role
  addUser(data): Observable<any> {
    return this.http.post<User>(this.apiURL + '/users/', data, this.httpOptions);
  }

  // HttpClient API put() method => Update password or change role
  changeUser(data): Observable<any> {
    return this.http.put<User>(this.apiURL + '/users/' + data.id, data, this.httpOptions);
  }

  // HttpClient API delete() method => Delete user by Id
  deleteUser(id): Observable<any> {
    // this.httpOptions.headers = this.httpOptions.headers.append('Authorization', 'Bearer ' + window.localStorage.getItem('access-token'));
    return this.http.delete(this.apiURL + '/users/' + id, this.httpOptions);
  }

  // INVOICE ENPOINTS

  // HttpClient API get() method => Fetch invoice list
  getTouchedInvoices(pageIndex = 0, pageSize = 10): Observable<any> {
    let opt = {
      params: new HttpParams()
       // .set('code', code)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Invoice[]>(this.apiURL + '/invoices/touched', opt);
  }

  // HttpClient API get() method => Fetch invoice list
  getInvoicesByCode(id): Observable<any> {
    return this.http.get<Invoice[]>(this.apiURL + '/invoices/code/' + id, this.httpOptions);
    /!*      .pipe(
            map(data => new Invoice().deserialize(data)),
            catchError(() => throwError('Invoice not found'))
          );*!/
  }

  // HttpClient API get() method => Fetch invoice list
  getInvoicesByTriplistId(triplistId, deliveryPointId, pageIndex = 0, pageSize = 10): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('triplistId', triplistId ? triplistId.toString() : null)
        .set('deliveryPointId', deliveryPointId ? deliveryPointId.toString() : null)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Invoice[]>(this.apiURL + '/invoices', opt);
  }

  // TRIPLIST ENDPOINTS

  // todo TMP USER PROFILE!!
  getCurrentUserTriplists(): Observable<any> {
    return this.http.get<Triplist[]>(this.apiURL + '/triplists/active', this.httpOptions);
  }

  // HttpClient API get() method => Fetch invoice list
  setTriplistDone(extId): Observable<any> {
    return this.http.put<Triplist>(this.apiURL + '/triplists/' + extId, this.httpOptions);
  }

  // HttpClient API get() method => Fetch invoice statistics by each user
  getStatUsers(): Observable<any> {
    return this.http.get<UsrStat>(this.apiURL + '/triplists/userstat', this.httpOptions);
  }

  // HttpClient API get() method => Fetch invoice statistics by each user
  getStatUserByFilter(name): Observable<any> {
    return this.http.get<UsrStat>(this.apiURL + '/triplists/userstat/' + name, this.httpOptions);
  }

  // HttpClient API get() method => Fetch invoice list
  getTriplists(userId, range, officeSelection, searchFilter = '', pageIndex = 0, pageSize = 10): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    };
    if (searchFilter && searchFilter.length > 0 ) {
      opt.params = opt.params.append('searchFilter', searchFilter);
    }
    if (userId > 0) {
      opt.params = opt.params.append('userId', userId);
    }
    if (officeSelection != null && officeSelection.length > 0) {
      opt.params = opt.params.append('offices', officeSelection.toString());
    }
    if (range.start && range.end) {
      opt.params = opt.params.append('start', range.start);
      opt.params = opt.params.append('end', range.end);
    }

    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Triplist[]>(this.apiURL + '/triplists/', opt);
  }

  // HttpClient API get() method => Fetch invoice list
  getDeliverpPointsByTriplistId(tlId, searchFilter, pageIndex: number, pageSize: number): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    };
    if (searchFilter && searchFilter.length > 0 ) {
      opt.params = opt.params.append('searchFilter', searchFilter);
    }
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Triplist[]>(this.apiURL + '/deliveryPoints/bytrip/' + tlId, opt);
  }

  // REFUNDS ENDPOINT

  // HttpClient API get() method => Fetch refunds list
  getRefunds(searchFilter = '', dateRange): Observable<any> {
    let opt = {
      params: new HttpParams()
/!*        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())*!/
    };
    if (dateRange.start && dateRange.end) {
      opt.params = opt.params.append('start', dateRange.start);
      opt.params = opt.params.append('end', dateRange.end);
    }
    if (searchFilter && searchFilter.length > 0 ) {
      opt.params = opt.params.append('searchFilter', searchFilter);
    }
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<Refund[]>(this.apiURL + '/refunds/', opt);
  }

  // HttpClient API get() method => Fetch invoice list
  findRefund(code): Observable<any> {
    return this.http.get<Refund[]>(this.apiURL + '/refunds/' + code, this.httpOptions);
  }

  // HttpClient API get() method => Fetch invoice list
  setRefundStatus(data): Observable<any> {
    let opt = {
      params: new HttpParams()
        .set('status', data.status)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.post<Refund[]>(this.apiURL + '/refunds/' + data.QRcode, data, opt);
  }

  // STAT ENDPOINTS

  // HttpClient API get() method => Fetch triplist list with mix of invoices and DP info summary report
  getTriplistSummary(userId, dateRange, pageIndex: number = 1, pageSize: number = 10 ): Observable<any> {
    console.log('getTriplistSummary');
    let opt = {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    };
    if (userId > 0) {
      opt.params = opt.params.append('userId', userId);
    }
    if (dateRange.start && dateRange.end) {
      opt.params = opt.params.append('start', dateRange.start);
      opt.params = opt.params.append('end', dateRange.end);
    }

    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<TriplistSummary[]>(this.apiURL + '/stat/triplists/', opt);
  }

  // HttpClient API get() method => Fetch triplist statistics
  getGeneralTriplistStat(start, end): Observable<any> {
    let opt = {
      params: new HttpParams()
        // .set('userId', userId.toString())
        .set('start', start)
        .set('end', end)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<TrpStat>(this.apiURL + '/stat/general/triplists', opt);
  }

  // HttpClient API get() method => Fetch invoice statistics
  getGeneralInvoiceStat(start, end): Observable<any> {
    let opt = {
      params: new HttpParams()
        // .set('userId', userId.toString())
        .set('start', start)
        .set('end', end)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<InvStat>(this.apiURL + '/stat/general/invoices', opt);
  }

  // HttpClient API get() method => Fetch refundsGeneralStat stat
  getGeneralRefundsStat(start, end): Observable<any> {
    let opt = {
      params: new HttpParams()
        // .set('userId', userId.toString())
        .set('start', start)
        .set('end', end)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<RfnStat[]>(this.apiURL + '/stat/general/refunds', opt);
  }

  getMarksHourlyStat(userId, start, end): Observable<any> {
    let opt = {
      params: new HttpParams()
        // .set('userId', userId.toString())
        .set('start', start)
        .set('end', end)
    };
    opt = Object.assign(opt, this.httpOptions);
    return this.http.get<InvStat[]>(this.apiURL + '/stat/marks/hourly/', opt);
  }

  // HttpClient API get() method => Fetch server importer state
  getServerImporterState(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/stat/import', this.httpOptions);
  }

  // HttpClient API get() method => Fetch server importer state
  getDBState(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/stat/checkDB', this.httpOptions);
  }

  // HttpClient API get() method => Fetch server importer state
  getServerState(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/stat/server', this.httpOptions);
  }*/

}
