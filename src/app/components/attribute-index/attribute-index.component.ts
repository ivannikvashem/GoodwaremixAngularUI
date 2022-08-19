import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../../repo/ProductsDataSource";
import {AttributesDataSource} from "../../repo/AttributesDataSource";
import {ApiClient} from "../../repo/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {Attribute} from "../../models/attribute.model";
import {debounceTime, distinctUntilChanged, finalize, switchMap, tap} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";

@Component({
  selector: 'app-attribute-index',
  templateUrl: './attribute-index.component.html',
  styleUrls: ['./attribute-index.component.css']
})
export class AttributeIndexComponent implements OnInit {

  dataSource: AttributesDataSource;
  displayedColumns: string[] = ['fixed', 'rating', 'supplierName', 'etimFeature', 'nameAttribute', 'allValue', 'actions'];

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
    private _ActivatedRoute:ActivatedRoute
  ) {
    this.dataSource = new AttributesDataSource(this.api);
    //this.withFixedAttrSelector = true;
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
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id, this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10, this.withFixedAttrSelector);
  }

  addItem() {

  }

  editItem(id: any) {
    console.log("nav!");
    this.router.navigate([`attribute-edit/${id}`]);
  }

  deleteItem(_id: any) {

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

  onFixedSelected() {
    console.log(this.withFixedAttrSelector);
    this.loadData();
  }

  searchQueryChanged() {
    this.searchQuery = this.searchQueryCtrl.value ?? '';
    this.loadData();
  }
}
