import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {ApiClient} from "../../service/httpClient";
import {catchError, finalize, map} from "rxjs/operators";
import {Document} from "../../models/document.model";

export class DocumentsDataSource implements DataSource<Document> {

  private DocumentListSubject = new BehaviorSubject<Document[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public rowCount = 0;
  public pageCountSize:number;

  constructor(private api: ApiClient) {}

  connect(collectionViewer: CollectionViewer): Observable<Document[]> {
    return this.DocumentListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.DocumentListSubject.complete();
    this.loadingSubject.complete();
  }

  loadPagedData(queryString:string, supplierId:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string): any {
    this.loadingSubject.next(true);
    this.api.getDocuments(queryString, pageIndex, pageSize, supplierId, sortActive, sortDirection)
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
        this.DocumentListSubject.next(body.data);
        this.rowCount = body.totalRecords;
        this.pageCountSize = body.data.length;
      });
  }

  deleteDocument(id: string) {
    this.api.deleteDocument(id).subscribe( {
      next: () => {
        let newdata = this.DocumentListSubject.value.filter(row => row.id != id );
        this.DocumentListSubject.next(newdata);
      },
      error: err => {
        console.log(err)
        //this._notyf.onError(err.message)
      },});
  }

}
