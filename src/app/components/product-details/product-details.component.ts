import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiClient} from "../../repo/httpClient";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "../../models/product.model";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SwapAttributeComponent} from "../shared/swap-attribute/swap-attribute.component";
import {Attribute} from "../../models/attribute.model";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {

  productId: string | any;
  product: Observable<Product> | any;
  displayedAttrColumns: string[] = ['etim', 'name', 'value','unit', 'action'];
  dataSource = new MatTableDataSource();
  safeVideoUrl: SafeResourceUrl[] =[];
  selectedSafeVideo:SafeResourceUrl
  safeImg360Url: SafeResourceUrl | undefined
  remoteAndLocalImg:string[] = []
  isDelBtnDisabled:boolean = false

  constructor(
    private api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _ActivatedRoute:ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _notyf: NotificationService
  ) { }

  ngOnInit(): void {
    this.fetchProductData()
  }

  fetchProductData() {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    this.api.getProductById(this.productId).subscribe(
      data => {
        this.product = data.body;
        if (this.product.videos.length > 0)
          this.product.videos.forEach((value:any) => {this.safeVideoUrl.push(this._sanitizer.bypassSecurityTrustResourceUrl(value))});
        this.selectedSafeVideo = this.safeVideoUrl[0]
        this.dataSource = new MatTableDataSource(this.product.attributes);
        this.safeImg360Url = this._sanitizer.bypassSecurityTrustResourceUrl(this.product.image360)
        if (this.product.images) { this.product.images.forEach((value:any) => {this.remoteAndLocalImg.push(value)})}
        if (this.product.localImages) { this.product.localImages.forEach((value:any) => {this.remoteAndLocalImg.push(value)})}
      }
    );
  }

  swapItem(nameAttribute: string, id: string) {
    this.openDialog(nameAttribute, id);
  }

  openDialog(nameAttribute: string, id: string): void {
    const dialogRef = this.dialog.open(SwapAttributeComponent, {
      width: '900px',
      height: '380px',
      data: { oldAttributeId: id, oldAttribute: nameAttribute, newAttribute: new Attribute() },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.swapAttribute(result.oldAttributeId, result.newAttribute.id).subscribe({
        next: next => {
          this.fetchProductData()
          this._notyf.onSuccess('Данные сохранены успешно');
        },
        error: error => {
          this._notyf.onError(error.message)
        },
      });
    });
  }

  deleteAttr(attributeName:string, attributeId:string) {
    this.isDelBtnDisabled = true
    const message = `Добавить в исключения атрибут ` + attributeName + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.api.deleteProductAttribute(attributeId).subscribe( {
          next: next => {
            this.fetchProductData()
            this._notyf.onSuccess('Успешно исключен')
            this.isDelBtnDisabled = false
          },
          error: error => {
            this._notyf.onError(error.error())
            this.isDelBtnDisabled = false
          }
        })
      }
      else {
        this.isDelBtnDisabled = false
      }
    });
  }

  goToEdit(Id: string) {
    this.router.navigate([`product-edit/${Id}`]);
  }

  copyVendorId(vendorId: string) {
    navigator.clipboard.writeText(vendorId)
    this._notyf.onSuccess('Артикул поставщика скопирован')
  }
}
