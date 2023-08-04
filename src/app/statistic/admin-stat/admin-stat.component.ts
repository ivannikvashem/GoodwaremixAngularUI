import {Component, Input, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {MatDialog} from "@angular/material/dialog";
import {StatisticDetailsComponent} from "../statistic-details/statistic-details.component";

@Component({
  selector: 'app-admin-stat',
  templateUrl: './admin-stat.component.html',
  styleUrls: ['./admin-stat.component.css']
})
export class AdminStatComponent implements OnInit {

  lineChartOptions: any = {
    /*plugins: {
      tooltip: {
        backgroundColor: 'rgba(255,255,0,0.5)',
        bodyFontColor: 'blue',
        borderColor: '#0ff',
        borderWidth: 5,
        caretPadding: 10,
        displayColors: false,
        enabled: true,
        intersect: true,
        mode: 'x',
        titleFontColor: '#333',
        titleMarginBottom: 10,
        xPadding: 20,
        yPadding: 15,
        // If you want to custom the value
        callbacks: {
          label: function (tooltipItem:any, data:any) {
            console.log(tooltipItem, data)
            const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
            return  datasetLabel + ': $' + tooltipItem.yLabel;
            //return 'a'
          }
        }
      }
    },*/
    elements: {
      line: {
        borderWidth: 4
      }
    },
    scales: {
      y: {
        display: true,
        grid: {color: 'lightgray'},
        ticks: {display: true}
      },
      x: {
        display: false,
        grid: {color: 'transparent'},
        ticks: {display: true}
      }
    },
    pointRadius: 5
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 4
      }
    },
    pointRadius: 8
  }

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;
  @Input() chartsData: any;
  @Input() data: any;
  @Input() lastStats: any;
  @Input() errorsList: any;
  @Input() tasks: SchedulerTask[] = [];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateCharts();
  }

  updateCharts() {
    this.charts?.forEach((child) => {
      child.chart.update();
    })
  }


  onChartClick(chartDot: any, chartType:string) {
    let headers = chartDot.event.chart.legend.legendItems.map((x:any) => x['text']);
    let index = chartDot.active[0]?.index;
    if (index >= 0) {
      this.dialog.open(StatisticDetailsComponent, {
        data: {data: this.data[index], headers: headers, chartType:chartType}
      })
    }
  }

  onChartHover(chart: any) {
    chart.event.native.target.style.cursor = chart.active.length > 0 ? 'pointer' : 'default';
  }

  enabledTasks() {
    return this.tasks.filter(x => x.isEnable == true).length;
  }

}
