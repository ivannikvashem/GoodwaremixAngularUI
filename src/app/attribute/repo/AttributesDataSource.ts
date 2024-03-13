import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {Attribute} from '../../models/attribute.model';
import {ApiClient} from "../../service/httpClient";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {Injectable} from "@angular/core";
import {ApiResponseModel} from "../../models/service/api-response.model";

@Injectable({
  providedIn: 'root'
})

export class AttributesDataSource implements DataSource<Attribute> {

  private AttributeListSubject = new BehaviorSubject<Attribute[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['searchFilter', 'supplierId', 'filter.pageNumber', 'filter.pageSize', 'sortField', 'sortDirection', 'fixedFilter'];
  private params:HttpParamsModel[] = [];

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;

  constructor(private api: ApiClient) {}

  connect(collectionViewer: CollectionViewer): Observable<Attribute[]> {
    return this.AttributeListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.AttributeListSubject.complete();
    this.loadingSubject.complete();
  }

  private createParamsObj(arg:IArguments, paramKeys:string[]) {
    let params:HttpParamsModel[] = [];
    for (let i = 0; i < arg.length; i++) {
      if (paramKeys[i] == 'sortDirection') {
        arg[i] = (arg[i] == "desc" ? "-1" : "1")
      }
      params.push(new HttpParamsModel(paramKeys[i], arg[i]));
    }
    return params;
  }

  loadPagedData(queryString:string, supplierId:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string, fixed?: boolean) {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);

    this.api.getRequest('Attributes', this.params)
      .pipe(
        map((res:any) => {
          return res.body;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe((body:ApiResponseModel) => {
      this.AttributeListSubject.next(body.data as Attribute[]);
      this.rowCount = body.totalRecords;
    })
  }

  loadAutocompleteData(queryString:string, supplierId:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string, fixed?: boolean): Observable<any> {
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);
    return this.api.getRequest('Attributes', this.params).pipe(map((res:any) => { return res.body.data; }));
  }

  getAttributeById(id:string) {
    return this.api.getRequest(`Attributes/${id}`, []);
  }

  deleteAttribute(id: string) {
    this.api.deleteRequest(`Attributes/${id}`).subscribe( () => {
        let newdata = this.AttributeListSubject.value.filter(row => row.id != id );
        this.AttributeListSubject.next(newdata);
      },
      err => {
        //this._notyf.onError(err.message)
      });
  }

  deleteProductAttribute(id:string) {
    return this.api.deleteRequest(`Attributes/${id}`)
  }

  swapAttribute(sourceId: string, destId: string, convertId?:string) {
    let paramKeys:string[] = ['sourceId', 'destionationId', 'convertId']
    return this.api.postRequest('Attributes/swap', null, this.createParamsObj(arguments, paramKeys))
  }

  switchFixAttribute(id:string) {
    return this.api.postRequest(`Attributes/${id}/fix`, null)
  }

  updateFixedAttributeState(id: string, val: boolean) {
    let newdata = this.AttributeListSubject.value.map(x => (x.id === id ? { ...x, fixed: val } : x));
    this.AttributeListSubject.next(newdata);
  }

  updateSwappedAttribute(oldAttrId:string) {
    let newdata = this.AttributeListSubject.value.filter(row => row.id != oldAttrId );
    this.AttributeListSubject.next(newdata);
  }

  insertAttribute(attribute: Attribute) {
    return this.api.postRequest('Attributes', attribute)
  }

  updateAttribute(attribute: Attribute) {
    return this.api.putRequest('Attributes', attribute)
  }
}
