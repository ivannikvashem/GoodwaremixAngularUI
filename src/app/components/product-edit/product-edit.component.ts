import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../repo/httpClient";
import {Product} from "../../models/product.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributeProduct} from "../../models/attributeProduct.model";
import {DataSource} from "@angular/cdk/collections";
import {Observable, ReplaySubject} from "rxjs";
import {NotificationService} from "../../service/notification-service";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AttributeEditorComponent} from "../shared/attribute-editor/attribute-editor.component";
import {Package} from "../../models/package.model";
import {ProductImageViewmodel} from "../../models/viewmodels/productImage.viewmodel";
import {Document} from "../../models/document.model";
import {DocumentEditorComponent} from "../shared/document-editor/document-editor.component";
import {HttpClient} from "@angular/common/http";
import {PackageEditorComponent} from "../shared/package-editor/package-editor.component";

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
  imagesView:string[] =[]
  // Attr
  dataToDisplayAttr:any = [];
  attrDataSource = new AttrDataSource(this.dataToDisplayAttr)
  attributeColumns: string[] = [ 'attributeKey', 'attributeValue', 'action'];
  dataSource = new MatTableDataSource<any>()

  // Package
  dataToDisplayPck:any = [];
  packageColumns: string[] = [ 'package', 'action'];
  packDataSource = new PackDataSource(this.dataToDisplayPck);

  // Document
  dataToDisplayDoc:any = [];
  documentColumns:string[] = ['title', 'action']
  documentDataSource = new DocumentDataSource(this.dataToDisplayDoc)



  constructor(public api:ApiClient,
              private _ActivatedRoute:ActivatedRoute,
              public _notyf:NotificationService,
              public dialog: MatDialog,
              public http:HttpClient) { }

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    if (this.productId) {
      this.api.getProductById(this.productId)
        .subscribe( (s:any) => {
          console.log('res prod', s.body)

          this.product = s.body as Product;
          this.attrDataSource.setData(this.product.attributes || []);
          this.packDataSource.setData(this.product.packages || []);
          this.documentDataSource.setData(this.product.documents || []);
          this.product.images.forEach((value) => {this.imagesView.unshift(value) })
          console.log('prod', this.product)
        });


    }
    else {
      this.product = new Product()
      this.api.getSuppliers('', 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
        this.supplierList = r.body.data
      });
    }

  }



// Media
  onFileChange(event: any) {
    //this.imagesToUpload.push(event.target.files[0] as File[])
    console.log(this.imagesToUpload)

    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      const files:File[] = event.target.files
      for (let i of files) {
        this.imagesToUpload.unshift(i)
      }
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          this.imagesView.unshift(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    //this.imagesToUpload.push(event.target.files[0] as File[])
  }

  removeImage(url:any){
    this.imagesView = this.imagesView.filter(img => (img != url));
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
    console.log('att', oldAttribute)
    const dialogRef = this.dialog.open(AttributeEditorComponent, {
      width: '900px',
      height: '380px',
      data: { oldAttribute: oldAttribute, newAttribute: new AttributeProduct() },
      autoFocus:false
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

  // Package
  addNewPackage() {
    this.openPackageEditorDialog()
  }

  editPackageRow(row:any) {
    this.openPackageEditorDialog(row)
  }

  deletePackageRow(row:any) {
    this.product.packages = this.product.packages.filter(dc => (dc != row))
    this.packDataSource.setData(this.product.packages || []);
  }

  openPackageEditorDialog(oldPackage?:any): void {

    const dialogRef = this.dialog.open(PackageEditorComponent, {
      width: '900px',
      height: '650px',
      data: { oldPackage: oldPackage, newPackage: new Package()},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('pck data',result)
      console.log('packages', this.product.packages)
      if (this.product.packages.filter(x => x.barcode !== result.newPackage?.barcode)) {

        if (result.newPackage !== undefined) {
          console.log('pck data', result)

          if (oldPackage == undefined) {
            console.log(this.product)
            this.product.packages.unshift(result.newPackage as Package)
            this.packDataSource.setData(this.product.packages || []);
          } else {
            if (oldPackage !== result.newPackage) {
              const target = this.product.packages.find((obj) => obj === oldPackage)
              Object.assign(target, result.newPackage)
            }
          }
        }
      }
    });
  }

  // Document
  AddNewDocument() {
    this.openDocumentEditorDialog()
  }


  editDocRow(row:any) {
    this.openDocumentEditorDialog(row)
  }


  deleteDocRow(row:any) {
    this.product.documents = this.product.documents.filter(dc => (dc != row))
    this.documentDataSource.setData(this.product.documents || []);
  }

  openDocumentEditorDialog(oldDocument?:any): void {

    const dialogRef = this.dialog.open(DocumentEditorComponent, {
      width: '900px',
      height: '600px',
      data: { oldDocument: oldDocument, newDocument: new Document() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.product.documents.filter(x => x !== result?.newDocument)) {
        console.log('docs', this.product.documents)
        if (result.newDocument !== undefined) {
          if (oldDocument == undefined) {
            this.product.documents.unshift(result.newDocument as Document)
            this.documentDataSource.setData(this.product.documents || []);
          }
          else {
            if (oldDocument !== result.newDocument) {
              const target = this.product.documents.find((obj) => obj === oldDocument)
              Object.assign(target, result.newDocument)
            }
          }
        }
      }
    });
  }




  submitProduct() {
    // console.log('product', JSON.stringify(this.product))
    if (!this.product.supplierId)
    {
      const supplier = this.searchSupplierCtrl.value as Supplier
      this.product.supplierId = supplier.id
      this.product.supplierName = supplier.supplierName
    }
    console.log('ss',this.product)
    const productToAdd = new ProductImageViewmodel()
    productToAdd.product = this.product
    productToAdd.files = this.imagesToUpload
    // console.log('product to add',productToAdd)

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

class DocumentDataSource extends DataSource<Document> {
  private _dataStream = new ReplaySubject<Document[]>();
  constructor(initialData: Document[]) {
    super();
    this.setData(initialData);
  }
  connect(): Observable<Document[]> {
    return this._dataStream;
  }
  disconnect() {}
  setData(data: Document[]) {
    this._dataStream.next(data);
  }
}
