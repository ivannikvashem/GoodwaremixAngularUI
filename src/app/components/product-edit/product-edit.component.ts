import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../repo/httpClient";
import {Product} from "../../models/product.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributeProduct} from "../../models/attributeProduct.model";
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import {DataSource} from "@angular/cdk/collections";
import {debounceTime, distinctUntilChanged, Observable, ReplaySubject, startWith, switchMap, tap} from "rxjs";
import {Attribute} from "../../models/attribute.model";
import {AttributesDataSource} from "../../repo/AttributesDataSource";
import {finalize} from "rxjs/operators";
import {NotificationService} from "../../service/notification-service";
import {MatTableDataSource} from "@angular/material/table";
import {AttributeFiltration} from "../../models/attributeFiltration.model";
import {ActivatedRoute} from "@angular/router";
import {Dimensions} from "../../models/dimensions.model";
import {Multipliers} from "../../models/multipliers.model";
import {SwapAttributeComponent} from "../shared/swap-attribute/swap-attribute.component";
import {MatDialog} from "@angular/material/dialog";
import {AttributeEditComponent} from "../attribute-edit/attribute-edit.component";
import {AttributeEditorComponent} from "../shared/attribute-editor/attribute-editor.component";
import {resolveLiteral} from "@angular/compiler-cli/src/ngtsc/annotations/common";
import {Package} from "../../models/package.model";
import {ProductImageViewmodel} from "../../models/viewmodels/productImage.viewmodel";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // Supplier
  public supplierList: Supplier[];  // public filteredSupplierList: Observable<Supplier[]> | undefined;
  selectedSupplier: Supplier;
  searchSupplierCtrl = new FormControl<string | Supplier>('')
  //Product
  product:Product;
  productId:string = '';
  imagesToUpload:File[] = []
  // Attr
  dataToDisplay:any = [];
  attrDataSource = new AttrDataSource(this.dataToDisplay)
  attributeColumns: string[] = [ 'attributeKey', 'attributeValue', 'actions'];
  dataSource = new MatTableDataSource<any>()

  // Package
  packageColumns: string[] = [ 'package', 'actions'];

  packDataSource = new PackDataSource(this.dataToDisplay);


  constructor(public api:ApiClient,
              private _ActivatedRoute:ActivatedRoute,
              public _notyf:NotificationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    this.api.getSuppliers('', 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });

    if (this.productId) {
      this.api.getProductById(this.productId)
        .subscribe( (s:any) => {
          this.product = s.body as Product;
          this.attrDataSource.setData(this.product.attributes || []);
          this.packDataSource.setData(this.product.package || []);
        });

      this.searchSupplierCtrl.setValue(this.product.supplierName as string)
    }
    else{ this.product = new Product() }
  }


  // Media
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          // Push Base64 string
          this.imagesToUpload.unshift(event.target.result);
        }
        console.log(this.imagesToUpload)
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    console.log(this.product.images)
  }

  removeImage(url:any){
    this.product.images = this.product.images.filter(img => (img != url));
  }

  addVideo($event: MatChipInputEvent) {
    const value = ($event.value || '').trim()
    if (value) { this.product.videos.push(value)}
    $event.chipInput!.clear()
  }
  removeVideo(video:string) {
    const index = this.product.videos.indexOf(video)
    if (index >= 0) {
      this.product.videos.splice(index,1)
    }
  }

  // About product
  addGTD($event: MatChipInputEvent) {
    const value = ($event.value || '').trim()
    if (value) { this.product.gtd.push(value)}
    $event.chipInput!.clear()
  }
  removeGTD(gtd:string) {
    const index = this.product.gtd.indexOf(gtd)
    if (index >= 0) {
      this.product.gtd.splice(index,1)
    }
  }
  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName;
  }

  // Attribute
  AddNewRowAttribute() {
    this.openAttributeEditorDialog();
  }

  editAttrRow(row:any) {
    this.openAttributeEditorDialog(row);
  }

  deleteAttrRow(attribute: any) {
    this.product.attributes = this.product.attributes.filter(item => item.attributeId !== attribute.attributeId)
    this.attrDataSource.setData(this.product.attributes || []);
  }

  openAttributeEditorDialog(oldAttribute?:any): void {

    const dialogRef = this.dialog.open(AttributeEditorComponent, {
      width: '900px',
      height: '380px',
      data: { oldAttribute: oldAttribute, newAttribute: new AttributeProduct() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.product.attributes.filter(x => x.value !== result.newAttribute?.value)) {
        if (result.newAttribute?.value !== undefined) {
          if (oldAttribute == undefined) {
            this.product.attributes.unshift(result.newAttribute as AttributeProduct)
            this.attrDataSource.setData(this.product.attributes || []);
          }
          else {
            if (oldAttribute !== result.newAttribute) {
              const target = this.product.attributes.find((obj) => obj.value === oldAttribute.value)
              const a = this.product.attributes.find(x => x.value).value == result.newAttribute.value
              Object.assign(target, result.newAttribute)
            }
          }
        }
      }
    });
  }








  submitProduct() {
    console.log('product', JSON.stringify(this.product))
    const productToAdd = new ProductImageViewmodel()
    productToAdd.product = this.product
    productToAdd.files = this.imagesToUpload
    console.log('product to add',productToAdd)

    this.api.updateProduct(productToAdd).subscribe(x => {
        //console.log("updateSupplier: " +JSON.stringify(x) );
        this._notyf.onSuccess("Товар сохранен");
      },
      error => {
        console.log("updateSupplierError: " + JSON.stringify(error));
        this._notyf.onError("Ошибка: " + JSON.stringify(error));
        //todo обработчик ошибок, сервер недоступен или еще чего..
      });
  }
}


// Service
class AttrDataSource extends DataSource<AttributeProduct> {
  private _dataStream = new ReplaySubject<AttributeProduct[]>();
  constructor(initialData: AttributeProduct[]) {
    super();
    this.setData(initialData);
  }
  connect(): Observable<AttributeProduct[]> {
    return this._dataStream;
  }
  disconnect() {}
  setData(data: AttributeProduct[]) {
    this._dataStream.next(data);
  }
}

class PackDataSource extends DataSource<Package> {
  private _dataStream = new ReplaySubject<Package[]>();
  constructor(initialData: Package[]) {
    super();
    this.setData(initialData);
  }
  connect(): Observable<Package[]> {
    return this._dataStream;
  }
  disconnect() {}
  setData(data: Package[]) {
    this._dataStream.next(data);
  }
}
