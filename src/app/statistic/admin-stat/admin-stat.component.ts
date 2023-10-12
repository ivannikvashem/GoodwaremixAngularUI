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
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          borderRadius: 5,
          useBorderRadius: true,
          boxWidth: 10,
          boxHeight: 10,
        }
      }
    },
    elements: {
      line: {
        borderWidth: 4
      }
    },
    scales: {
      y: {
        display: false,
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

  doughnutChartOptions: any = {
    plugins: {
      legend: {
        display: false,
      }
    },
  }

  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          borderRadius: 5,
          useBorderRadius: true,
          boxWidth: 10,
          boxHeight: 10,
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 4
      }
    },
    pointRadius: 5
  }

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;
  @Input() chartsData: any;
  @Input() data: any;
  @Input() lastStats: any;
  @Input() errorsList: any;
  @Input() tasks: SchedulerTask[] = [];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.formatDataForDoughnutChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateCharts();
  }

  updateCharts() {
    this.charts?.forEach((child) => {
      child.chart.update();
    })
  }


  onChartClick(chartDot: any, chartType: string) {
    let headers = chartDot.event.chart.legend.legendItems.map((x: any) => x['text']);
    let index = chartDot.active[0]?.index;
    if (index >= 0) {
      this.dialog.open(StatisticDetailsComponent, {
        minWidth: '500px',
        data: {data: this.data[index], headers: headers, chartType: chartType}
      })
    }
  }

  onChartHover(chart: any) {
    chart.event.native.target.style.cursor = chart.active.length > 0 ? 'pointer' : 'default';
  }

  formatDataForDoughnutChart() {
    this.chartsData.forEach((chartData: any) => {
      const doughnutChartData: any = {
        labels: [],
        datasets: [{
          backgroundColor: [],
          cutout: '70%',
          data: []
        }]
      };
      console.log(chartData)
      if (chartData.data.datasets[0]?.data && chartData.data.datasets[1]?.data) {
        doughnutChartData.labels = [
          chartData.oppositeValue,
          chartData.data.datasets[1].label
        ];

        doughnutChartData.datasets[0].backgroundColor = [
          chartData.data.datasets[0]?.backgroundColor,
          chartData.data.datasets[1]?.backgroundColor
        ];

        doughnutChartData.datasets[0].data = [
          chartData.data.datasets[0].data[chartData.data.datasets[0].data.length - 1] - chartData.data.datasets[1].data[chartData.data.datasets[1].data.length - 1],
          chartData.data.datasets[1].data[chartData.data.datasets[1].data.length - 1]
        ];
      }

      chartData.doughnutChartData = doughnutChartData;
      chartData.doughnutChartData.plugins = [{
        legend: {
          position: 'bottom',
          labels: {
            borderRadius: 5,
            useBorderRadius: true,
            boxWidth: 10,
            boxHeight: 10,
          }
        },
        beforeDraw(chart: any) {
          const ctx = chart.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = 24 + 'px \'Open Sans\', sans-serif';
          ctx.fillText(chartData.data.datasets[0].label + ' ' + chartData.data.datasets[0].data[chartData.data.datasets[0].data.length - 1], centerX, centerY);
        }
      }]
    });
  }
}
