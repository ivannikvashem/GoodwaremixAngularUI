import {Component, OnInit, ViewChild} from '@angular/core';
import {SuppliersDataSource} from "../../repo/SuppliersDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {merge, tap} from "rxjs";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Supplier} from "../../models/supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";
import {MatSort, SortDirection} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-supplier-index',
  templateUrl: './supplier-index.component.html',
  styleUrls: ['./supplier-index.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SupplierIndexComponent implements OnInit {

  displayedColumns: string[] = ['SupplierName', 'type', 'fullfill', 'brands', 'Stat.ProductQty', 'actions'];
  dataSource: SuppliersDataSource;
  searchQuery = "";
  expandedElement: Supplier | null | undefined;

  constructor(
    public api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    this.dataSource = new SuppliersDataSource(this.api);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort | any;

  ngOnInit(): any {
    this.loadData();
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
    this.dataSource.loadPagedData(this.searchQuery, this.paginator?.pageIndex || 0, this.paginator?.pageSize || 15, this.sort?.active, this.sort?.direction);
  }

  addItem() {
    //this.addTmpSupplier();
  }

  applySupplierFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchQuery = filterValue;
    this.paginator.pageIndex = 0;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
    this.loadData();
  }
  /*  addTmpSupplier(): void{
      let supplier = {
        SupplierName: "123",
        Stat: {},
        SourceSettings: {}
      };
      console.log('supp Submit: ', supplier);
      this.api.updateSupplier(supplier).subscribe( x => {
          console.log("updateSupplier: " +JSON.stringify(x) );
        },
        error => {
          console.log( "updateSupplierError: " + JSON.stringify(error));
        })
    }*/

  fixSupplierStat() {
    console.log("fixSupplierStat ");
    this.api.fixSupplierStat().subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._snackBar.open("Ошибка: " + JSON.stringify(err),undefined,{ duration: 5000});
      })
  }

  fetchItem(supplierName: any) {
    console.log("fetching " +supplierName);
    this.api.fetchDataFromSupplier(supplierName).subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._snackBar.open("Ошибка: " + JSON.stringify(err),undefined,{ duration: 5000});
      })
  }

  editItem(supplierId: any) {
    this.router.navigate([`supplier-edit/${supplierId}`]);
  }

  confirmDeleteSuppDialog(id: string, name: string): void {
    const message = `Удалить поставщика ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
      if (dialogResult === true) {
        console.log("Confirm deleting " + id);
        this.dataSource.deleteSupplier(id);
      }
    });
  }

  confirmDeleteSuppProdDialog(id: string, name: string): void {
    const message = `Удалить все товары поставщика ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
      if (dialogResult === true) {
        console.log("Confirm deleting " + id);
        this.dataSource.deleteSupplierProducts(id);
      }
    });
  }

  internalCodeFetch(supplierName: string) {
    console.log("IC bind " +supplierName);
    this.api.internalCodeBindForSupplier(supplierName).subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        console.log(err);
      })
  }
}
