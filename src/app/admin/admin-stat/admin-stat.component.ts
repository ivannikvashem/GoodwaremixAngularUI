import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {Statistic} from "../../models/statistic.model";
import {ApiClient} from "../../service/httpClient";

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
  selector: 'app-admin-stat',
  templateUrl: './admin-stat.component.html',
  styleUrls: ['./admin-stat.component.css']
})
export class AdminStatComponent implements OnInit {
  minimizedChartConfig: any['options'] = {
    elements: {
      line: {
        borderWidth: 0
      }
    },
    scales: {
      y: {
        display: false,
        grid: {color: 'transparent'},
        ticks: {display: false}
      },
      x: {
        display: false,
        grid: {color: 'transparent'},
        ticks: {display: false}
      }
    },
    pointRadius: 0
  }

  chartData:any = {
    data: {labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'], datasets: []},
    headers:[ { value:'productQty', title:'Количество атрибутов', color:'rgba(7, 143, 41, 0.3)'}, {value: 'productQtyWithCode', title: 'Фиксированные атрибуты', color: 'rgba(187, 5, 5, 0.3)'}]
  }
  statistic:Statistic = new Statistic();

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  sampleData:number[] = [1000, 9999, 30000, 100000, 200000, 18000, 150000, 100000, 7054, 54050, 59540, 32143, 89432, 453545, 999940]
  sampleData2:number[] = [150000, 100000, 1000, 200000, 18000, 7054, 9999, 30000, 100000, 432100, 600543, 222200, 53224, 54321, 70000]


  constructor(private api:ApiClient) { }
  //@ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

  ngOnInit(): void {

    this.api.getTotalStats().subscribe(x => {
      console.log(x)
      this.statistic = x.body as Statistic;
    })
    this.chartData.data.datasets.push(
      {
        data: this.sampleData,
        label: 'Добавлено',
        backgroundColor:'rgba(143,18,7,0.3)',
        borderColor: 'rgba(143,18,7,0.3)',
        fill:true,
        tension: 0.5,
        pointBackgroundColor: 'rgba(148,159,177,1)'
      } as ChartDataset);

    this.chartData.data.datasets.push(
      {
        data: this.sampleData2,
        label: 'Изменено',
        backgroundColor:'rgba(7, 143, 41, 0.3)',
        borderColor: 'rgba(7, 143, 41, 0.3)',
        fill:true,
        tension: 0.5,
        pointBackgroundColor: 'rgba(148,159,177,1)'
      } as ChartDataset);

    //this.updateCharts()
  }
  ngAfterViewInit() {
    console.log(this.chart)

    //this.chart.update()
    // this returns null
  }

/*  updateCharts() {
    this.charts.forEach((child:any) => {
      child.chart.update();
    })
  }*/

}
