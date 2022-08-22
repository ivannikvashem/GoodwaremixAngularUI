import {Component, OnInit, ViewChild} from '@angular/core';
import {SuppliersDataSource} from "../../repo/SuppliersDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {tap} from "rxjs";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Supplier} from "../../models/supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";

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

  displayedColumns: string[] = ['name', 'type', 'fullfill', 'brands', 'stat', 'actions'];
  dataSource: SuppliersDataSource;
  expandedElement: Supplier | null | undefined;

  constructor(
    public api: ApiClient,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.dataSource = new SuppliersDataSource(this.api);
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  ngOnInit(): any {
    //this.dataSource.loadPagedData("");
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => this.loadData())
      )
      .subscribe();
    this.loadData();
  }

  loadData(): any {
    this.dataSource.loadPagedData("", this.paginator?.pageIndex, this.paginator?.pageSize);
  }

  addItem() {
    this.addTmpSupplier();
  }

  fixSupplierStat() {
    console.log("fixSupplierStat ");
    this.api.fixSupplierStat().subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        console.log(err);
      })
  }

  fetchItem(supplierName: any) {
    console.log("fetching " +supplierName);
    this.api.fetchDataFromSupplier(supplierName).subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        console.log(err);
      })
  }

  editItem(supplierName: any) {
    this.router.navigate([`supplier-edit-mw/${supplierName}`]);
  }

  addTmpSupplier(): void{
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
  }

  confirmDeleteSuppDialog(id: string, name: string): void {
    const message = `Удалить поставщика ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
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
}
