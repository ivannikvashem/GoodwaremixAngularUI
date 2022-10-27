import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../../repo/ProductsDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Observable,
  pipe,
  startWith,
  switchMap,
  tap, timer
} from "rxjs";
import {FormControl} from '@angular/forms';
import {Supplier} from "../../models/supplier.model";
import {LocalStorageService} from "../../service/local-storage.service";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";
import {NotificationService} from "../../service/notification-service";
import {Attribute} from "../../models/attribute.model";
import {MissingImageHandler} from "../../repo/MissingImageHandler";
import {Product} from "../../models/product.model";

export interface DialogData {
  src: '';
}

export class SelectedFilterAttributes {
  attributeName:string
  selectedValues:string[] = []
}

class PageCookieProductIndex {
  pageIndex: number = 1;
  pageSize: number = 10;
  searchQuery: string = "";
  withInternalCodeSelector: boolean = false;
  supplierId: string = "";
  supplier: Supplier;

  constructor() {
    this.supplier = {id: this.supplierId} as Supplier;
  }
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

  attributeValueFilterCtrl = new FormControl('');
  searchQueryCtrl  = new FormControl<string>('');
  withInternalCodeCtrl  = new FormControl<boolean>(false);
  attributesForFilter:Attribute[]
  selectedFilterAttributes:SelectedFilterAttributes[] = []
  filteredAttributeValues: Observable<string[]>;
  selectedSupplier:Supplier = new Supplier()

  isLoading = false;
  productId: string | any;
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  private sub: any;

  constructor(
    public api: ApiClient,
    public dialog: MatDialog,
    public router: Router,
    private _ActivatedRoute:ActivatedRoute,
    private _localStorageService: LocalStorageService,
    private _notyf: NotificationService,
    private imgHandler:MissingImageHandler
  ) {
    this.dataSource = new ProductsDataSource(this.api);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator

  setCookie() {
    // on each interaction - save all controls state to cookies
    console.log('set')
    let supp;
    if (this.selectedSupplier === undefined) {
      supp = new Supplier()
    } else {
      supp = this.selectedSupplier
    }
    console.log(supp)
    this._localStorageService.setDataByPageName(this.constructor.name, {
      searchQuery: this.searchQueryCtrl.value,
      pageIndex: this.paginator?.pageIndex,
      pageSize: this.paginator?.pageSize,
      withInternalCodeSelector: this.withInternalCodeCtrl.value,
      supplier: {id: supp.id, supplierName: supp.supplierName} as Supplier
    });
  }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    console.log(this._localStorageService.myData$)
    this._localStorageService.getDataByPageName(this.constructor.name) as PageCookieProductIndex; //pretty wrong, upd data
    this.sub = this.pageCookie$.subscribe(x => {
      if (!x) return;
      //console.log("pc: " + JSON.stringify(x.pageIndex));
      this.pC = x;
      this.searchQueryCtrl.setValue(this.pC.searchQuery);
      this.selectedSupplier = this.pC.supplier as Supplier
      this.withInternalCodeCtrl.setValue(this.pC.withInternalCodeSelector);
    });
  }

  ngOnInit() {
    this.getCookie();

    Promise.resolve().then(() => {
      this.paginator.pageIndex = this.pC.pageIndex;
      this.paginator.pageSize = this.pC.pageSize;
      this.loadProductPagedData();
    })

    this._ActivatedRoute.queryParams.subscribe(params => {
      let supplierId = params['supplierId'];
      if (supplierId) {
        this.pC.supplierId = supplierId;
        this.selectedSupplier = ({id: supplierId} as Supplier);
      }
    });

    // this.searchQueryCtrl.valueChanges.pipe(
    //   distinctUntilChanged(),
    //   debounceTime(700)
    // ).subscribe(()=> {
    //   this.onQueryChanged();
    // })

    // this.api.getAttributes('','',0,10,true,"Rating", "desc").subscribe((r:any) => {
    //   this.attributesForFilter = r.body.data
    // });
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadProductPagedData();
          this.setCookie();
        })
      ).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); //crutch to dispose subs
  }

  onQueryChanged() {
    if (this.paginator.pageIndex != 0) {
      this.paginator.pageIndex = 0;
    }
    this.loadProductPagedData();
    this.setCookie();
  }

  loadProductPagedData(): any {
    this.dataSource.loadPagedData(this.searchQueryCtrl.value, this.withInternalCodeCtrl.value, this.selectedSupplier?.id, this.paginator.pageIndex, this.paginator.pageSize, this.selectedFilterAttributes);
  }

  confirmDeleteDialog(id: string, name: string): void {
    const message = `Удалить товар ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.dataSource.deleteProduct(id);
      }
    });
  }

  goToItemDetails(id: any) {
    this.router.navigate([`product-details/${id}`]);
  }

  goToEditItem(id:string) {
    this.router.navigate([`product-edit/${id}`]);
  }

  changeImage(row: any, image: any) {
    this.hoverRowId = row.id;
    this.hoverImage = image;
  }
  openDialog(image: string) {
    let dialogBoxSettings = {
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(DialogDataExampleDialog, dialogBoxSettings);
  }
  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }

  copyVendorId(vendorId: string) {
    navigator.clipboard.writeText(vendorId)
    this._notyf.onSuccess('Артикул поставщика скопирован')
  }

  // filtrationSearch(filterSearch: HTMLInputElement, attributeId:string) {
  //   this.api.getAttributeById(attributeId).subscribe((r:any) => {
  //     this.attributesForFilter.find(attr => attr.id === attributeId).allValue = r.body.allValue.filter((value:any) => {
  //       return value.toLowerCase().includes(filterSearch.value.toLowerCase())
  //     })
  //   })
  // }
  //
  // attributeValueChecked($event: any,nameAttribute: string, value: string) {
  //   console.log($event.source._selected)
  //   const isChecked = $event.source._selected
  //   const selectedAttribute:SelectedFilterAttributes = new SelectedFilterAttributes()
  //   if (isChecked) {
  //     if (this.selectedFilterAttributes.some(n => n.attributeName === nameAttribute)) {
  //       this.selectedFilterAttributes.forEach(att => {
  //         if (att.attributeName == nameAttribute) {
  //           att.selectedValues.push(value)
  //         }
  //       })
  //     }
  //     else {
  //       selectedAttribute.attributeName = nameAttribute
  //       selectedAttribute.selectedValues.push(value)
  //       this.selectedFilterAttributes.push(selectedAttribute)
  //     }
  //   }
  //   else {
  //
  //   }
  //
  //   this.onQueryChanged();
  //   console.log('selected', selectedAttribute)
  //   console.log('selected list',this.selectedFilterAttributes)
  // }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier
    this.onQueryChanged()
  }
}
@Component({
  selector: 'dialog-data-example-dialog',
  template: `
    <img (error)="handleMissingImage($event)" style="max-width: 800px;  max-height: 800px;" src='{{data.src}}'>
<!--    <img (error)="handleMissingImage($event)" style="max-width: 95%;  max-height: 95%; margin: 0 auto; display: flex" src='{{data.src}}'>-->
`
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private imgHandler:MissingImageHandler) {}

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }
}
