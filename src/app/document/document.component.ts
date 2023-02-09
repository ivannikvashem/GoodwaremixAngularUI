import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../service/notification-service";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  constructor(public dialog: MatDialog, private _notyf: NotificationService) { }

  ngOnInit(): void {

  }
}

