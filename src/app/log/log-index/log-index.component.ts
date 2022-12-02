import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {merge, Observable, Subject, tap} from "rxjs";
import {LogsDataSource} from "../repo/LogsDataSource";
import {MatSort} from "@angular/material/sort";
import {Log} from "../models/log.model";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {DatastateService} from "../../shared/datastate.service";
import {Supplier} from "../../models/supplier.model";

@Component({
  selector: 'app-log-index',
  templateUrl: './log-index.component.html',
  styleUrls: ['./log-index.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LogIndexComponent implements OnInit {

  displayedColumns: string[] = ['SupplierName', 'Date', 'status', 'result', 'actions'];
  expandedElement: Log | null | undefined;
  dataSource: LogsDataSource;
  selectedSupplier: Supplier = this.dss.selectedSupplierState.value;

  constructor(
    public api: ApiClient,
    public dss: DatastateService
  ) { this.dataSource = new LogsDataSource(this.api); }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort | any;

  ngOnInit(): any {
    this.dataSource.loadPagedData(this.selectedSupplier?.id, 0,10, 'Date', 'desc');

    this.dss.selectedSupplierState.subscribe(
      id => {
        console.log('sup from dss', id)
        this.selectedSupplier = id;
        this.loadLogData();
      }
    )
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
    console.log("log index suppId:" + this.selectedSupplier);
    this.dataSource.loadPagedData(this.selectedSupplier.id,this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10, this.sort?.active, this.sort?.direction);
  }

  flushLogTable(): any {
    this.dataSource.deleteAllLogs();
  }
}
