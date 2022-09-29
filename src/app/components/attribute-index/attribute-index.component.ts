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
import {SwapAttributeComponent} from "../shared/swap-attribute/swap-attribute.component";
import {NotificationService} from "../../service/notification-service";
import {LocalStorageService} from "../../service/local-storage.service";

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
  withFixedAttrSelectorCtrl = new FormControl<boolean | null>(null);
  public supplierList: Supplier[] | undefined;  // public filteredSupplierList: Observable<Supplier[]> | undefined;
  isLoading = false;
  searchQueryCtrl  = new FormControl<string>('');

  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  private sub: any;

  constructor(
    public api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _notyf: NotificationService,
    private _ActivatedRoute:ActivatedRoute,
    private _localStorageService: LocalStorageService
  ) {
    this.dataSource = new AttributesDataSource(this.api);
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  ngOnInit(): any {
    this.getCookie();

    Promise.resolve().then(() => {
      this.paginator.pageIndex = this.pC.pageIndex;
      this.paginator.pageSize = this.pC.pageSize;
      //this.sort.direction = this.pC.sortDirection;
      //this.sort.active = this.pC.sortField;
      this.loadData();
    })

    this.api.getSuppliers('', 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });

    this._ActivatedRoute.queryParams.subscribe(params => {
      let supplierId = params['supplierId'];
      if (supplierId) {
        this.api.getSupplierById(supplierId).subscribe( s => {
          this.searchSuppliersCtrl.setValue(s.body as Supplier);
        })
      }
    });

    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
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
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadData();
          this.setCookie();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); //crutch to dispose subs
  }

  setCookie() {
    // on each interaction - save all controls state to cookies
    let supp = this.searchSuppliersCtrl.value as Supplier;
    this._localStorageService.setDataByPageName(this.constructor.name, {
      searchQuery: this.searchQueryCtrl.value,
      pageIndex: this.paginator?.pageIndex,
      pageSize: this.paginator?.pageSize,
      //sortDirection: this.sort?.direction,
      //sortField: this.sort?.active
      withFixedAttrSelector: this.withFixedAttrSelectorCtrl?.value ?? null,
      supplier: {id: supp.id, supplierName: supp.supplierName} as Supplier
    });
  }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    this._localStorageService.getDataByPageName(this.constructor.name); //pretty wrong, upd data
    this.sub = this.pageCookie$.subscribe(x => {
      if (!x) return;
      console.log("pc: " + JSON.stringify(x));
      this.pC = x;
      this.searchQueryCtrl.setValue(this.pC.searchQuery);
      this.searchSuppliersCtrl.setValue(this.pC.supplier as Supplier);
      this.withFixedAttrSelectorCtrl.setValue(this.pC.withFixedAttrSelector);
    });
  }

  loadData(): any {
    this.dataSource.loadPagedData(this.searchQueryCtrl.value, (this.searchSuppliersCtrl.value as Supplier)?.id, this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 15, this.withFixedAttrSelectorCtrl.value);
  }

  addItem() {
    this._notyf.onWarning("TODO: не обработано")
    //todo show form to make a new attribute
  }

  editItem(id: any) {
    console.log('id',id)
    this.router.navigate([`attribute-edit/${id}`]);
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onQueryChanged() {
    this.paginator.pageIndex = 0;
    this.loadData();
    this.setCookie();
  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onQueryChanged();
  }

  swapItem(nameAttribute: string, id: string) {
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
}

