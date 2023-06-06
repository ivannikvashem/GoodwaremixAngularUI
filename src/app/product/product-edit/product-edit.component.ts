import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributeProduct, AttributeProductValueLogic} from "../../models/attributeProduct.model";
import {DataSource} from "@angular/cdk/collections";
import {debounceTime, distinctUntilChanged, Observable, ReplaySubject, startWith, switchMap} from "rxjs";
import {NotificationService} from "../../service/notification-service";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ProductAttributeEditComponent} from "../product-attribute-edit/product-attribute-edit.component";
import {Package} from "../../models/package.model";
import {ProductPackageEditComponent} from "../product-package-edit/product-package-edit.component";
import {Countries} from "../../../assets/countriesList"
import {map} from "rxjs/operators";
import {MissingImageHandler} from "../MissingImageHandler";
import {ImageDialog} from "../hover-image-slider/hover-image-slider.component";
import {DataStateService} from "../../shared/data-state.service";

interface Country {
  code?:string
  name?:string
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // Supplier
  selectedSupplier: Supplier;
  isSupplierSingle:boolean = false;
  //Product
  product:Product = new Product();
  productId:string = '';
  imagesToUpload:File[] = []
  preloadImagesView:any[] =[]
  imagesView:string[] =[]
  internalCodeFetching:boolean = true
  // Attr
  dataToDisplayAttr:any = [];
  attrDataSource = new AttrDataSource(this.dataToDisplayAttr)
  attributeColumns: string[] = ['attributeKey', 'attributeValue', 'action'];
  dataSource = new MatTableDataSource<any>()
  // Package
  packageColumns: string[] = ['package', 'action'];

  countriesList:Country[] = Countries
  searchCountryCtrl = new FormControl<string | any>('')
  filteredCountries: Observable<any[]>
  brandsList:string[] = []
  searchBrandCtrl = new FormControl<string>('')
  Math = Math;
  Eps = Number.EPSILON;

  constructor(private api:ApiClient,
              private _ActivatedRoute:ActivatedRoute,
              private router: Router,
              private _notyf:NotificationService,
              public dialog: MatDialog,
              private imgHandler:MissingImageHandler,
              private dss: DataStateService
  ) {}

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    if (this.productId) {
      this.api.getProductById(this.productId).subscribe({ next: (s) => {
        this.product = s.body as Product;
        if (this.product.thumbnails.length > 0) {
          this.product.localImages.forEach((value) => {this.preloadImagesView.push({id: null, file:value})})
        } else {
          this.product.images.forEach((value) => {this.preloadImagesView.push({id:null, file:value})})
        }
        if (this.product.netto == null) {
          this.product.netto = new Package()
        }
        if (this.product.country) {
          this.searchCountryCtrl.setValue(this.countriesList.find(option => option.name.toLowerCase().includes(this.product.country.toLowerCase()) as Country))
        }
        if (this.product.vendor) {
          this.searchBrandCtrl.setValue(this.product.vendor)
        }
        this.attrDataSource.setData(this.product.attributes || []);
        }, error: () => {
          this.router.navigate(['page-not-found'])
        }})
    }
    this.filteredCountries = this.searchCountryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => ( value ? this.countryFilter(value) : this.countriesList.slice())));

    this.searchBrandCtrl.valueChanges.pipe(
      distinctUntilChanged(), debounceTime(300),
      switchMap(value => this.api.getBrands(value))
    ).subscribe((data: any) => {this.brandsList = data.body; });

    this.selectedSupplier = this.dss.selectedSupplierState.getValue();

    if (this.selectedSupplier) {
      this.handleChangeSelectedSupplier(this.selectedSupplier);
    }
  }
  private countryFilter(value: any): any[] {
    let filterValue = ''
    try { filterValue = value.name.toLowerCase() }
    catch (ex) { filterValue = value.toLowerCase() }
    return this.countriesList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier
    this.product.supplierId = supplier.id
    this.product.supplierName = supplier.supplierName
  }

  // Media
  onImageChange(event: any) {
    let files:any[] = Array.from(event.target.files);
    let errorCounter = 0;
    for (let i in files) {
      let reader = new FileReader();
      if (files[i].type.includes('image/')) {
        files[i] = new File([files[i]], this.generateUUID()+ '.' + files[i].type.split('image/')[1], {type:files[i].type});
        reader.onload = (fl:any) => {
          this.preloadImagesView.push({id: Number(i), file:fl.target.result})
          this.imagesToUpload.push(files[i])
          this.product.localImages.push(files[i].name)
          this.product.thumbnails.push(files[i].name)
        }
        reader.readAsDataURL(files[i]);
      } else { errorCounter += 1;}
    }
    if (errorCounter > 0) {
      this._notyf.onError(`Неверный формат фото (${errorCounter})`)
    }
  }

  removeImage(index:any, loadedImgIndex:any){
    this.product.localImages.splice(index,1);
    this.product.thumbnails.splice(index,1);
    this.product.images.splice(index, 1);
    this.imagesView.splice(index, 1);
    this.imagesToUpload.splice(index, 1);

    if (loadedImgIndex) {
      this.preloadImagesView = this.preloadImagesView.filter(x => x.id !== loadedImgIndex)
    } else {
      this.preloadImagesView.splice(index, 1)
    }
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
    const idx = this.product?.gtd?.indexOf(value);
    if (value && idx === -1 ) {this.product.gtd.push(value);}
    $event.chipInput!.clear()
  }

  removeGTD(gtd:string) {
    const index = this.product.gtd.indexOf(gtd)
    if (index >= 0) {
      this.product.gtd.splice(index,1)
    }
  }

  displayCountryFn(country: any): string {
    return country && country.name + ' (Код '+country.code+')';
  }

  // Attribute
  openAttributeEditorDialog(oldAttribute?:any): void {
    const dialogRef = this.dialog.open(ProductAttributeEditComponent, {
      width: '900px',
      data: { oldAttribute: oldAttribute ? oldAttribute : new AttributeProduct(), newAttribute: new AttributeProduct() },
      autoFocus:false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log(result)
        if (result.newAttribute.type == 'R') {
          if (this.product.attributes.filter(x => x.objectValue.minValue !== result.newAttribute?.objectValue.minValue && x.objectValue.maxValue !== result.newAttribute?.objectValue.maxValue)) {
            if (oldAttribute == undefined) {
              console.log('R type push')
              this.product.attributes.push(result.newAttribute as AttributeProduct)
              this.attrDataSource.setData(this.product.attributes || []);
            } else {
              console.log('R type edit')
              if (oldAttribute !== result.newAttribute) {
                const target = this.product.attributes.find((obj) => obj.objectValue.minValue === oldAttribute.objectValue.minValue && obj.objectValue.maxValue === oldAttribute.objectValue.maxValue)
                Object.assign(target, result.newAttribute)
              }
            }
          }
        } else {
          if (this.product.attributes.filter(x => x.objectValue.value !== result.newAttribute?.objectValue.value)) {
            if (oldAttribute == undefined) {
              console.log('other type push')
              this.product.attributes.push(result.newAttribute as AttributeProduct)
              this.attrDataSource.setData(this.product.attributes || []);
            } else {
              console.log('other type edit')
              if (oldAttribute !== result.newAttribute) {
                const target = this.product.attributes.find((obj) => obj.objectValue.value === oldAttribute.objectValue.value)
                Object.assign(target, result.newAttribute)
              }
            }
          }
        }

      }
    });
  }

  deleteAttrRow(attrIndex: any) {
    if (attrIndex >= 0) {
      this.product.attributes.splice(attrIndex,1)
    }
    this.attrDataSource.setData(this.product.attributes || []);
  }

  // Package
  openPackageEditorDialog(oldPackage?:any): void {
    const dialogRef = this.dialog.open(ProductPackageEditComponent, {
      data: {oldPackage: oldPackage, newPackage: new Package() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.product.packages.filter(x => x.barcode !== result.newPackage?.barcode)) {
          if (oldPackage == undefined) {
            this.product.packages.unshift(result.newPackage as Package)
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

  deletePackageRow(row:any) {
    this.product.packages = this.product.packages.filter(dc => (dc != row))
  }

  submitProduct() {
    if (!this.product.title) {
      this._notyf.onError("Не задано наименование продукта");
      return;
    }
    if (!this.product.vendorId) {
      this._notyf.onError("Не задан артикул продукта поставщика");
      return;
    }

    if (!this.product.supplierId && !this.product.supplierName) {
      this._notyf.onError("Не задан поставщик");
      return;
    }

    if (this.imagesToUpload.length > 0) {
      this.uploadPhotos(this.imagesToUpload, this.product.supplierId)
    }
    this.product.updatedAt = new Date().toISOString();
    this.product.vendor = this.searchBrandCtrl.value
    if (this.product.id != null) {
      this.updateProduct(this.product)
    }
    else if (this.product.id == null) {
      this.product.createdAt = new Date().toISOString();
      this.insertProduct(this.product)
    }
   }

   uploadPhotos(photos:File[], supplierId:string) {
    this.api.uploadPhoto(photos, supplierId).subscribe()
   }

   updateProduct(product: Product) {
    this.api.updateProduct(product).subscribe(() => {
        this._notyf.onSuccess("Товар изменен");
      },
      error => {
        this._notyf.onError("Ошибка: " + JSON.stringify(error));
      });
   }

   insertProduct(product: Product) {
     this.api.insertProduct(product).subscribe(x => {
         this._notyf.onSuccess("Товар добавлен");
         this.router.navigate([`product-edit/${x.body}`])
       },
       error => {
         this._notyf.onError("Ошибка: " + JSON.stringify(error));
       } );
   }

  onCountrySelected() {
    this.product.country = this.searchCountryCtrl.value.name
    this.product.countryCode = this.searchCountryCtrl.value.code
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }

  RequestProductInternalCode(id: string) {
    this.internalCodeFetching = false
    this.api.bindProductInternalCodeById(id).subscribe(x => {
        this._notyf.onSuccess("Артикул успешно привязан");
        this.product.internalCode = x;
        this.internalCodeFetching = true
      },
      error => {
        this._notyf.onError("Ошибка: " + JSON.stringify(error.error));
        this.internalCodeFetching = true
      });
  }

  onCountryClearSelection() {
    this.searchCountryCtrl.setValue('')
    this.onCountrySelected()
  }

  openImageDialog(image: string) {
    let dialogBoxSettings = {margin: '0 auto', hasBackdrop: true, data: { src: image.replace("", "")}};
    this.dialog.open(ImageDialog, dialogBoxSettings);
  }

  onDocumentsChanged(documents: string[]) {
    this.product.documents = documents
  }

  generateUUID(): string {
    let uuid = '', ii;
    for (ii = 0; ii < 32; ii += 1) {
      switch (ii) {
        case 8:
        case 20:
          uuid += '-';
          uuid += Math.random() * 16 | 0;
          break;
        case 12:
          uuid += '-';
          uuid += '4';
          break;
        case 16:
          uuid += '-';
          uuid += (Math.random() * 4 | 8).toString(16);
          break;
        default:
          uuid += (Math.random() * 16 | 0).toString(16);
      }
    }
    return uuid;
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
