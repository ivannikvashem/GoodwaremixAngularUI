import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Document} from "../../models/document.model";
import {ProductDocumentEditComponent} from "../../product/product-document-edit/product-document-edit.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss']
})
export class DocumentCardComponent implements OnInit {

  constructor(private dialog:MatDialog) { }
  @Input() document:Document
  @Input() isChangeable:boolean
  @Input() isSelectable:boolean
  @Output() selectedDocument = new EventEmitter<{toDelete:boolean, document:Document}>();

  ngOnInit(): void {}

  openDocumentEditorDialog(oldDocument?:any): void {
      const dialogRef = this.dialog.open(ProductDocumentEditComponent, {
        width: '1050px',
        autoFocus: false,
        data: {documentIds:null, supplierId:this.document.supplierId, oldDocument: oldDocument, newDocument: new Document() },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != '') {
          this.document = result.newDocument
        }
      });
  }

  onAttach(toDelete:boolean, document: Document) {
    this.selectedDocument.emit({toDelete:toDelete, document:document})
  }

  isDateValid(endDate:any) {
    return endDate > new Date().toISOString()
  }
}
