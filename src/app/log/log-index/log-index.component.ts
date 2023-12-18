import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {merge, tap} from "rxjs";
import {LogsDataSource} from "../repo/LogsDataSource";
import {MatSort} from "@angular/material/sort";
import {Log} from "../models/log.model";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {DataStateService} from "../../shared/data-state.service";
import {Supplier} from "../../models/supplier.model";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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

  displayedColumns: string[] = ['supplierName', 'date', 'status', 'result', 'actions'];
  expandedElement: Log | null | undefined;
  dataSource: LogsDataSource;
  selectedSupplier: Supplier;
  scrollToTop:boolean;
  isPaginatorFixed:boolean;

  constructor(
    public api: ApiClient,
    public dss: DataStateService,
    public dialog: MatDialog
  ) { this.dataSource = new LogsDataSource(this.api); }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort | any;

  ngOnInit(): any {
    this.dss.getSelectedSupplier().subscribe((supplier:Supplier) => {
        this.selectedSupplier = supplier;
        this.loadLogData();
      }
    )
    this.dss.getSettings().subscribe((settings:any) => {
      this.scrollToTop = settings.scrollPageToTop;
      this.isPaginatorFixed = settings.isPaginatorFixed;
    })
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap( () => {
          if (this.scrollToTop) {
            window.scroll(0, 0);
          }
          this.loadLogData()
        })
      ).subscribe();
  }

  loadLogData(): any {
    this.dataSource.loadPagedData(this.selectedSupplier?.id,this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 12, this.sort?.active, this.sort?.direction);
  }

  flushLogTable(): any {
    const message = `Очистить журнал ?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.dataSource.deleteAllLogs();
      }
    });
  }
}
