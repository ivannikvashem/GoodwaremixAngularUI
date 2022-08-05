import {Component, OnInit, ViewChild} from '@angular/core';
import {SuppliersDataSource} from "../../repo/SuppliersDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-supplier-index',
  templateUrl: './supplier-index.component.html',
  styleUrls: ['./supplier-index.component.css']
})
export class SupplierIndexComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'fullfill', 'brands', 'stat', 'actions'];
  dataSource: SuppliersDataSource;

  constructor(
    public api: ApiClient,
    private router: Router
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
    //console.log("pager: " + JSON.stringify(this.paginator));
    this.dataSource.loadPagedData("", this.paginator?.pageIndex, this.paginator?.pageSize);
  }

  addItem() {

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
    this.router.navigate([`supplier-edit/${supplierName}`]);
  }

  deleteItem(id: any) {

  }
}
