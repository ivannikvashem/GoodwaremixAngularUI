import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataStateService} from "../shared/data-state.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "../service/local-storage.service";
import {Subscription, take} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AttributeFilterComponent} from "./attribute-filter/attribute-filter.component";
import {SelectedFiltersList} from "./repo/ProductsDataSource";
import {AuthService} from "../auth/service/auth.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>(null);
  searchQuery:string = '';
  pageIndex:number = 0;
  pageSize:number = 12;
  sortDirection:string;
  sortActive:string = null;
  categoryId:number;

  //About to be deprecated
  cardLayout:boolean = true;

  filterAttribute:SelectedFiltersList = new SelectedFiltersList()

  pageCookie$ = this._localStorageService.myData$;
  pC: any = {};
  withICFilter: boolean = null;
  isModerated: boolean = null;
  containsCategory: boolean = null;
  roles:string[] = [];

  sortOptions =[
    { displayText: 'По умолчанию',  value: { active: null, direction: 'asc'} },
    { displayText: 'По названию ↑', value: { active: 'title', direction: 'asc' } },
    { displayText: 'По названию ↓', value: { active: 'title', direction: 'desc' } },
    { displayText: 'По vendorId ↑', value: { active: 'vendorId', direction: 'asc' } },
    { displayText: 'По vendorId ↓', value: { active: 'vendorId', direction: 'desc' } },
    { displayText: 'По артикулу ↑', value: { active: 'internalCode', direction: 'asc' } },
    { displayText: 'По артикулу ↓', value: { active: 'internalCode', direction: 'desc' } },
  ];
  selectedSort:any = this.sortOptions[0].value;

  private subscription: Subscription;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private dss: DataStateService,
    private _localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private auth:AuthService) {
    this.roles = this.auth.getRoles();
  }

  getCookie() {
    this._localStorageService.getDataByPageName("ProductIndex")
    this.pageCookie$.pipe(take(1)).subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery;
        this.pageIndex = this.pC.pageIndex;
        this.pageSize = this.pC.pageSize;
        this.withICFilter = this.pC.withInternalCodeSelector;
        this.filterAttribute = this.pC.filterAttribute;
        this.sortActive = this.pC.sortActive;
        this.sortDirection = this.pC.sortDirection;
        this.isModerated = this.pC.isModerated;
        this.cardLayout = this.pC.cardLayout;
        this.categoryId = this.pC.categoryId;
        this.containsCategory = this.pC.containsCategory;
        this.selectedSort = this.sortOptions.find(x => x.value.active === this.sortActive && x.value.direction === this.sortDirection)?.value;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("ProductIndex", {
      searchQuery: this.searchQuery,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      withInternalCodeSelector: this.withICFilter != undefined ? this.withICFilter : null,
      filterAttribute: this.filterAttribute != undefined ? this.filterAttribute : null,
      sortActive: this.sortActive,
      sortDirection: this.sortDirection,
      isModerated: this.isModerated != undefined ? this.isModerated : null,
      cardLayout: this.cardLayout,
      categoryId: this.categoryId,
      containsCategory: this.containsCategory
    });
  }

  ngOnInit(): void {
    this.getCookie();
    this.subscription = this.dss.getSelectedSupplier().subscribe((supplier:Supplier) => {
        this.selectedSupplier = supplier;
        if (supplier) {
          this.pageIndex = 0;
        }
      }
    )

    this.categoryId = +this._ActivatedRoute.snapshot.paramMap.get("categoryId");
  }

  searchQueryChanged() {
    this.pageIndex = 0;
    this.searchQuery = this.searchQueryCtrl.value;
    this.setCookie();
  }

  searchQueryClear() {
    this.pageIndex = 0;
    this.searchQueryCtrl.setValue('');
    this.searchQuery = '';
    this.setCookie();
  }

  onICFilterChanged(icFilterState: boolean) {
    this.withICFilter = icFilterState;
  }

  onModeratedChanged(state: boolean) {
    this.isModerated = state;
  }

  onCategoryContainsChanged(state: boolean) {
    this.containsCategory = state;
  }

  onCategoryIdChanged(id:number) {
    this.categoryId = id;
  }

  onPageParamsChanged(params: any) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.setCookie();
  }

  sortData() {
    this.sortActive = this.selectedSort.active;
    this.sortDirection = this.selectedSort.direction;
    this.setCookie();
  }

  attributeFilter() {
    const dialogRef = this.dialog.open(AttributeFilterComponent, {
      panelClass: ['dialog-gray-background', 'full-width'],
      data: {filter: JSON.stringify(this.filterAttribute), withICFilter:this.withICFilter, isModerated:this.isModerated, categoryId:this.categoryId, containsCategory:this.containsCategory},
      autoFocus:false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.selectedAttributes?.attributeSearchFilters?.length > 0) {
        this.filterAttribute = result.selectedAttributes;
      } else {
        this.filterAttribute = new SelectedFiltersList();
      }
      this.onModeratedChanged(result.isModerated);
      this.onICFilterChanged(result.withICFilter);
      this.onCategoryIdChanged(result.categoryId);
      this.onCategoryContainsChanged(result.containsCategory);
      this.pageIndex = 0;
      this.setCookie();
    });
  }

  filterLength() {
    let length = this.filterAttribute?.attributeSearchFilters.length;
    if (this.withICFilter == true || this.withICFilter == false) {
      length += 1;
    }
    if (this.isModerated == true || this.isModerated == false) {
      length += 1;
    }
    if (this.containsCategory == true || this.containsCategory == false) {
      length += 1;
    }
    if (this.categoryId) {
      length += 1;
    }

    return length;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeLayout() {
    this.cardLayout = !this.cardLayout;
    this.setCookie();
  }
}
