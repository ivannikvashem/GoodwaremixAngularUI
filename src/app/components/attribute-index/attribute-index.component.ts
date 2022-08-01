import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../../repo/ProductsDataSource";
import {AttributesDataSource} from "../../repo/AttributesDataSource";
import {ApiClient} from "../../repo/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {Attribute} from "../../models/attribute.model";
import {tap} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-attribute-index',
  templateUrl: './attribute-index.component.html',
  styleUrls: ['./attribute-index.component.css']
})
export class AttributeIndexComponent implements OnInit {

  searchQuery = '';
  dataSource: AttributesDataSource;
  displayedColumns: string[] = ['fixed', 'rating', 'etimFeature', 'nameAttribute', 'allValue', 'actions'];

  constructor(
    public api: ApiClient,
    private router: Router
  ) {
    this.dataSource = new AttributesDataSource(this.api);
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  ngOnInit(): any {
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
    this.dataSource.loadPagedData(this.searchQuery,this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10);
  }

  addItem() {

  }


  editItem(id: any) {
    console.log("nav!");
    this.router.navigate([`attribute-edit/${id}`]);
  }

  deleteItem(_id: any) {

  }
}
