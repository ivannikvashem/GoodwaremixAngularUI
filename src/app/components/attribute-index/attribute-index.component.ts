import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {AttributesDataSource} from "../../repo/AttributesDataSource";
import {ApiClient} from "../../repo/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, finalize, switchMap, tap} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Attribute} from "../../models/attribute.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SwapAttributeComponent} from "../shared/swap-attribute/swap-attribute.component";
import {NotificationService} from "../../service/notification-service";
import {error} from "@angular/compiler-cli/src/transformers/util";

export interface AttrDialogData {
  oldAttributeId: string;
  oldAttribute: string;
  newAttribute: Attribute;
}

@Component({
  selector: 'app-attribute-index',
  templateUrl: './attribute-index.component.html',
  styleUrls: ['./attribute-index.component.css']
})
export class AttributeIndexComponent implements OnInit {

  dataSource: AttributesDataSource;
  displayedColumns: string[] = ['fixed', 'Rating', 'supplierName', 'etimFeature', 'nameAttribute', 'allValue', 'actions'];

  searchSuppliersCtrl = new FormControl<string | Supplier>('');
  public supplierList: Supplier[] | undefined;  // public filteredSupplierList: Observable<Supplier[]> | undefined;
  selectedSupplier: Supplier | undefined;
  isLoading = false;
  supplierId: string | any; //todo shity bug!! need to upload whole Supplier and set it into this.selectedSupplier

  public withFixedAttrSelector?: any;

  public searchQuery: string | undefined;
  searchQueryCtrl  = new FormControl<string>('');

  constructor(
    public api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _notyf: NotificationService,
    private _ActivatedRoute:ActivatedRoute
  ) {
    this.dataSource = new AttributesDataSource(this.api);
    //this.withFixedAttrSelector = true;
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  ngOnInit(): any {
    this.api.getSuppliers('', 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.supplierId = params['supplierId'];
      if (this.supplierId) {
        this.api.getSupplierById(this.supplierId).subscribe( s => {
          this.selectedSupplier = s as Supplier;
          this.searchSuppliersCtrl.setValue(s as Supplier);
        })
      }
    });
    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.api.getSuppliers(value, 0 ,100, "SupplierName", "asc")
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
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => this.loadData())
      )
      .subscribe();
  }

  loadData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id ?? '', this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 15, this.withFixedAttrSelector);
  }

  addItem() {
    this._notyf.onWarning("TODO: не обработано")
    //todo show form to make a new attribute
  }

  editItem(id: any) {
    this.router.navigate([`attribute-edit/${id}`]);
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onSupplierSelected() {
    this.selectedSupplier = this.searchSuppliersCtrl.value as Supplier;
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  onFixedSelected() {
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  searchQueryChanged() {
    this.searchQuery = this.searchQueryCtrl.value ?? '';
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  onClearSupplierSelection() {
    this.selectedSupplier = undefined;
    this.searchSuppliersCtrl.setValue('');
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  swapItem(nameAttribute: string, id: string) {
    console.log(nameAttribute)

    this.openDialog(nameAttribute, id);
  }

  openDialog(nameAttribute: string, id: string): void {
    const dialogRef = this.dialog.open(SwapAttributeComponent, {
      width: '900px',
      height: '380px',
      data: { oldAttributeId: id, oldAttribute: nameAttribute, newAttribute: new Attribute() },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.swapAttribute(result.oldAttributeId, result.newAttribute.id).subscribe({
        next: next => {
          this._notyf.onSuccess("Данные сохранены успешно")
        },
        error: error => {
          this._notyf.onError(error.message);
        },
      });
    });
  }

  deleteItem(id:string) {
    this.api.deleteProductAttribute(id).subscribe( {
      next: next => {
        this._notyf.onSuccess('Аттрибут успешно удалён')
      },
      error: error => {
        this._notyf.onError(error.message)
      }
    })
  }

}

