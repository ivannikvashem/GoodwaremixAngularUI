import {Component, Input, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-attrtibute-state-switch',
  templateUrl: './attrtibute-state-switch.component.html',
  styleUrls: ['./attrtibute-state-switch.component.css']
})
export class AttrtibuteStateSwitchComponent {

  @Input() state: boolean | null = null;
  stateTitle: string = "Все";

  @Output() stateEmitter = new Subject<boolean | null>();

  switchAttrStateFilter() {
    switch (this.state) {
      case null: {
        this.state = false;
        this.stateTitle = "Открытые";
        break;
      }
      case false: {
        this.state = true;
        this.stateTitle = "Фиксированные";
        break;
      }
      case true: {
        this.state = null;
        this.stateTitle = "Все";
        break;
      }
    }
    this.stateEmitter.next(this.state);
  }
}
