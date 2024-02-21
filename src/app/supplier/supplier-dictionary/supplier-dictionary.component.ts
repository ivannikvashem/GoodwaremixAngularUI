import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import {Attribute} from "../../models/attribute.model";
import {FormControl} from "@angular/forms";
import {debounceTime, switchMap} from "rxjs";
import {ApiClient} from "../../service/httpClient";
import {UnitConverter} from "../../models/unitConverter.model";
import {Category} from "../../models/category.model";

@Component({
  selector: 'app-supplier-dictionary',
  templateUrl: './supplier-dictionary.component.html',
  styleUrls: ['./supplier-dictionary.component.scss']
})
export class SupplierDictionaryComponent implements OnInit {

  constructor(private api:ApiClient) { }

  @Input() configDictionary: any[]
  @Input() dictionaryType: string;
  @Output() configDictionaryOut:EventEmitter<any[]> = new EventEmitter();
  @ViewChild('scrollable') private scrollable: ElementRef;

  attrTableColumns: string[] = ['idx', 'keySupplier', 'attributeBDName', 'action'];
  categoryTableColumns: string[] = ['idx', 'keySupplier', 'categoryId', 'action'];
  selectedAttr: Attribute | undefined;
  selectedCategory: Category | undefined;
  attributeListCtrl = new FormControl<string | Attribute>('');
  unitConverterListCtrl = new FormControl<string | UnitConverter>('');
  categoryListCtrl = new FormControl<string | Category>('');
  selectedRow: any;
  public attributeList: Attribute[] | undefined;
  public categoryList: Category[] | undefined;
  public unitConverterList: UnitConverter[] | undefined;

  ngOnInit(): void {
    console.log(this.dictionaryType)
    setTimeout(() => {
      console.log( this.dictionaryType == 'attribute' ? '123' : '_________')
    }, 1000)

    if (this.dictionaryType == 'attribute') {
      this.attributeListCtrl.valueChanges.pipe(
        debounceTime(100),
        switchMap(value => this.api.getAttributes(value, '', 0, 500, undefined, "rating", "desc"))
      ).subscribe((data: any) => {
        this.attributeList = data.body.data;
      });

      this.unitConverterListCtrl.valueChanges.pipe(
        debounceTime(100),
        switchMap(value => this.api.getConverterUnits(value.toString(), 0, 100))
      ).subscribe((data: any) => {
        this.unitConverterList = data.body.data;
      });

    } else {
      this.categoryListCtrl.valueChanges.pipe(
        debounceTime(100),
        switchMap(value => this.api.getCategories(value.toString(), 0,  500, '', undefined, "desc"))
      ).subscribe((data: any) => {
        this.categoryList = data.body.data;
      });
    }
  }

  onDictionaryChanged() {
    this.configDictionaryOut.emit(this.configDictionary)
  }

  addSuppAttr(table: any) {
    //if already added -  skip
    if (this.configDictionary.some((x: ProductAttributeKey) => x.keySupplier == '')) {
      return;
    }
    let a: any = {
      id: this.configDictionary.length,
      keySupplier: '',
      attributeBDName: '',
      attributeIdBD: '',
      attributeValid: false,
      convertId: ''
    };
    this.configDictionary.push(a);
    let row = this.configDictionary[this.configDictionary.length - 1];
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.selectedRow = row;
    table.renderRows();
    this.scrollToBottom();
  }

  onSelectRow(row: any, i: any) {
    let at = new Attribute()
    at.nameAttribute = this.configDictionary[i].attributeBDName
    this.selectedAttr = at;
    this.attributeListCtrl.setValue(this.selectedAttr);
    this.selectedRow = row;
    this.selectedRow.id = i;
  }

  deleteSuppAttr(index: number, table: any) {
    this.configDictionary.splice(index, 1);
    this.onDictionaryChanged()
    table.renderRows()
  }


  onSelectedRowClose(row: any, i: any, table: any) {
    if (row.keySupplier == '' && row.attributeBDName == '') {
      this.deleteSuppAttr(i, table)
    }
    this.clearAttrSelection();
  }

  displayFn(value: any): string {
    if (this.dictionaryType == 'attribute') {
      let res = value && value.nameAttribute
      if (value?.etimFeature && value?.supplierName) {
        res += " [" + value?.etimFeature + "] от " + value?.supplierName
      }
      return res
    } else {
      return value && value.title;
    }
  }

  displayFnUnit(unit: UnitConverter): string {
    return unit && unit.multiplier + ' ' +  unit.sourceUnit + ' --> ' + unit.targetUnit
  }

  onDBValueSelected() {
    if (this.dictionaryType == 'attribute') {
      this.selectedAttr = this.attributeListCtrl.value as Attribute;
    } else {
      this.selectedCategory = this.categoryListCtrl.value as Category;
    }
  }

  updateSelectedValue(i: number, row: any) {
    //validation
    // Add our value
    const idx = this.configDictionary.indexOf(row.attributeIdBD);
    if (row.keySupplier == null && idx != i) {
      return;
    }
    //update
    this.selectedRow.nameAttribute = (this.attributeListCtrl.value as Attribute).nameAttribute;
    this.selectedRow.id = this.configDictionary.length;
    this.selectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    this.selectedRow.attributeValid = true;
    this.selectedRow.attributeIdBD = this.selectedAttr?.id || this.selectedRow.attributeIdBD;
    this.configDictionary[i] = this.selectedRow;
    this.selectedAttr = null;
    //prepare for refresh
    this.onDictionaryChanged();
    this.clearAttrSelection();
  }

  clearAttrSelection(): void {
    this.selectedRow = null;
    this.attributeListCtrl.setValue(null)
    this.unitConverterListCtrl.setValue('')
  }

  // if add new attribute will be needed
 /* addNewAttr() {
    this.openAttributeEditorDialog()
  }

  openAttributeEditorDialog(): void {
    const dialogRef = this.dialog.open(SupplierAttributeAddComponent, {
      data: {supplierName: this.supplier.supplierName, newAttribute: new Attribute()},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.attributesToAdd.push(result.newAttribute)
        this.selectedAttr = result.newAttribute
        this.attributeListCtrl.setValue(result.newAttribute as Attribute);
      }
    });
  }*/

  scrollToBottom(): void {
    try {
      this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
    } catch (e) {
      console.error(e);
    }
  }

  onUnitConverterSelected(element:any) {
    element.convertId = (this.unitConverterListCtrl.value as UnitConverter).id;
  }
}

