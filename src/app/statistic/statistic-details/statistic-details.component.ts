import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Statistic} from "../../models/statistic.model";
import {DatePipe} from "@angular/common";

export interface StatData {
  mainStatistics: Statistic;
  statisticsSupplier: any
}

@Component({
  selector: 'app-statistic-details',
  templateUrl: './statistic-details.component.html',
  styleUrls: ['./statistic-details.component.css']
})
export class StatisticDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public statistics: any) { }
  datePipe = new DatePipe('ru-RU');
  chartList:any = []
  chartOptions:any = {
    plugins: {
      tooltip: {
        mode: 'dataset'
      },
      legend: {
        display: false,
        labels: {
          display: false
        }
      }
    }
  }

  ngOnInit(): void {
    for (let stat of this.statistics.data.statisticsSupplier) {
      this.chartList.push({
        labels: this.statistics.headers,
        datasets: [{
          data: [stat['productQty'], stat['productAddQty'], stat['productUpdateQty']],
          label: stat.supplierName,
          backgroundColor: '#1db48e',
          borderColor: '#1db48e',
        }]
      })
    }
  }

}
