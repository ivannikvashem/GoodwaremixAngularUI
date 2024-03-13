import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {ApiClient} from "../../service/httpClient";
import {catchError, finalize, map} from "rxjs/operators";
import {Document} from "../../models/document.model";
import {HttpParamsModel} from "../../models/service/http-params.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DocumentsDataSource implements DataSource<Document> {

  private DocumentListSubject = new BehaviorSubject<Document[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadPageParamsKeys: string[] = ['searchFilter', 'supplierId', 'filter.pageNumber', 'filter.pageSize', 'sortField', 'sortDirection'];
  private params:HttpParamsModel[] = [];

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

  private createParamsObj(arg:IArguments, paramKeys:string[]) {
    let params:HttpParamsModel[] = [];
    for (let i = 0; i < arg.length; i++) {
      if (paramKeys[i] == 'sortDirection')
        arg[i] = (arg[i] == "desc" ? "-1" : "1")
      if (paramKeys[i] == 'filter.pageNumber')
        arg[i] = (arg[i] ? arg[i] + 1 : 1)
      params.push(new HttpParamsModel(paramKeys[i], arg[i]));
    }
    return params;
  }

  loadPagedData(queryString:string, supplierId:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string): any {
    this.loadingSubject.next(true);
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);

    this.api.getRequest('documents', this.params)
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

  loadAutocompleteData(queryString:string, supplierId:string, pageIndex:number, pageSize:number, sortActive:string, sortDirection:string): Observable<any> {
    this.params = this.createParamsObj(arguments, this.loadPageParamsKeys);
    return this.api.getRequest('documents', this.params).pipe(map((res:any) => { return res.body.data; }));
  }

  getDocumentById(id:string) {
    return this.api.getRequest(`documents/document/${id}`, []);
  }

  getDocumentsById(ids:string[], route:'documents' | 'documentsDTO') {
    let paramKeys:string[] = []
    for (let i of ids) {
      paramKeys.push('documentsId')
    }
    return this.api.getRequest(`documents/${route}`, this.createParamsObj(arguments, paramKeys))
  }

  insertDocument(document: Document) {
    return this.api.postRequest('documents', document)
  }

  updateDocument(document: Document) {
    return this.api.putRequest('documents', document)
  }

  deleteDocument(id: string) {
    this.api.deleteRequest(`documents/documentDelete/${id}`).subscribe( {
      next: () => {
        let newdata = this.DocumentListSubject.value.filter(row => row.id != id );
        this.DocumentListSubject.next(newdata);
      },
      error: err => {
        console.log(err)
        //this._notyf.onError(err.message)
      },});
  }

  uploadDocument(file: File, documentId:string) {
    let formData = new FormData();
    formData.append('file', file)
    return this.api.postRequest(`files/documents/${documentId}`, formData, [],{headers:{"ContentType": "multipart/form-data"}})
  }

}
