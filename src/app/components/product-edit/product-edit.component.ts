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
  // Attr
  dataToDisplay:any = [];
  attrDataSource = new AttrDataSource(this.dataToDisplay)

  imagesToUpload:string[] = []

  displayedColumns: string[] = [ 'attributeKey', 'attributeValue', 'actions'];
  dataSource = new MatTableDataSource<any>()


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
        });
    }

    // this.attributeKeysListCtrl.valueChanges.pipe(
    //   //distinctUntilChanged(),
    //   debounceTime(100),
    //   tap(() => {
    //
    //   }),
    //   switchMap(value => this.api.getAttributes(value, '' ,0, 10, undefined, "Rating", "desc")
    //     .pipe(
    //       finalize(() => {
    //
    //       }),
    //     )
    //   )
    // )
    //   .subscribe((data: any) => {
    //     this.attributeList = data.body.data;
    //   });
    //this.attributeList = this.product.attributes

    this.product = new Product()
    //this.dataToDisplay
    console.log(this.product)


  }



  AddNewRow() {
    this.openDialog();
  }



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


  displayFn(attr: Attribute): string {
    return attr && attr.nameAttribute ? attr.nameAttribute + " [" + attr.etimFeature + "] от " + attr.supplierName : '';
  }




  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          // Push Base64 string
          this.imagesToUpload.push(event.target.result);
        }
        console.log(this.imagesToUpload)
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  // Remove Image
  removeImage(url:any){
    console.log(this.imagesToUpload,url);
    this.imagesToUpload = this.imagesToUpload.filter(img => (img != url));
  }

  submitProduct() {
    this.product.supplierName = 'iek'
    this.product.Id = ''
    this.product.supplierId = '624d278141034b896a223e4c'
    console.log('product', JSON.stringify(this.product))
    this.api.updateProduct(this.product).subscribe( x => {
        //console.log("updateSupplier: " +JSON.stringify(x) );
        this._notyf.onSuccess("Товар сохранен");
      },
      error => {
        console.log("updateSupplierError: " + JSON.stringify(error));
        this._notyf.onError("Ошибка: " + JSON.stringify(error));
        //todo обработчик ошибок, сервер недоступен или еще чего..
      });
  }


  deleteAttrRow(attribute: any) {
    this.product.attributes = this.product.attributes.filter(item => item.attributeId !== attribute.attributeId)
    this.attrDataSource.setData(this.product.attributes || []);
  }

  editAttrRow(attributeId: string, attributeName:string, value:string) {
    this.openDialog(attributeId,attributeName,value);
  }

  openDialog(attributeId?: string, attributeName?: string, value?:string): void {

    const dialogRef = this.dialog.open(AttributeEditorComponent, {
      width: '900px',
      height: '380px',
      data: { attributeId: attributeId, nameAttribute: attributeName, value:value, newAttribute: new AttributeProduct() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let attribute = new AttributeProduct()
        attribute.attributeId = result.attributeId
        attribute.attributeName = result.nameAttribute
        attribute.etimFeature = result.etimFeature
        attribute.etimUnit = result.etimUnit
        attribute.etimValue = result.etimValue
        attribute.unit = result.unit
        attribute.value = result.value
        this.product.attributes.unshift(attribute)
        this.attrDataSource.setData(this.product.attributes || []);
      }
     });
  }

}

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
