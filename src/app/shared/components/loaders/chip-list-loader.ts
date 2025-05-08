import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { IonicModule } from "@ionic/angular"

@Component({
    selector: 'app-chip-list-loader',
    template: `
    <ion-list>
        <ion-item>
        <ion-label>
            <h3>
            <ion-skeleton-text [animated]="true" style="width: 100%; height: 20px;"></ion-skeleton-text>
            </h3>
        </ion-label>
        </ion-item>
    </ion-list>`,
    imports: [
        CommonModule, 
        IonicModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ChipListLoader {}