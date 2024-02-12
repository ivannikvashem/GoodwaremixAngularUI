import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributeProduct} from "../../models/attributeProduct.model";
import {DataSource} from "@angular/cdk/collections";
import {debounceTime, distinctUntilChanged, Observable, ReplaySubject, startWith, switchMap, tap} from "rxjs";
import {NotificationService} from "../../service/notification-service";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ProductAttributeEditComponent} from "../product-attribute-edit/product-attribute-edit.component";
import {Package} from "../../models/package.model";
import {ProductPackageEditComponent} from "../product-package-edit/product-package-edit.component";
import {Countries} from "../../../assets/countriesList"
import {finalize, map} from "rxjs/operators";
import {MissingImageHandler} from "../MissingImageHandler";
import {DataStateService} from "../../shared/data-state.service";
import {ImagePreviewDialogComponent} from "../image-preview-dialog/image-preview-dialog.component";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../auth/service/auth.service";

interface Country {
  code?:string
  name?:string
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
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

  isLoading:boolean = true;
  roles:string[] = [];
  countriesList:Country[] = Countries
  searchCountryCtrl = new FormControl<string | any>('')
  filteredCountries: Observable<any[]>
  brandsList:string[] = []
  searchBrandCtrl = new FormControl<string>('')
  Math = Math;
  Eps = Number.EPSILON;
  attributeTypes:any[] = [
    {key:'R', type: 'range'},
    {key:'N', type: 'number'},
    {key:'L', type: 'boolean'},
    {key:'A', type: 'string'},
  ]

  constructor(private api:ApiClient,
              private _ActivatedRoute:ActivatedRoute,
              private router: Router,
              private _notyf:NotificationService,
              public dialog: MatDialog,
              private imgHandler:MissingImageHandler,
              private dss: DataStateService,
              private titleService:Title,
              private auth:AuthService
  ) {
    this.roles = this.auth.getRoles();
  }

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    if (this.productId) {
      this.api.getProductById(this.productId).pipe(
        tap( () => { this.isLoading = true; }), finalize( () => this.isLoading = false)
      ).subscribe({ next: (s) => {
        this.product = s.body as Product;
        if (this.product.thumbnails.length > 0) {
          this.product.images.forEach((value) => {this.preloadImagesView.push({id:null, file:value})})
        }
        if (this.product.netto == null) {
          this.product.netto = new Package()
        }
        if (this.product.country) {
          this.searchCountryCtrl.setValue(this.countriesList.find(option => option.name.toLowerCase().includes(this.product.country.toLowerCase())) as Country);
        }
        if (this.product.vendor) {
          this.searchBrandCtrl.setValue(this.product.vendor)
        }
        this.attrDataSource.setData(this.product.attributes || []);
        this.titleService.setTitle(this.product.internalCode ? 'арт. ' + this.product.internalCode + ' ' + this.product.title : this.product.title);

        }, error: () => {
          this.router.navigate(['page-not-found'])
        }})
    } else { this.isLoading = false }
    this.filteredCountries = this.searchCountryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => ( value ? this.countryFilter(value) : this.countriesList.slice())));

    this.searchBrandCtrl.valueChanges.pipe(
      distinctUntilChanged(), debounceTime(300),
      switchMap(value => this.api.getBrands(value))
    ).subscribe((data: any) => {this.brandsList = data.body; });

    this.selectedSupplier = this.dss.getSelectedSupplier().getValue();

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
        files[i] = new File([files[i]], files[i].name, {type:files[i].type});
        reader.onload = (fl:any) => {
          this.preloadImagesView.push({id: Number(i), file:fl.target.result})
          this.imagesToUpload.push(files[i])
         /* this.product.localImages.push(files[i].name)
          this.product.thumbnails.push(files[i].name)*/
        }
        reader.readAsDataURL(files[i]);
      } else { errorCounter += 1;}
    }
    if (errorCounter > 0) {
      this._notyf.onError(`Неверный формат фото (${errorCounter})`)
    }
  }

  removeImage(index:any, loadedImgIndex:any){
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
  openAttributeEditorDialog(isAttributeTypeValid:boolean, oldAttribute?:any): void {
    const dialogRef = this.dialog.open(ProductAttributeEditComponent, {
      width: '900px',
      data: { oldAttribute: oldAttribute ? oldAttribute : new AttributeProduct(), isValid: isAttributeTypeValid, newAttribute: new AttributeProduct() },
      autoFocus:false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result?.newAttribute) {
        switch (result.newAttribute.type) {
          case 'R':
            this.handleRangeAttribute(oldAttribute, result);
            break;
          case 'L':
            this.handleLogicAttribute(oldAttribute, result);
            break;
          default:
            this.handleDefaultAttribute(oldAttribute, result);
            break;
        }
      }
    });
  }


  handleRangeAttribute(oldAttribute:any, result:any) {
    if (this.product.attributes.filter(x => x.objectValue.minValue !== result.newAttribute?.objectValue.minValue && x.objectValue.maxValue !== result.newAttribute?.objectValue.maxValue)) {
      if (oldAttribute == undefined) {
        this.product.attributes.push(result.newAttribute as AttributeProduct)
        this.attrDataSource.setData(this.product.attributes || []);
      } else if (oldAttribute !== result.newAttribute)  {
        if (oldAttribute.objectValue.value) {
          const target = this.product.attributes.find((obj) => obj.objectValue.value === oldAttribute.objectValue.value)
          Object.assign(target, result.newAttribute)
        } else {
          const target = this.product.attributes.find((obj) => obj.objectValue.minValue === oldAttribute.objectValue.minValue && obj.objectValue.maxValue === oldAttribute.objectValue.maxValue)
          Object.assign(target, result.newAttribute)
        }
      }
    }
  }

  handleLogicAttribute(oldAttribute:any, result:any) {
    if (oldAttribute == undefined) {
      this.product.attributes.push(result.newAttribute as AttributeProduct)
      this.attrDataSource.setData(this.product.attributes || []);
    } else if (oldAttribute !== result.newAttribute) {
      const target = this.product.attributes.find((obj) => obj.objectValue.value === oldAttribute.objectValue.value && obj.attributeId === oldAttribute.attributeId)
      Object.assign(target, result.newAttribute)
    }
  }

  handleDefaultAttribute(oldAttribute:any, result:any) {
    if (this.product.attributes.filter(x => x.objectValue.value !== result.newAttribute?.objectValue.value)) {
      if (oldAttribute == undefined) {
        this.product.attributes.push(result.newAttribute as AttributeProduct)
        this.attrDataSource.setData(this.product.attributes || []);
      } else if (oldAttribute !== result.newAttribute) {
        const target = this.product.attributes.find((obj) => obj.objectValue.value === oldAttribute.objectValue.value)
        Object.assign(target, result.newAttribute)
      }
    }
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

   uploadPhotos(photos:File[], productId:string) {
    this.api.uploadPhoto(photos, productId).subscribe()
   }

   updateProduct(product: Product) {
    this.api.updateProduct(product).subscribe({
      next: () => {
        if (this.imagesToUpload.length > 0) {
          this.uploadPhotos(this.imagesToUpload, product.id)
        }
        this._notyf.onSuccess("Товар изменен");
      },
      error: err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      }});
   }

   insertProduct(product: Product) {
     this.api.insertProduct(product).subscribe({
       next:x => {
         if (this.imagesToUpload.length > 0) {
           this.uploadPhotos(this.imagesToUpload, x.body)
         }
         this._notyf.onSuccess("Товар добавлен");
         this.router.navigate([`product-edit/${x.body}`])

       },
       error: err => {
         this._notyf.onError("Ошибка: " + JSON.stringify(err));
       } });
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

  openImageDialog(image: string | string[]) {
    let selectedImageIndex;
    if (this.product.images?.length > 0) {
      selectedImageIndex = this.product.images.findIndex((x:any) => x === (typeof image === "object" ? image[0] : image))
    } else if (this.product.thumbnails?.length > 0) {
      selectedImageIndex = this.product.thumbnails.findIndex((x:any) => x === (typeof image === "object" ? image[0] : image))
    }
    let dialogBoxSettings = {
      margin: '0 auto',
      hasBackdrop: true,
      maxHeight: '800px',
      backdropClass: 'dialog-dark-backdrop',
      data: { selectedIndex: selectedImageIndex, imgList: this.product.images?.length > 0 ? this.product.images : this.product.thumbnails }
    };
    this.dialog.open(ImagePreviewDialogComponent, dialogBoxSettings);
  }

  onDocumentsChanged(documents: string[]) {
    this.product.documents = documents
  }

  isTypeValid(objectValue: any, type:string) {
    if (!type)
      return null;
    else {
      if (objectValue?.minValue && objectValue?.maxValue && type == 'R') {
        return true;
      } else {
        return typeof objectValue.value == this.attributeTypes.find(x => x.key === type).type;
      }
    }
  }

  typeofLogicalAttribute(objectValue:any) {
    return typeof objectValue;
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
