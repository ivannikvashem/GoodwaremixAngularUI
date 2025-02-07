import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiClient} from "../../service/httpClient";
import {Observable, tap} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "../../models/product.model";
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {SwapAttributeComponent} from "../../components/shared/swap-attribute/swap-attribute.component";
import {Attribute} from "../../models/attribute.model";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {Document} from "../../models/document.model";
import {Clipboard} from "@angular/cdk/clipboard";
import {AuthService} from "../../auth/service/auth.service";
import {finalize} from "rxjs/operators";
import {Category} from "../../models/category.model";
import {AttributesDataSource} from "../../attribute/repo/AttributesDataSource";
import {ProductsDataSource} from "../repo/ProductsDataSource";
import {DocumentsDataSource} from "../../document/repo/DocumentsDataSource";
import {CategoryDataSource} from "../../category/repo/CategoryDataSource";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {
  productId: string | any;
  product: Observable<Product> | any;
  displayedAttrColumns: string[] = ['etim', 'name', 'value', 'action'];
  dataSource = new MatTableDataSource();
  safeVideoUrl: SafeResourceUrl[] =[];
  selectedSafeVideo:SafeResourceUrl
  safeImg360Url: SafeResourceUrl | undefined
  remoteAndLocalImg:string[] = []
  isDelBtnDisabled:boolean = false
  productDocuments:Document[] = [];
  roles:string[] = [];
  isLoading:boolean = true;
  categoryTree: Category[] = [];

  constructor(
    private api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _ActivatedRoute:ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _notyf: NotificationService,
    private clipboard:Clipboard,
    private titleService:Title,
    private auth:AuthService,
    private productDS: ProductsDataSource,
    private attributeDS: AttributesDataSource,
    private documentDS: DocumentsDataSource,
    private categoryDS: CategoryDataSource) {
    this.roles = this.auth.getRoles();
  }

  ngOnInit(): void {
    this.fetchProductData()
  }

  fetchProductData() {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    this.productDS.getProductById(this.productId)
      .pipe(tap( () => { this.isLoading = true; }), finalize( () => this.isLoading = false))
      .subscribe( {next:(data) => {
        this.product = data.body;
        if (this.product.videos.length > 0)
          this.product.videos.forEach((value:any) => {this.safeVideoUrl.push(this._sanitizer.bypassSecurityTrustResourceUrl(value))});
        this.selectedSafeVideo = this.safeVideoUrl[0]
        this.dataSource = new MatTableDataSource(this.product.attributes);
        this.safeImg360Url = this._sanitizer.bypassSecurityTrustResourceUrl(this.product.image360)
        if (this.product.images) { this.product.images.forEach((value:any) => {this.remoteAndLocalImg.push(value)})}
        if (this.product.localImages) { this.product.localImages.forEach((value:any) => {this.remoteAndLocalImg.push(value)})}
        if (this.product.documents) {
          for (let i of this.product.documents) {
            this.documentDS.getDocumentById(i).subscribe(x => {
              if (x.body) {
                this.productDocuments.push(x.body);
              }
            })
          }
        }
        this.titleService.setTitle(this.product.internalCode ? 'арт. ' + this.product.internalCode + ' ' + this.product.title : this.product.title);
          if (this.product.categoryId) {
            this.categoryDS.getCategoryTreeById(this.product.categoryId).subscribe((x:any) => {
              this.categoryTree = x.body.result
            })
          }
      }, error: () => {
        this.router.navigate(['page-not-found'])
      }});
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
      this.attributeDS.swapAttribute(result.oldAttributeId, result.newAttribute.id, result.convertId).subscribe({
        next: () => {
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
        this.attributeDS.deleteProductAttribute(attributeId).subscribe( {
          next: () => {
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
    this.clipboard.copy(vendorId)
    this._notyf.onSuccess('Артикул поставщика скопирован')
  }

  attributeTypes:any[] = [
    {key:'R', type: 'range'},
    {key:'N', type: 'number'},
    {key:'L', type: 'boolean'},
    {key:'A', type: 'string'},
  ]

  isTypeValid(objectValue: any, type:string) {
    if (objectValue == undefined && type == undefined) {
      return null;
    }
    if (objectValue?.minValue && objectValue?.maxValue && type == 'R') {
      return true;
    } else {
      return typeof objectValue?.value == this.attributeTypes.find(x => x.key === type).type;
    }
  }

  typeofLogicalAttribute(objectValue:any) {
    return typeof objectValue;
  }

  goToCategory(id: string) {
    this.router.navigate([`products/${id}`]);
  }
}
