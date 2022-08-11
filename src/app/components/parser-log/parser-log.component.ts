import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {tap} from "rxjs";
import {LogsDataSource} from "../../repo/LogDataSource";

@Component({
  selector: 'app-parser-log',
  templateUrl: './parser-log.component.html',
  styleUrls: ['./parser-log.component.css']
})
export class ParserLogComponent implements OnInit {

  displayedColumns: string[] = ['name', 'date', 'status', 'result', 'actions'];
  dataSource: LogsDataSource;

  constructor(
    public api: ApiClient,
    private router: Router
  ) {
    this.dataSource = new LogsDataSource(this.api);
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  ngOnInit(): any {
    this.dataSource.loadPagedData(0, 10);
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => this.loadData())
      )
      .subscribe();
  }

  loadData(): any {
    this.dataSource.loadPagedData(this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10);
  }

  flushLogTable(): any {
     //TODO send request to flush log
  }

}
