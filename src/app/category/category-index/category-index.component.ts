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
import {DataStateService} from "../../shared/data-state.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-category-index',
  templateUrl: './category-index.component.html',
  styleUrls: ['./category-index.component.css']
})
export class CategoryIndexComponent implements OnInit {

  dataSource: CategoryDataSource;
  searchQueryCtrl = new FormControl<string>('');
  displayedColumns: string[] = ['title', 'parentId', 'actions'];
  isLoading:boolean;
  scrollToTop:boolean;
  isPaginatorFixed:boolean;

  @Input() searchQuery:string;
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Input() sortActive:string;
  @Input() sortDirection:string;
  @Output() pageParams:EventEmitter<any> = new EventEmitter();
  @Output() sortParams:EventEmitter<any> = new EventEmitter();
  categoryDataSource = new MatTableDataSource<Category>()

  constructor(private api: ApiClient, public dialog: MatDialog, private dss: DataStateService) {
    this.dataSource = new CategoryDataSource(this.api)
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource.loading$.subscribe(loadState => {
      this.isLoading = loadState
    })

    this.dss.getSettings().subscribe((settings:any) => {
      this.scrollToTop = settings.scrollPageToTop;
      this.isPaginatorFixed = settings.isPaginatorFixed;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadCategoryPagedData()
  }

  ngAfterViewInit(): void {
    this.paginator?.page
      .pipe(
        tap( () => {
          if (this.scrollToTop) {
            window.scroll(0, 0);
          }
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }

  loadCategoryPagedData():any {
    this.dataSource.loadPagedData(this.searchQuery, this.pageIndex, this.pageSize);
    this.dataSource.connect(null).subscribe((categories: Category[]) => {
      this.categoryDataSource.data = categories;
    })
  }

  sortData(sort: any) {
    this.sortParams.next({direction: sort.direction, active:sort.active});
  }

  editCategory(category:Category) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      autoFocus: false,
      data: category,
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

  addCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.dataSource.insertCategory(result);
      }
    });
  }
}
