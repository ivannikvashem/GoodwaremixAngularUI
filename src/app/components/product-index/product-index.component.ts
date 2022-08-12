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
    this.api.getSuppliers('', 0 ,100).subscribe( r => {
      this.supplierList = r.body.data
    });
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.supplierId = params['supplierId'];
      if (this.supplierId) {
        this.api.getSupplierById(this.supplierId).subscribe( s => {
          this.selectedSupplier = s.body as Supplier;
          this.searchSuppliersCtrl.setValue(s.body as Supplier);
        })
      }
    });
    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.api.getSuppliers(value, 0 ,100)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((data: any) => {
      this.supplierList = data.body.data;
    });

    //initial product data load
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCodeSelector, this.selectedSupplier ? this.selectedSupplier.id : this.supplierId,  0, 10);
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => this.loadProductPagedData())
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
    this.loadProductPagedData();
  }

  loadProductPagedData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCodeSelector, this.selectedSupplier?.id, this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10);
  }

  searchQueryChanged() {
    this.searchQuery = this.searchQueryCtrl.value ?? '';
    this.loadProductPagedData();
  }

  deleteItem(_id: any) {

  }

  editItem(id: any) {
    this.router.navigate([`product-details/${id}`]);
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
