import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from "../auth/service/auth.service";
import {HttpParamsModel} from "../models/service/http-params.model";
import {catchError} from "rxjs/operators";

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
  private httpOptions = {
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

  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  private applyParams(params: HttpParamsModel[]) : HttpParams {
    let httpParams: HttpParams = new HttpParams();
    params = params.filter((param) => {
      return param.value !== null && param.value !== '' && param.value !== undefined;
    });
    params.forEach((param) => {
      httpParams = httpParams.append(param.key, param.value);
    });
    return httpParams;
  }

  public getRequest(endpoint:string, params:HttpParamsModel[], options?:any): Observable<any> {
    let opt = {params: new HttpParams()};
    if (params && params.length > 0) {
      opt.params = this.applyParams(params)
    }
    if (options) {
      opt = Object.assign(opt, options);
    }
    opt = Object.assign(opt, this.httpOptions);

    return this.http.get(`${this.apiURL}/${endpoint}`, opt).pipe(catchError(this.errorHandler));
  }
  public postRequest(endpoint:string, body:any, params?:HttpParamsModel[], headerOptions?:any): Observable<any> {
    let opt = {params: new HttpParams()};
    if (params && params.length > 0) {
      opt.params = this.applyParams(params)
    }
    opt = Object.assign(opt, this.httpOptions);
    if (headerOptions)
      opt = headerOptions;
    return this.http.post(`${this.apiURL}/${endpoint}`, body, opt).pipe(catchError(this.errorHandler));
  }

  public putRequest(endpoint:string, body:any): Observable<any> {
    return this.http.put(`${this.apiURL}/${endpoint}`, body, this.httpOptions).pipe(catchError(this.errorHandler));
  }

  public deleteRequest(endpoint:string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${endpoint}`, this.httpOptions).pipe(catchError(this.errorHandler));
  }

  public patchRequest(endpoint:string): Observable<any> {
    return this.http.patch(`${this.apiURL}/${endpoint}`, this.httpOptions).pipe(catchError(this.errorHandler));
  }
}
