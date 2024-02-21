import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Category} from "../../models/category.model";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";
import {ApiClient} from "../../service/httpClient";

export class CategoryDataSource implements DataSource<Category> {

  private CategoryListSubject = new BehaviorSubject<Category[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

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

  loadPagedData(queryString:string, supplierId:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string): any {
    this.loadingSubject.next(true);
    this.api.getCategories(queryString, pageIndex, pageSize, supplierId, sortActive, sortDirection)
      .pipe(
        tap( () => {
          this.loadingSubject.next(true)
        }),
        map((res:any) => {
          console.log(res)
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

  insertCategory(category:Category) {
    this.api.insertCategory(category).subscribe(x => {
      console.log(x)
    })
  }

  deleteCategory(id: string) {
    this.api.deleteCategory(id).subscribe( {
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
