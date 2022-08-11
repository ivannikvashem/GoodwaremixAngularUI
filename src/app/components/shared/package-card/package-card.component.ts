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

  constructor() {
  }

  @Input() pack: Package = new Package();

  ngOnInit(): void {
  }

}
