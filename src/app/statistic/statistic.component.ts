import {Component, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ApiClient} from "../service/httpClient";
import {BaseChartDirective} from "ng2-charts";
import {Supplier} from "../models/supplier.model";
import {Statistic} from "../models/statistic.model";
import {of, tap} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  lineChartData = {
    labels: [''],
    datasets: [
      {
        data:[''],
        label: '',
        fill:true,
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        borderColor: 'black',
        tension: 0.5,
      }
    ]
  }

  fieldToShow:string = 'productQty';
  selectedSupplier:Supplier;
  lastStats:Statistic;
  isLoading:boolean;
  datePipe = new DatePipe('ru-RU');

  constructor(private api: ApiClient) { }

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit(): void {

  }

  getStats() {
    this.api.getStats(this.selectedSupplier.id, 'lastImport', 'desc').pipe(
      tap(() => {this.isLoading = true}),
      catchError(() => of([])),
      finalize(() => this.isLoading = false)
    ).subscribe(x => {
      this.lastStats = x.body.data[0];
      this.lineChartData.labels = x.body.data.map((x:any) => this.datePipe.transform(x.lastImport, 'dd-MM-yyyy')).reverse();
      this.lineChartData.datasets[0].data = x.body.data.map((x:any) => x[this.fieldToShow]).reverse();
      this.chart.update();
    })
  }

  onSupplierSelected(supplier: Supplier) {
    this.selectedSupplier = supplier;
    this.getStats();
  }

  setFieldToShow(field: string) {
    this.fieldToShow = field;
    this.getStats()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chart.update()
  }
}
