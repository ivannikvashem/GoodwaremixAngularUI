import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-product-ic-filter-switch',
  templateUrl: './product-ic-filter-switch.component.html',
  styleUrls: ['./product-ic-filter-switch.component.css']
})
export class ProductIcFilterSwitchComponent{

  @Input() state: boolean | null = null;
  @Output() withICFilterEmitter = new EventEmitter<boolean | null>();

  switchAttrStateFilter() {
    switch (this.state) {
      case null: {
        this.state = false;
        break;
      }
      case false: {
        this.state = true;
        break;
      }
      case true: {
        this.state = null;
        break;
      }
    }
    this.withICFilterEmitter.next(this.state);
  }
}
