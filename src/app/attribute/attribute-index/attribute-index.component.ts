import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AttributesDataSource} from "../repo/AttributesDataSource";
import {ApiClient} from "../../service/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription, tap} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {Supplier} from "../../models/supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {Attribute} from "../../models/attribute.model";
import {SwapAttributeComponent} from "../../components/shared/swap-attribute/swap-attribute.component";
import {NotificationService} from "../../service/notification-service";
import {LocalStorageService} from "../../service/local-storage.service";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";

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

  pageTitle = 'AttributeIndex'
  dataSource: AttributesDataSource;
  displayedColumns: string[] = ['fixed', 'Rating', 'etimFeature', 'nameAttribute', 'allValue', 'actions'];
  isLoading = false;
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};


  @Input() searchQuery:string;
  @Input() withFixedAttrSelector = false;
  //selectedSupplier: Supplier = this.dss.selectedSupplierState.value
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Output() pageParams:EventEmitter<any> = new EventEmitter()
  private sub: Subscription;


  constructor(
    private api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _notyf: NotificationService,
    private _ActivatedRoute:ActivatedRoute,
    private _localStorageService: LocalStorageService,
  ) {
    this.dataSource = new AttributesDataSource(this.api);
  }
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loadAttributePagedData(false)
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadAttributePagedData(true);
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }

  loadAttributePagedData(isPaginatorParams:boolean): any {
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id, isPaginatorParams ? this.paginator?.pageIndex : this.pageIndex,isPaginatorParams ? this.paginator?.pageSize : this.pageSize, this.withFixedAttrSelector);
  }

  editItem(id: any) {
    this.router.navigate(['attribute-edit', id]);
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
  }
}
