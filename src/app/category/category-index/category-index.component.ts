import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Supplier} from "../../models/supplier.model";
import {FormControl} from "@angular/forms";
import {ApiClient} from "../../service/httpClient";
import {MatDialog} from "@angular/material/dialog";
import {CategoryDataSource} from "../repo/CategoryDataSource";
import {tap} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Category} from "../../models/category.model";
import {CategoryEditComponent} from "../category-edit/category-edit.component";

@Component({
  selector: 'app-category-index',
  templateUrl: './category-index.component.html',
  styleUrls: ['./category-index.component.css']
})
export class CategoryIndexComponent implements OnInit {

  dataSource: CategoryDataSource;
  searchQueryCtrl = new FormControl<string>('');
  displayedColumns: string[] = ['title', 'parentId', 'venderId', 'supplierId', 'description', 'actions'];
  isLoading:boolean;

  @Input() searchQuery:string;
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Input() sortActive:string;
  @Input() sortDirection:string;
  @Output() pageParams:EventEmitter<any> = new EventEmitter();
  @Output() sortParams:EventEmitter<any> = new EventEmitter();

  constructor(private api: ApiClient, public dialog: MatDialog) {
    this.dataSource = new CategoryDataSource(this.api)
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource.loading$.subscribe(loadState => {
      this.isLoading = loadState
    })

    this.loadCategoryPagedData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadCategoryPagedData()
  }

  ngAfterViewInit(): void {
    this.paginator?.page
      .pipe(
        tap( () => {
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }

  loadCategoryPagedData():any {
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id,  this.pageIndex, this.pageSize, this.sortActive, this.sortDirection);
  }

  sortData(sort: any) {
    this.sortParams.next({direction: sort.direction, active:sort.active});
  }

  editCategory(category:Category) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      autoFocus: false,
      data: { oldCategory: category, newCategory: new Category() },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != '') {
        //this.loadDocumentPagedData()
      }
    });
  }

  deleteCategory(id:string) {
    this.dataSource.deleteCategory(id);
  }
}
