import {Component, Input, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-product-ic-filter-switch',
  templateUrl: './product-ic-filter-switch.component.html',
  styleUrls: ['./product-ic-filter-switch.component.css']
})
export class ProductIcFilterSwitchComponent{

  @Input() withICFilter: boolean = null;
  @Output() withICFilterEmitter = new Subject<boolean>();

  switchAttrStateFilter() {
    switch (this.withICFilter) {
      case true: {
        this.withICFilter = false;
        break;
      }
      case false: {
        this.withICFilter = true;
        break;
      }
    }
    this.withICFilterEmitter.next(this.withICFilter);
  }
}
