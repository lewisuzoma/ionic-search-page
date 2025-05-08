import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { GlobalService } from '@app-shared/core/services/global.service';
import { IonicModule, NavParams } from '@ionic/angular'

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss'],
  imports: [
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReadMoreComponent  implements OnInit {
  title: any = this.params.get("title") || '';
  data: any = this.params.get("data") || '';

  constructor(
    private params: NavParams,
    private global: GlobalService
  ) { }

  ngOnInit() {}

  closeModal() {
    this.global.closeModal({id: 'read-more'})
  }


}
