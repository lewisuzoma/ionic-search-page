import { CommonModule, NgFor } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { IonicModule } from "@ionic/angular"

@Component({
    selector: 'app-program-list-loader',
    template: `
    <ion-list-header>
      <ion-skeleton-text [animated]="true" style="width: 80px"></ion-skeleton-text>
    </ion-list-header>
    <ion-list *ngFor="let item of [0,1,2]">
    <ion-skeleton-text [animated]="true" style="width: 100%; height: 180px;"></ion-skeleton-text>
    <ion-item>
      <ion-label>
        <h3>
          <ion-skeleton-text [animated]="true" style="width: 80%;"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text [animated]="true" style="width: 60%;"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text [animated]="true" style="width: 30%;"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>`,
    imports: [
        CommonModule, 
        IonicModule,
        NgFor
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ProgramListLoader {}