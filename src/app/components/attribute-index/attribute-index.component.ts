import {Component, OnInit, ViewChild} from '@angular/core';
import {AttributesDataSource} from "../../repo/AttributesDataSource";
import {ApiClient} from "../../repo/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {tap} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {Attribute} from "../../models/attribute.model";
import {SwapAttributeComponent} from "../shared/swap-attribute/swap-attribute.component";
import {NotificationService} from "../../service/notification-service";
import {LocalStorageService} from "../../service/local-storage.service";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";

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
  withFixedAttrSelectorCtrl = new FormControl<boolean | null>(null);
  public selectedSupplier:Supplier = new Supplier()
  isLoading = false;
  searchQueryCtrl  = new FormControl<string>('');
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  private sub: any;

  constructor(
    private api: ApiClient,
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

  setCookie() {
    // on each interaction - save all controls state to cookies
    let supp = this.selectedSupplier;
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
      this.pC = x;
      this.searchQueryCtrl.setValue(this.pC.searchQuery);
      this.selectedSupplier =  this.pC.supplier as Supplier;
      this.withFixedAttrSelectorCtrl.setValue(this.pC.withFixedAttrSelector);
    });
  }

  ngOnInit(): any {
    this.getCookie();

    Promise.resolve().then(() => {
      this.paginator.pageIndex = this.pC.pageIndex;
      this.paginator.pageSize = this.pC.pageSize;
      //this.sort.direction = this.pC.sortDirection;
      //this.sort.active = this.pC.sortField;
      this.loadData();
    })

    this._ActivatedRoute.queryParams.subscribe(params => {
      let supplierId = params['supplierId'];
      if (supplierId) {
        this.pC.supplierId = supplierId;
        this.selectedSupplier = ({id: supplierId} as Supplier);
      }
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadData();
          this.setCookie();
        })
      ).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); //crutch to dispose subs
  }

  loadData(): any {
    this.dataSource.loadPagedData(this.searchQueryCtrl.value, this.selectedSupplier.id, this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 15, this.withFixedAttrSelectorCtrl.value);
  }

  editItem(id: any) {
    this.router.navigate([`attribute-edit/${id}`])
  }

  onQueryChanged() {
    this.paginator.pageIndex = 0;
    this.loadData();
    this.setCookie();
  }

  swapItem(nameAttribute: string, id: string) {
    this.openDialog(nameAttribute, id);
  }

  openDialog(nameAttribute: string, id: string): void {
    const dialogRef = this.dialog.open(SwapAttributeComponent, {
      width: '900px',
      data: { oldAttributeId: id, oldAttribute: nameAttribute, newAttribute: new Attribute() },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.swapAttribute(result.oldAttributeId, result.newAttribute.id).subscribe({
        next: next => {
          this._notyf.onSuccess("Атрибут переназначен")
        },
        error: error => {
          this._notyf.onError(error.message);
        },
      });
    });
  }

  confirmDeleteDialog(id: string, name: string): void {
    const message = `Удалить атрибут ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.dataSource.deleteAttribute(id);
      }
    });
  }

  switchFixAttr(id: any, val: boolean) {
    this.api.switchFixAttribute(id).subscribe({
      next: next => {
        this.dataSource.updateFixedAttributeState(id, val);
        this._notyf.onSuccess("Статус атрибута изменен")
      },
      error: error => {
        this._notyf.onError(error.message);
      },
    });
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier
    this.onQueryChanged()
  }
}

