import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {SelectionModel} from "@angular/cdk/collections";
import {Product} from "../../models/product.model";
import {MatTableDataSource} from "@angular/material/table";
import {DataStateService} from "../../shared/data-state.service";

@Component({
  selector: 'app-product-export-table',
  templateUrl: './product-export-table.component.html',
  styleUrls: ['./product-export-table.component.css']
})
export class ProductExportTableComponent implements OnInit {

  displayedColumns: any[] = [
    {field:'checkbox', name:'Флажок', isActive: false},
    {field:'images', name:'Фото', isArray:true, isObjectType:false, isActive: false},
    {field:'title', name:'Наименование', isArray:false, isObjectType:false, isActive: true},
    {field:'titleLong', name:'Полное наименование', isArray:false, isObjectType:false, isActive: false},
    {field:'description', name:'Описание', isArray:false, isObjectType:false, isActive: false},
    {field:'internalCode', name:'Артикул', isArray:false, isObjectType:false, isActive: true},
    {field:'vendor', name:'Вендор', isArray:false, isObjectType:false, isActive: false},
    {field:'vendorId', name:'vendorId', isArray:false, isObjectType:false, isActive: true},
    {field:'country', name:'Страна', isArray:false, isObjectType:false, isActive: false},
    {field:'countryCode', name:'Код страны', isArray:false, isObjectType:false, isActive: false},
    {field:'documentsModel', name:'Документы', isArray:true, isObjectType:true, isActive: false},
    {field:'videos', name:'Видео', isArray:true, isObjectType:false, isActive: false},
    {field:'attributes', name:'Атрибуты', isArray:true, isObjectType:true, isActive: false},
    {field:'netto', name:'Нетто', isArray:false, isObjectType:true, isActive: false},
    {field:'packages', name:'Упаковка', isArray:true, isObjectType:true, isActive: false},
    {field:'gtd', name:'гтд', isArray:true, isObjectType:false, isActive: false},
  ];

  showNestedTablesHeaders:boolean = false;
  @Input() dataSource:Product[];
  @Output() selectedItems:EventEmitter<any> = new EventEmitter();

  productDataSource = new MatTableDataSource<Product>()
  selection = new SelectionModel<Product>(true, []);

  constructor(private dss:DataStateService) {
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.productDataSource.data = this.dataSource
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  getHeaderColumns() {
    return this.displayedColumns.filter(col => col.isActive).map(col => col.field);
  }

  getDisplayedColumns() {
    return this.displayedColumns.filter(col => col.isActive).map(col => col.field);
  }

  showColumn(vendor: string) {
    const columnToToggle = this.displayedColumns.find(column => column.field === vendor);
    if (columnToToggle) {
      columnToToggle.isActive = !columnToToggle.isActive;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.productDataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear()
      for (let product of this.productDataSource.data) {
        this.dss.removeSelectedProduct(product.id)
      }
      return
    }
    this.selection.select(...this.productDataSource.data)

    for (let product of this.productDataSource.data) {
      this.onChecked(product)
    }
  }

  onChecked(product: any) {
    if (!this.selection.isSelected(product)) {
      this.dss.removeSelectedProduct(product.id)
    } else {
      this.dss.setSelectedProduct({id:product.id,vendorId:product.vendorId, internalCode: product.internalCode})
    }
  }

  convertToDate(date:string) {
    return new Date(date)
  }
}
