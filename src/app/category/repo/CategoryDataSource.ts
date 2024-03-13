import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Category} from "../../models/category.model";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";
import {ApiClient} from "../../service/httpClient";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class CategoryDataSource implements DataSource<Category> {

  private CategoryListSubject = new BehaviorSubject<Category[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['filterTitle',  'filter.pageNumber', 'filter.pageSize'];
  private params:HttpParamsModel[] = [];

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;
  public pageCountSize:number;

  constructor(private api: ApiClient) {}

  connect(collectionViewer: CollectionViewer): Observable<Category[]> {
    return this.CategoryListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.CategoryListSubject.complete();
    this.loadingSubject.complete();
  }

  private createParamsObj(arg:IArguments, paramKeys:string[]) {
    let params:HttpParamsModel[] = [];
    for (let i = 0; i < arg.length; i++) {
      if (paramKeys[i] == 'filter.pageNumber')
        arg[i] = (arg[i] ? arg[i] + 1 : 1)
      params.push(new HttpParamsModel(paramKeys[i], arg[i]));
    }
    return params;
  }

  loadPagedData(queryString:string, pageIndex: number, pageSize: number, supplierId:string, sortField: string, sortDirection: string): any {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);

    this.api.getRequest('categories', this.params)
      .pipe(
        tap( () => {
          this.loadingSubject.next(true)
        }),
        map((res:any) => {
          return res.body;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(body => {
        this.CategoryListSubject.next(body.data);
        this.rowCount = body.totalRecords;
        this.pageCountSize = body.data.length;
      });
  }

  getCategoryById(id:string) {
    return this.api.getRequest(`categories/${id}`, [])
  }

  getCategoryTreeById(id:string) {
    return this.api.getRequest(`categories/tree/${id}`, [])
  }

  insertCategory(category:Category) {
    this.api.postRequest('categories', category).subscribe(x => {
      console.log(x)
    })
  }

  updateCategory(category:Category) {
    this.api.putRequest('categories', category).subscribe(x => {
      console.log(x)
    })
  }

  deleteCategory(id: string) {
    this.api.deleteRequest(`categories/${id}`).subscribe( {
      next: () => {
        let newdata = this.CategoryListSubject.value.filter(row => row.id != id );
        this.CategoryListSubject.next(newdata);
      },
      error: err => {
        console.log(err)
        //this._notyf.onError(err.message)
      },});
  }
}
