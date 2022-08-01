import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../../repo/ProductsDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {tap} from "rxjs";

export interface DialogData {
  src: '';
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
  public searchQuery = '';
  public withInternalCodeSelector: boolean;

  constructor(
    public api: ApiClient,
    public dialog: MatDialog,
    public router: Router,
  ) {
    this.dataSource = new ProductsDataSource(this.api);
    this.withInternalCodeSelector = false;
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  ngOnInit(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCodeSelector, 0, 10);
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => this.loadData())
      )
      .subscribe();
  }

  loadData(): any {
    //console.log("loadData, page: " + this.paginator?.pageIndex);
    console.log("loadData, withInternalCodeSelector: " + this.withInternalCodeSelector);
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCodeSelector, this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10);
  }

  deleteItem(_id: any) {

  }

  editItem(id: any) {
    console.log("nav!");
    //this.router.navigate([`attribute-edit/${id}`]);
  }

  addItem() {

  }

  changeImage(row: any, image: any) {
    this.hoverRowId = row.id;
    this.hoverImage = image;
    //console.log("Row: " + JSON.stringify(row.id));
    //console.log("Image: " + JSON.stringify(image));
  }
  openDialog(image: string) {
    console.log(image);
    let dialogBoxSettings = {
      /*maxHeight: '60%',*/
      maxWidth: '60%',
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(DialogDataExampleDialog, dialogBoxSettings);
  }
}
@Component({
  selector: 'dialog-data-example-dialog',
  template: `
    <!--<img style="max-width: 800px;  max-height: 800px;" src='{{data.src}}'>-->
    <img style="max-width: 95%;  max-height: 95%; margin: 0 auto; display: flex" src='{{data.src}}'>
`
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
