import {Component, Input, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {SchedulerTask} from "../../models/schedulerTask.model";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {StatisticDetailsComponent} from "../statistic-details/statistic-details.component";

@Component({
  selector: 'app-admin-stat',
  templateUrl: './admin-stat.component.html',
  styleUrls: ['./admin-stat.component.scss']
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
        grid: {color: 'lightgray'},
        ticks: {display: true}
      },
      x: {
        grid: {color: 'transparent'},
        ticks: {display: false}
      }
    },
    pointRadius: 5
  }

  doughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
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
    this.trackWindowSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateCharts();
  }

  updateCharts() {
    //this.formatDataForDoughnutChart()
    this.charts?.forEach((child) => {
      child.chart?.update();
    })
  }


  onChartClick(chartDot: any, chartType: string) {
    let headers = chartDot.event.chart.legend.legendItems.map((x: any) => x['text']);
    let index = chartDot.active[0]?.index;
    if (index >= 0) {
      this.dialog.open(StatisticDetailsComponent, {
        panelClass: 'full-width',
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
          const chartDetailed = chart.getContext('2d');
          const ctx = chart.ctx;
          const txt = chartData.data?.datasets[0]?.label + ' ' + chartData.data?.datasets[0]?.data[chartData.data?.datasets[0].data?.length - 1];
          const fontSize = chartDetailed.chart.width / 10;
          ctx.font = fontSize + 'px \'Open Sans\', sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = chartDetailed.chart.width / 2;
          const centerY = chartDetailed.chart.height / 2;
          if (txt.includes('undefined')) {
            ctx.fillText('Всего 0', centerX, centerY);
          } else {
            ctx.fillText(txt, centerX, centerY);
          }
        }
      }]
    });
  }

  trackWindowSize() {
    window.addEventListener('resize', () => {
      this.updateCharts();
    });
  }
}
