import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {
  merge,
  tap
} from "rxjs";
import {LogsDataSource} from "../../repo/LogDataSource";
import {MatSort, SortDirection} from "@angular/material/sort";
import {Supplier} from "../../models/supplier.model";
import {Log} from "../../models/log.model";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-parser-log',
  templateUrl: './parser-log.component.html',
  styleUrls: ['./parser-log.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ParserLogComponent implements OnInit {

  displayedColumns: string[] = ['SupplierName', 'Date', 'status', 'result', 'actions'];
  expandedElement: Log | null | undefined;
  dataSource: LogsDataSource;
  supplierId = '';

  constructor(
    public api: ApiClient
  ) {  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort | any;

  ngOnInit(): any {
    this.dataSource = new LogsDataSource(this.api);
    this.dataSource.loadPagedData(this.supplierId, 0,10, 'date', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    //todo доделать нормальный pipe и обработку ошибок
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap( () => this.loadLogData())
      ).subscribe();
  }

  loadLogData(): any {
    this.dataSource.loadPagedData(this.supplierId,this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10, this.sort.active, this.sort.direction);
  }

  flushLogTable(): any {
    this.dataSource.deleteAllLogs();
  }

  handleChangeSelectedSupplier(supplier: Supplier): any {
    this.supplierId = '';
    if (supplier.hasOwnProperty('id')){
      this.supplierId = supplier.id;
    }
    //console.log("handler: " + supplier.id);
    this.loadLogData();
  };
}
