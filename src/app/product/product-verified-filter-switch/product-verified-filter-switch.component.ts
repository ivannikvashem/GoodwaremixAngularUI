import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-product-verified-filter-switch',
  templateUrl: './product-verified-filter-switch.component.html',
  styleUrls: ['./product-verified-filter-switch.component.css']
})
export class ProductVerifiedFilterSwitchComponent {

  @Input() state: boolean | null = null;
  @Output() verifiedFilterEmitter = new EventEmitter<boolean | null>();

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
    this.verifiedFilterEmitter.next(this.state);
  }
}
