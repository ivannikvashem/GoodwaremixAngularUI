import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {UnitConvertersDataSource} from "../repo/UnitConvertersDataSource";
import {ApiClient} from "../../service/httpClient";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {UnitConverterEditComponent} from "../unit-converter-edit/unit-converter-edit.component";
import {UnitConverter} from "../../models/unitConverter.model";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-unit-converter-index',
  templateUrl: './unit-converter-index.component.html',
  styleUrls: ['./unit-converter-index.component.css']
})
export class UnitConverterIndexComponent implements OnInit {

  displayedColumns: string[] = ['sourceUnit', 'targetUnit', 'multiplier', 'actions'];
  dataSource: UnitConvertersDataSource;
  @Input() searchQuery:string;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Output() pageParams:EventEmitter<any> = new EventEmitter();
  constructor(private api:ApiClient, public dialog: MatDialog) {
    this.dataSource = new UnitConvertersDataSource(this.api);
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadUnitConvertersPagedData()
  }

  loadUnitConvertersPagedData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.pageIndex, this.pageSize);
  }

  editUnit(unit?:any) {
    const dialogRef = this.dialog.open(UnitConverterEditComponent, {
      width: '900px',
      data: { oldUnit: unit, newUnit: new UnitConverter() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.oldUnit == undefined && result.newUnit) {
          this.dataSource.addUnitConverter(result.newUnit)
        } else if (result.oldUnit && result.newUnit) {
          this.dataSource.updateUnitConverter(Object.assign(result.oldUnit, result.newUnit))
        }
      }
    });
  }

  deleteUnit(unit:any) {
    const message = `Удалить конвертированную единицу измерения ` + unit.sourceUnit + ' --> ' + unit.targetUnit + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "550px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.dataSource.deleteUnitConverter(unit.id);
      }
    });
  }
}
