import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {merge, startWith, tap} from "rxjs";
import {LogsDataSource} from "../../repo/LogDataSource";
import {MatSort, SortDirection} from "@angular/material/sort";

@Component({
  selector: 'app-parser-log',
  templateUrl: './parser-log.component.html',
  styleUrls: ['./parser-log.component.css']
})
export class ParserLogComponent implements OnInit {

  displayedColumns: string[] = ['SupplierName', 'Date', 'status', 'result', 'actions'];
  dataSource: LogsDataSource;

  constructor(
    public api: ApiClient,
    private router: Router
  ) {
    this.dataSource = new LogsDataSource(this.api);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort | any;

  ngOnInit(): any {
    this.dataSource.loadPagedData(0, 10);
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    //todo доделать нормальный pipe и обработку ошибок
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap( () => this.loadData())
      )
      .subscribe();
  }

  loadData(): any {
    this.dataSource.loadPagedData(this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10, this.sort.active, this.sort.direction);
  }

  flushLogTable(): any {
     //TODO send request to flush log
    this.api.flushLogs().subscribe( x=> {
        if (x) console.log("Logs are deleted");
      },
      err => {
        console.log("Logs deletion error: " +err )
      });
  }

}
