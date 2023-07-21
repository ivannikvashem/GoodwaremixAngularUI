import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ApiClient} from "../service/httpClient";
import {BaseChartDirective} from "ng2-charts";
import {Supplier} from "../models/supplier.model";
import {Statistic} from "../models/statistic.model";
import {of, tap} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {DataStateService} from "../shared/data-state.service";

export interface ChartDataset {
  data:[],
  label:string,
  fill:boolean,
  backgroundColor:string,
  borderColor: string,
  tension:number,
  pointBackgroundColor: 'rgba(148,159,177,1)',
  pointBorderColor: '#fff',
  pointHoverBackgroundColor: '#fff',
  pointHoverBorderColor: 'rgba(148,159,177,0.8)',
}

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})

export class StatisticComponent implements OnInit {

  chartList:any = [
    {
      data: {labels: [''], datasets: []},
      headers:[ { value:'productAddQty', title:'Добавлено', color:'rgba(7, 143, 41, 0.3)'}, {value: 'productUpdateQty', title: 'Обновлено', color: 'rgba(187, 5, 5, 0.3)'}]
    },
/*    {
      data: {labels: [''], datasets: []},
      headers:[ { value:'productQty', title:'Количество атрибутов', color:'rgba(7, 143, 41, 0.3)'}, {value: 'productQtyWithCode', title: 'Фиксированные атрибуты', color: 'rgba(187, 5, 5, 0.3)'}]
    }*/
  ]

  selectedSupplier:Supplier;
  supplierConfigs:any[] = [];
  errorsConfig:string[] = []
  lastStats:Statistic;
  defaultStat:Statistic;
  isLoading:boolean;
  datePipe = new DatePipe('ru-RU');
  supplierStatsList:Statistic[] = []

  constructor(private api: ApiClient, private dss:DataStateService) { }

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

  ngOnInit(): void {
    this.dss.getSelectedSupplier().subscribe(supplier => {
      this.onSupplierSelected(supplier)
    })

    this.api.getTotalStats().subscribe(x => {
      console.log(x)
      this.defaultStat = x.body as Statistic;
      if (!this.selectedSupplier) {
        this.lastStats = this.defaultStat;
      }
    })

    if (this.selectedSupplier?.id) {
      this.getStats();
    }
  }

  getStats() {
    this.api.getSupplierStats(this.selectedSupplier.id, 'lastImport', 'desc').pipe(
      tap(() => {this.isLoading = true}),
      catchError(() => of([])),
      finalize(() => this.isLoading = false)
    ).subscribe(x => {
      console.log(x)
      this.supplierStatsList = x.body.data;
      this.supplierConfigs = x.body.configs;

      this.getConfigErrors(x.body.configs)

      if (this.lastStats) {
        this.lastStats = this.supplierStatsList[0];
      }
      for (let chart of this.chartList) {
        this.setDataToChart(chart.data, chart.headers);
      }
    })
  }

  onSupplierSelected(supplier: Supplier) {
    this.errorsConfig = []
    if (supplier?.id) {
      this.selectedSupplier = supplier;
      this.getStats();
    } else {
      //this.clearStats();
    }
    this.updateCharts();
  }

  setDataToChart(collectionChartData:any, headers:any[]) {
    for (let header of headers) {
      if (collectionChartData.datasets.find((x:any) => x.label === header.title)) {
        return;
      }
      collectionChartData.datasets.push(
        {
          data: this.supplierStatsList.map((x:any) => x[header.value]).reverse(),
          label: header.title,
          backgroundColor:header.color,
          borderColor: header.color,
          fill:true,
          tension: 0.5,
          pointBackgroundColor: 'rgba(148,159,177,1)'
        } as ChartDataset);
    }
    collectionChartData.labels = this.supplierStatsList.map((x:any) => this.datePipe.transform(x.lastImport, 'dd-MM-yyyy')).reverse();
    this.updateCharts();
  }

  clearStats() {
    this.lastStats = this.defaultStat;
    for (let chart of this.chartList) {
      chart.data.datasets = [];
    }
    this.updateCharts();
  }

  updateCharts() {
    this.charts?.forEach((child) => {
      child.chart.update();
    })
  }

  generateColumns() {
    let columns = '';
    for (let i = 0; i < this.chartList.length; i++) {
      if (i === 4) {
        return columns;
      }
      columns = columns + '1fr ';
    }
    return columns;
  }
  getConfigErrors(config:any) {
    for (let key in config[0]) {
      if (config[0][key].length > 0) {
        this.errorsConfig.push(config[0][key])
      }
    }
  }
}
