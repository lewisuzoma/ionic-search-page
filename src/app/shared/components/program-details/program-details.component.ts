import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProgramme } from '@app-shared/core/interfaces/IPrograme';
import { GlobalService } from '@app-shared/core/services/global.service';
import { ToggleFavorite } from '@app-shared/core/states/program/program.action';
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngxs/store';
import { ReadMoreComponent } from '../read-more/read-more.component';

@Component({
  selector: 'app-program-details-component',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
  imports: [
    IonicModule,
    RouterLink
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgramDetailsComponent  implements OnInit {
@Input() data!: IProgramme

  constructor(
    private global: GlobalService,
    private store: Store
  ) { }

  ngOnInit() {}

  share() {
    console.log('here')
      this.global.shareInvite()
    }
  
    wishList(id: number) {
      this.store.dispatch(new ToggleFavorite(id)).subscribe(() => {
        this.global.toastAlert('Saved as favorite');
      })
    }

    openReadmore(title: string, data: string | string[]) {
      this.global.openModal(
        ReadMoreComponent,
        {title: title, data: data},
        100,
        false,
        'modal-right',
        'read-more',
      )
    }

}
