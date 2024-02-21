import {Component, Input, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-attrtibute-state-switch',
  templateUrl: './attrtibute-state-switch.component.html',
  styleUrls: ['attribute-state-switch.components.scss']
})
export class AttrtibuteStateSwitchComponent {

  @Input() state: boolean | null = null;
  @Output() stateEmitter = new Subject<boolean | null>();

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
    this.stateEmitter.next(this.state);
  }
}
