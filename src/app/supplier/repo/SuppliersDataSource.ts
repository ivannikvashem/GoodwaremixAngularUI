import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {ApiClient} from "../../service/httpClient";
import {Supplier, SupplierConfig} from "../../models/supplier.model";
import {Stat} from "../../models/Stat.model";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {Injectable} from "@angular/core";
import {StatisticDataSource} from "../../statistic/repo/StatisticDataSource";

@Injectable({
  providedIn: 'root'
})

export class SuppliersDataSource implements DataSource<Supplier> {

  private SupplierListSubject = new BehaviorSubject<Supplier[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['searchFilter',  'filter.pageNumber', 'filter.pageSize', 'sortField', 'sortDirection'];
  private params:HttpParamsModel[] = [];

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;
  public pageCount = 0;

  constructor(private api: ApiClient, private statDS: StatisticDataSource) {  }

  connect(collectionViewer: CollectionViewer): Observable<Supplier[]> {
    return this.SupplierListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.SupplierListSubject.complete();
    this.loadingSubject.complete();
  }

  private createParamsObj(arg:IArguments, paramKeys:string[]) {
    let params:HttpParamsModel[] = [];
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

  loadPagedData(searchQuery:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string) {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);
    this.api.getRequest('Suppliers', this.params)
      .pipe(
        map(res => {
          for (let supplier of res.body.data) {
            this.statDS.getSupplierLastStats(supplier.id).subscribe(stat => {
              if (stat.body) {
                supplier.productQty = stat.body.productQty;
                supplier.lastImport = stat.body.lastImport;
                supplier.productQtyWithCode = stat.body.productQtyWithCode;
              }
            })
          }
          return res.body;
        }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(body => {
        this.SupplierListSubject.next(body.data)
        this.rowCount = body.totalRecords;
        this.pageCount = body.data?.length;
      });
  }

  loadAutocompleteData(searchQuery:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string): Observable<any> {
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);
    return this.api.getRequest('Suppliers', this.params).pipe(map((res:any) => { return res.body.data; }));
  }

  getSupplierById(id:string) {
    return this.api.getRequest(`Suppliers/${id}`, []);
  }

  insertSupplier(supplier: Supplier) {
    return this.api.postRequest('Suppliers', supplier)
  }
  updateSupplier(supplier: Supplier) {
    return this.api.putRequest('Suppliers', supplier)
  }

  deleteSupplier(id:string) {
    this.api.deleteRequest(`Suppliers/${id}`).subscribe( () => {
        let newdata = this.SupplierListSubject.value.filter(row => row.id != id );
        this.SupplierListSubject.next(newdata);
      },
      err => {
      });
  }

  deleteSupplierProducts(id:string) {
    this.api.deleteRequest(`Products/${id}/products`).subscribe( () => {
        const newSuppliers = this.SupplierListSubject.getValue().map(s =>
          s.id === id
            ? { ...s, stat: new Stat() }
            : s
        );

        this.SupplierListSubject.next(newSuppliers);
      },
      err => {
      })
  }

  fetchDataFromSupplier(id:string) {
    return this.api.postRequest(`Suppliers/FetchList/${id}`, null)
  }
  stopFetchDataFromSupplier(id:string) {
    return this.api.postRequest(`Suppliers/fetchStop/${id}`, null)
  }
  internalCodeBindForSupplier(id:string) {
    return this.api.postRequest(`Suppliers/internalBind/${id}`, null)
  }

  supplierStatUpdate(ids:string[]) {
    return this.api.postRequest(`Suppliers/StatisticBind/`, ids)
  }

  getBrands(searchQuery:string) {
    this.params = this.createParamsObj(arguments, ['searchFilter']);
    return this.api.getRequest('Suppliers/brend', this.params).pipe(map((res:any) => { return res.body.data; }));
  }

  bindSupplierCategories(supplierIds:string[]) {
    return this.api.postRequest('Suppliers/FetchListCategory', supplierIds)
  }

  downloadTableFile(table: string, supplierId: string) {
    this.params = this.createParamsObj(arguments, ['table', 'supplierId']);
    return this.api.getRequest('suppliers/DownloadFileJson', this.params)
  }

  preparseProduct(file: File, supplier: Supplier) {
    let formData = new FormData();
    formData.append('value', JSON.stringify(supplier))
    formData.append('file', file)
    return this.api.postRequest(`Products/PreParser`, formData, [],{headers:{"ContentType": "multipart/form-data"}})
  }
}
