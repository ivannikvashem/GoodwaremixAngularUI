import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../../repo/ProductsDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {debounceTime, distinctUntilChanged, filter, finalize, map, Observable, startWith, switchMap, tap} from "rxjs";
import {FormControl} from '@angular/forms';
import {Supplier} from "../../models/supplier.model";

export interface DialogData {
  src: '';
}

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['preview', 'internalCode' ,'name', 'supplierName', 'actions'];
  dataSource: ProductsDataSource;

  hoverImage: string = "";
  hoverRowId: string = "";
  public searchQuery: string | undefined;
  public withInternalCodeSelector: boolean;

  searchSuppliersCtrl = new FormControl<string | Supplier>('');
  searchQueryCtrl  = new FormControl<string>('');
  public supplierList: Supplier[] | undefined;  // public filteredSupplierList: Observable<Supplier[]> | undefined;
  selectedSupplier: Supplier | undefined;
  isLoading = false;
  productId: string | any;
  supplierId: string | any; //todo shity bug!! need to upload whole Supplier and set it into this.selectedSupplier

  constructor(
    public api: ApiClient,
    public dialog: MatDialog,
    public router: Router,
    private _ActivatedRoute:ActivatedRoute
  ) {
    this.dataSource = new ProductsDataSource(this.api);
    this.withInternalCodeSelector = false;
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  ngOnInit(): any {
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.supplierId = params['supplierId'];
      if (this.supplierId) {
        this.api.getSupplierById(this.supplierId).subscribe( s => {
          console.log("Got Supp by id: " + this.supplierId);
          this.selectedSupplier = s;
        })
      }
    });
    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.api.getSuppliers(this.searchSuppliersCtrl.value, 0 ,20)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((data: any) => {
      this.supplierList = data.body.data;
      console.log("Got FRESH Data! " + this.searchSuppliersCtrl.value);
    });
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCodeSelector, this.selectedSupplier ? this.selectedSupplier.id : this.supplierId,  0, 10);
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => this.loadData())
      )
      .subscribe();
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onSupplierSelected() {
    //console.log("ctrlVal= " + JSON.stringify(this.searchSuppliersCtrl.value));
    this.selectedSupplier = this.searchSuppliersCtrl.value as Supplier;
    console.log("suppId= " + this.selectedSupplier?.id);
    this.loadData();
  }

  loadData(): any {
    console.log("loadData " + this.searchQueryCtrl.value + " , withInternalCodeSelector: " + this.withInternalCodeSelector);
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCodeSelector, this.selectedSupplier?.id, this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10);
  }

  searchQueryChanged() {
    this.searchQuery = this.searchQueryCtrl.value ?? '';
    this.loadData();
  }

  deleteItem(_id: any) {

  }

  editItem(id: any) {
    console.log("nav! " + id);
    this.router.navigate([`product-details/${id}`]);
    //this.router.navigate([`attribute-edit/${id}`]);
  }

  addItem() {

  }

  changeImage(row: any, image: any) {
    this.hoverRowId = row.id;
    this.hoverImage = image;
  }
  openDialog(image: string) {
    console.log(image);
    let dialogBoxSettings = {
      /*maxHeight: '60%',*/
      maxWidth: '60%',
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(DialogDataExampleDialog, dialogBoxSettings);
  }
}
@Component({
  selector: 'dialog-data-example-dialog',
  template: `
    <!--<img style="max-width: 800px;  max-height: 800px;" src='{{data.src}}'>-->
    <img style="max-width: 95%;  max-height: 95%; margin: 0 auto; display: flex" src='{{data.src}}'>
`
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
