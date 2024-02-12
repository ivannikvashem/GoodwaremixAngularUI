import {Component, OnInit} from '@angular/core';
import {DataStateService} from "../shared/data-state.service";
import {Supplier} from "../models/supplier.model";

@Component({
  selector: 'app-log-page',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  selectedSupplier: Supplier;

  constructor(private dss: DataStateService) { }

  ngOnInit(): void {
    this.dss.getSelectedSupplier().subscribe((supplier:Supplier) => {
      this.selectedSupplier = supplier;
    });
  }
}
