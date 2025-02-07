import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import {Attribute} from "../../models/attribute.model";
import {FormControl} from "@angular/forms";
import {debounceTime, switchMap} from "rxjs";
import {UnitConverter} from "../../models/unitConverter.model";
import {Category} from "../../models/category.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributesDataSource} from "../../attribute/repo/AttributesDataSource";
import {UnitConvertersDataSource} from "../../unit-converter/repo/UnitConvertersDataSource";
import {CategoryDataSource} from "../../category/repo/CategoryDataSource";
import {CategoryTreeModel} from "../../models/categoryTree.model";

@Component({
  selector: 'app-supplier-dictionary',
  templateUrl: './supplier-dictionary.component.html',
  styleUrls: ['./supplier-dictionary.component.scss']
})
export class SupplierDictionaryComponent implements OnInit {

  constructor(private attributeDS:AttributesDataSource, private unitConverterDS: UnitConvertersDataSource, private categoryDS: CategoryDataSource) { }

  @Input() configDictionary: any[]
  @Input() dictionaryType: string;
  @Output() configDictionaryOut:EventEmitter<any[]> = new EventEmitter();
  @ViewChild('scrollable') private scrollable: ElementRef;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;

  attrTableColumns: string[] = ['idx', 'keySupplier', 'attributeBDName', 'action'];
  categoryTableColumns: string[] = ['idx', 'keySupplier', 'categoryId', 'action'];
  selectedAttr: Attribute | undefined;
  selectedCategory: Category | undefined;
  attributeListCtrl = new FormControl<string | Attribute>('');
  unitConverterListCtrl = new FormControl<string | UnitConverter>('');
  categoryListCtrl = new FormControl<string | Category>('');
  selectedRow: any;
  public attributeList: Attribute[] | undefined;
  public categoryListTree: CategoryTreeModel[] | undefined;
  public unitConverterList: UnitConverter[] | undefined;

  ngOnInit(): void {
    if (this.dictionaryType == 'attribute') {
      this.attributeListCtrl.valueChanges.pipe(
        debounceTime(100),
        switchMap(value => this.attributeDS.loadAutocompleteData(value.toString(), '', 1, 500, "rating", "desc", null))
      ).subscribe((data: Attribute[]) => {
        this.attributeList = data;
      });

      this.unitConverterListCtrl.valueChanges.pipe(
        debounceTime(100),
        switchMap(value => this.unitConverterDS.loadPagedData(value.toString(), 0, 100))
      ).subscribe((data: any) => {
        this.unitConverterList = data.body.data;
      });

    } else if (this.dictionaryType == 'category') {
      this.categoryListCtrl.valueChanges.pipe(
        debounceTime(100),
        switchMap(value => this.categoryDS.loadAutocompleteData(value.toString(), 0,  50))
      ).subscribe((data: CategoryTreeModel[]) => {
        this.categoryListTree = data;
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
      keySupplier: []
/*      keySupplier: '',
      attributeBDName: '',
      attributeIdBD: '',
      attributeValid: false,
      convertId: ''*/
    };
    this.configDictionary.push(a);
    let row = this.configDictionary[this.configDictionary.length - 1];
/*
    this.attributeListCtrl.setValue(row.attributeBDName);
*/
    this.selectedRow = row;
    table.renderRows();
    this.scrollToBottom();
  }

  onSelectRow(row: any, i: any) {
    if (this.dictionaryType == 'attribute') {
      let attribute = new Attribute();
      attribute.nameAttribute = this.configDictionary[i].attributeBDName
      this.attributeListCtrl.setValue(attribute);
      this.selectedRow = row;
      this.selectedRow.id = i;
    }
    else if (this.dictionaryType == 'category') {
      this.categoryDS.getCategoryById(this.configDictionary[i].categoryId).subscribe((category:Category) => {
        this.categoryListCtrl.setValue(category)
      })

      let category = new Category();
      category.title = this.configDictionary[i].attributeBDName
      this.categoryListCtrl.setValue(category);
      this.selectedRow = row;
      this.selectedRow.id = i;
    }
  }

  deleteTableLine(index: number, table: any) {
    this.configDictionary.splice(index, 1);
    this.onDictionaryChanged()
    table.renderRows()
  }


  onSelectedRowClose(row: any, i: any, table: any) {
    if (this.dictionaryType == 'attribute') {
      if (row.keySupplier == '' && row.attributeBDName == '') {
        this.deleteTableLine(i, table)
      }
      this.clearAttrSelection();
    }
    else if (this.dictionaryType == 'category') {
      if (row.keySupplier.length <= 0 && row.categoryId == '') {
        this.deleteTableLine(i, table)
      }
      this.clearCategorySelection();
    }
    this.selectedRow = null;
  }

  displayFn(value: any): string {
    if (this.dictionaryType == 'attribute') {
      let res = value && value.nameAttribute
      if (value?.etimFeature && value?.supplierName) {
        res += " [" + value?.etimFeature + "] от " + value?.supplierName
      }
      return res
    } else if (this.dictionaryType == 'category') {
      return value && value.title;
    }
    return null;
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
    if (this.dictionaryType == 'attribute') {
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
      this.clearAttrSelection();
    }
    else if (this.dictionaryType == 'category') {
      const idx = this.configDictionary.indexOf(row.id);
      if (row.keySupplier == null && idx != i) {
        return;
      }
      this.selectedRow.title = (this.categoryListCtrl.value as Category).title;
      this.selectedRow.id = this.configDictionary.length;
      this.selectedRow.categoryId = (this.categoryListCtrl.value as Category).id.toString();
      this.clearCategorySelection();
    }

    this.configDictionary[i] = this.selectedRow;
    this.selectedAttr = null;

    //prepare for refresh
    this.onDictionaryChanged();
  }

  clearAttrSelection(): void {
    this.attributeListCtrl.setValue(null)
    this.unitConverterListCtrl.setValue('')
  }

  clearCategorySelection(): void {
    this.categoryListCtrl.setValue('' as string)
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

  addElementKeyValue($event: any, index: number) {
    const value = ($event.value || '').trim();

    if (value.includes(";")) {
      for (let v of value.split(";")) {
        if (v != '') {
          const idx = this.configDictionary[index].keySupplier?.indexOf(v);
          if (value && idx === -1) {
            this.configDictionary[index].keySupplier.push(v)
          }
        }
      }
      $event.chipInput!.clear();
      return;
    }

    const idx = this.configDictionary[index].keySupplier?.indexOf(value);
    if (value && idx === -1) {
      this.configDictionary[index].keySupplier.push($event.value)
    }
    $event.chipInput!.clear();
  }

  removeCategory(value: any, i: number) {
    const index = this.configDictionary[i].keySupplier?.indexOf(value);
    if (typeof (index) == "number" && index >= 0) {
      this.configDictionary[i].keySupplier?.splice(index, 1);
    }
  }
}

