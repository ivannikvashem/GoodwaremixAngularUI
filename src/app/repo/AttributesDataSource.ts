import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {Attribute} from '../models/attribute.model';
import {ApiClient} from "./httpClient";

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

  loadPagedData(queryString = "", supplierId: string, pageIndex = 1, pageSize = 10, fixed?: boolean ): any {
    this.loadingSubject.next(true);
    this.api.getAttributes(queryString, supplierId, pageIndex, pageSize, fixed, "Rating", "desc")
      .pipe(
        map(res => {
          console.log(JSON.stringify(res.body));
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
}
