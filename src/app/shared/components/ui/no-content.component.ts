import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { receiptOutline } from 'ionicons/icons';

@Component({
  selector: 'app-no-content',
  template: `<ion-item lines="none" detail="false" *ngIf="showSelect">
              <ion-select 
                slot="end" 
                aria-label="Packages" 
                interface="action-sheet" 
                placeholder="Select"
                [compareWith]="compareWith"
                (ionChange)="handleChange($event)"
                mode="md"
                class="ion-no-margin">
                <ion-select-option *ngFor="let item of selectList" [value]="item">{{item?.title}}</ion-select-option>
              </ion-select>
            </ion-item>
            <div padding align="center" id="center">
              <ion-icon *ngIf="useIcon && !useImage" name="receipt-outline" class="text-xl"></ion-icon>
              <!-- <img style="width: 300px;" class="animated fadeIn hidden-xs" src="assets/icon/nocontent.png"> -->
              <img *ngIf="useImage && !useIcon" loading="lazy" style="width: 200px;" class="hidden-md" [src]="'assets/images/no-content.svg'">
              <ion-row>
                <ion-col size="10" offset="1" size-sm="12" offset-sm="0">
                  <p>
                    <ng-content class="nocontent-text"></ng-content>
                  </p>
                </ion-col>
              </ion-row>
            </div>`,
  styles: `#center
        {
            margin: 3vh auto !important;
            img {
                height: 100px !important;
                width: 80px !important;
                filter: grayscale(100%) !important;
                opacity: 50% !important;
            }
            p {
                // width: 400px !important;
                margin-top: 0px !important; 
                z-index: 9999 !important;
            }
        }
      `,
  imports: [
    CommonModule, 
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NoContentComponent implements OnInit {
@Input() showSelect: boolean = false;
@Input() useImage: boolean = false;
@Input() useIcon: boolean = false;
@Input() selectList?: any[] = [];

@Output() public onSelectEvent = new EventEmitter<any>();

  constructor() {
    addIcons({
      receiptOutline
    })
   }

  ngOnInit() {}

  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  handleChange(ev: any) {
    this.onSelectEvent.emit(ev);
  }

}


