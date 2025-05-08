import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProgramme } from '@app-shared/core/interfaces/IPrograme';
import { GlobalService } from '@app-shared/core/services/global.service';
import { ToggleFavorite } from '@app-shared/core/states/program/program.action';
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss'],
  imports: [
    IonicModule,
    RouterLink
  ]
})
export class ProgramListComponent  implements OnInit {
  @Input() item!: IProgramme
  @Input() index!: number

  constructor(
    private global: GlobalService,
    private store: Store
  ) { }

  ngOnInit() {}

  share() {
    this.global.shareInvite()
  }

  wishList(id: number) {
    this.store.dispatch(new ToggleFavorite(id)).subscribe(() => {
      this.global.toastAlert('Saved as favorite');
    })
  }

}
