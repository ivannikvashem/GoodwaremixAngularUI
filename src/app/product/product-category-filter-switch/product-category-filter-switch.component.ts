import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-product-category-filter-switch',
  templateUrl: './product-category-filter-switch.component.html',
  styleUrls: ['./product-category-filter-switch.component.css']
})
export class ProductCategoryFilterSwitchComponent {

  @Input() state: boolean | null = null;
  @Output() categoryFilterEmitter = new EventEmitter<boolean | null>();

  switchCategoryStateFilter() {
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
    this.categoryFilterEmitter.next(this.state);
  }
}
