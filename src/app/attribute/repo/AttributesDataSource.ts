import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {Attribute} from '../../models/attribute.model';
import {ApiClient} from "../../service/httpClient";

export class AttributesDataSource implements DataSource<Attribute> {

  private AttributeListSubject = new BehaviorSubject<Attribute[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

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

  loadPagedData(queryString = "", supplierId: string = '', pageIndex = 1, pageSize = 10, fixed?: boolean ): any {
    this.loadingSubject.next(true);
    this.api.getAttributes(queryString, supplierId, pageIndex, pageSize, fixed, "Rating", "desc")
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
        this.AttributeListSubject.next(body.data);
        this.rowCount = body.totalRecords;
      });
  }

  deleteAttribute(id: string) {
    console.log("deleting attr " + id);
    this.api.deleteAttribute(id).subscribe( res => {
        console.log('res',res)
        let newdata = this.AttributeListSubject.value.filter(row => row.id != id );
        this.AttributeListSubject.next(newdata);
      },
      err => {
        //this._notyf.onError(err.message)
      });
  }

  updateFixedAttributeState(id: string, val: boolean) {
    console.log("upd fix attr " + id);
    let newdata = this.AttributeListSubject.value.map(x => (x.id === id ? { ...x, fixed: val } : x));
    this.AttributeListSubject.next(newdata);
  }
}
