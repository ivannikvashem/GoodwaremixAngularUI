import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ApiClient} from "../service/httpClient";
import {BaseChartDirective} from "ng2-charts";
import {Supplier} from "../models/supplier.model";
import {Statistic} from "../models/statistic.model";
import {of, tap} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {DataStateService} from "../shared/data-state.service";
import {AuthService} from "../auth/service/auth.service";
import {SchedulerTask} from "../models/schedulerTask.model";

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
  roles: string[] = [];

  colorPalette:string[] = ['#3f51b5', '#f44336', '#ff4081']

  chartList:any = [
    {
      data: {labels: [''], datasets: []},
      headers:[ { value:'productQty', title:'Всего', color: this.colorPalette[0]}, {value: 'productQtyWithCode', title: 'С артикулом', color: this.colorPalette[1]}]
    },
    {
      data: {labels: [''], datasets: []},
      headers:[ { value:'documentQty', title:'Всего', color: this.colorPalette[0]}, {value: 'certNumberQty', title: 'Сертификатов', color: this.colorPalette[1]}]
    },
    {
      data: {labels: [''], datasets: []},
      headers:[ { value:'attributeQty', title:'Всего', color: this.colorPalette[0]}, {value: 'attributeIsFixedQty', title: 'Фиксированных', color: this.colorPalette[1]}]
    },
    {
      data: {labels: [''], datasets: []},
      headers:[ { value:'productQty', title:'Всего', color: this.colorPalette[0]}, {value: 'productAddQty', title: 'Добавлено', color: this.colorPalette[1]}, {value: 'productUpdateQty', title: 'Обновлено', color: this.colorPalette[2]}]
    }
  ]

  selectedSupplier:Supplier;
  supplierConfigs:any[] = [];
  errorsConfig:any[] = []
  lastStats:Statistic;
  tasks:any;
  isLoading:boolean;
  datePipe = new DatePipe('ru-RU');
  supplierStatsList:any[] = []

  defaultStat:Statistic;
  defaultData:any;
  defaultConfig:any;
  defaultTasks:SchedulerTask[]

  constructor(private api: ApiClient, private dss:DataStateService, private auth: AuthService) {
    this.roles = this.auth.getRoles();
  }

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

  ngOnInit(): void {
    this.getTotalStats();

    this.dss.getSelectedSupplier().subscribe(supplier => {
      this.onSupplierSelected(supplier)
    });
    if (this.selectedSupplier?.id) {
      this.getStats(this.selectedSupplier.id);
    }
  }

  getTotalStats() {
    this.api.getTotalStats().subscribe(x => {
      this.tasks = x.body.tasks;
      this.supplierStatsList = x.body.data;

      this.supplierConfigs = x.body.configs;
      this.getConfigErrors(this.supplierConfigs)

      this.setBodyData(this.supplierStatsList, true);
      this.setDefaultStats();


      for (let chart of this.chartList) {
        this.setDataToChart(chart.data, chart.headers, true);
      }
    })
  }

  getStats(supplierId:string) {
    this.api.getSupplierStats(supplierId, 'lastImport', 'asc').pipe(
      tap(() => {this.isLoading = true}),
      catchError(() => of([])),
      finalize(() => this.isLoading = false)
    ).subscribe(x => {
      this.supplierStatsList = x.body.data;
      this.supplierConfigs = x.body.configs;
      this.getConfigErrors(x.body.configs)
      this.setBodyData(this.supplierStatsList, false)

      for (let chart of this.chartList) {
        this.setDataToChart(chart.data, chart.headers, false);
      }
    })
  }

  setBodyData(data:any, isAdmin:boolean) {
    this.lastStats = isAdmin ? data[data.length - 1].mainStatistics as Statistic : data[data.length - 1];
  }

  onSupplierSelected(supplier: Supplier) {
    this.clearStats();
    this.errorsConfig = []
    if (supplier?.id) {
      this.selectedSupplier = supplier;
      this.getStats(this.selectedSupplier.id);
    } else {
      if (this.defaultData) {
        this.getDefaultStats();
      }
    }
  }

  setDataToChart(collectionChartData:any, headers:any[], isAdminData:boolean) {
    for (let header of headers) {
      if (collectionChartData.datasets.find((x:any) => x.label === header.title)) {
        return;
      }
      collectionChartData.datasets.push(
        {
          data: isAdminData == true ? this.supplierStatsList.map((x:any) => x['mainStatistics']).map((x:any) => x[header.value]) : this.supplierStatsList.map((x:any) => x[header.value]),
          label: header.title,
          backgroundColor:header.color,
          borderColor: header.color,
          fill:false,
          tension: 0.5,
          pointBackgroundColor: 'rgba(148,159,177,1)'
        } as ChartDataset);
    }
    collectionChartData.labels = isAdminData == true ? this.supplierStatsList.map((x:any) => x['mainStatistics']).map((x:any) => this.datePipe.transform(x.lastImport, 'dd-MM-yyyy')) : this.supplierStatsList.map((x:any) => this.datePipe.transform(x.lastImport, 'dd-MM-yyyy'));
  }

  getDefaultStats() {
    this.lastStats = this.defaultStat;
    this.supplierStatsList = this.defaultData;
    this.supplierConfigs = this.defaultConfig;
    this.tasks = this.defaultTasks;

    for (let chart of this.chartList) {
      this.setDataToChart(chart.data, chart.headers, true);
    }
  }

  setDefaultStats() {
    this.defaultStat = this.lastStats;
    this.defaultData = this.supplierStatsList;
    this.defaultConfig = this.supplierConfigs;
    this.defaultTasks = this.tasks;
  }

  clearStats() {
    this.lastStats = new Statistic();
    this.tasks = []
    for (let chart of this.chartList) {
      chart.data.datasets = [];
    }
  }

  getConfigErrors(config:any) {
    if (config) {
      for (let key in config[0]) {
        if (config[0][key].length > 0) {
          this.errorsConfig.push({name:key, value:config[0][key]})
        }
      }
    }
  }
}
