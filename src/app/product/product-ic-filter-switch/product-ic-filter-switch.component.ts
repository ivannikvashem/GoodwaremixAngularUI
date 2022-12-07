import {Component, Input, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-product-ic-filter-switch',
  templateUrl: './product-ic-filter-switch.component.html',
  styleUrls: ['./product-ic-filter-switch.component.css']
})
export class ProductIcFilterSwitchComponent{

  @Input() withICFilter: boolean = false;
  withICFilterTitle: string = "Все товары";

  @Output() withICFilterEmitter = new Subject<boolean>();

  switchAttrStateFilter() {
    switch (this.withICFilter) {
      case true: {
        this.withICFilter = false;
        this.withICFilterTitle = "Все товары";
        break;
      }
      case false: {
        this.withICFilter = true;
        this.withICFilterTitle = "C артикулом";
        break;
      }
    }
    this.withICFilterEmitter.next(this.withICFilter);
  }
}
