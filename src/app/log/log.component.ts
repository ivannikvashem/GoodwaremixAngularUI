import {Component, OnInit} from '@angular/core';
import {DatastateService} from "../shared/datastate.service";
import {Supplier} from "../models/supplier.model";

@Component({
  selector: 'app-log-page',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  selectedSupplier: Supplier;

  constructor(private dss: DatastateService) { }

  ngOnInit(): void {
    this.dss.selectedSupplierState.subscribe(x => {
      this.selectedSupplier = x;
    });
  }
}
