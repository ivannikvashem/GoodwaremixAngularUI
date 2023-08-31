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
        position: 'nearest'
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
    if (this.statistics.data.statisticsSupplier) {
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
    } else {
      this.chartList.push({
        labels: this.statistics.headers,
        datasets: [{
          data: [this.statistics.data['productQty'], this.statistics.data['productAddQty'], this.statistics.data['productUpdateQty']],
          label: this.statistics.data.supplierName,
          backgroundColor: '#1db48e',
          borderColor: '#1db48e',
        }]
      })
    }
  }
}
