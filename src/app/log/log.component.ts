import {Component, OnInit} from '@angular/core';
import {DatastateService} from "../shared/datastate.service";

@Component({
  selector: 'app-log-page',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  selectedSupplierId: string;

  constructor(private dss: DatastateService) { }

  ngOnInit(): void {
    this.dss.selectedSupplierId.subscribe( x => {
      this.selectedSupplierId = x;
    });
  }
}
