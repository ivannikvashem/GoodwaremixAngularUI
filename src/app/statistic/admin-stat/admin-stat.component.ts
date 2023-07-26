import {Component, Input, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";

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
    }
    /*pointRadius: 0*/
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  }

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;
  @Input() data:any;
  @Input() lastStats:any;
  @Input() errorsList:any;
  @Input() tasks:any;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateCharts()
  }

  updateCharts() {
    this.charts?.forEach((child) => {
      child.chart.update();
    })
  }
}
