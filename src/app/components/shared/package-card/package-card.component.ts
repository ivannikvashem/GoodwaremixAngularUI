import {Component, Input, OnInit} from '@angular/core';
import {Package} from "../../../models/package.model";

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.css']
})
export class PackageCardComponent implements OnInit {

  Math = Math;
  Eps = Number.EPSILON;
  isCalculatedVolume = false;

  constructor() {
  }

  @Input() pack: Package = new Package();

  ngOnInit(): void {
    if (!this.pack.volume && this.pack.height && this.pack.width && this.pack.depth) {
      this.pack.volume = this.pack.height * this.pack.width * this.pack.depth;
      this.isCalculatedVolume = true;
    }
  }

}
