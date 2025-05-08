import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '@app-shared/core/services/global.service';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';
import { InstituteListComponent } from '../institute-list/institute-list.component';
import { ProgramState } from '@app-shared/core/states/program/program.state';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { IProgramme } from '@app-shared/core/interfaces/IPrograme';
import { AsyncPipe } from '@angular/common';
import { ClearAllFilterObjects, TuitionFeeFilter } from '@app-shared/core/states/program/program.action';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    AsyncPipe
  ]
})
export class FilterComponent  implements OnInit, OnDestroy {
  filterObjects$: Observable<string[] | null> = this.store.select<string[] | null>(ProgramState.getfilterObjects);
  program$: Observable<IProgramme[] | null> = this.store.select<IProgramme[] | null>(ProgramState.getfilteredPrograms);
  selectedFilterInstitute$: Observable<string | null> = this.store.select<string | null>(ProgramState.getselectedFilterInstitute);
  tuitionFeeRange$: Observable<{min: string | number, max: string | number} | null> = this.store.select<{min: string | number, max: string | number} | null>(ProgramState.getTuitionFeeRange);

  min!: number | string | null
  max!: number | string | null
  minRange!: number | string | null
  maxRange!: number | string | null

  filterObjectsSub!: Subscription

  constructor(
    private global: GlobalService,
    private store: Store
  ) {
    addIcons({
      arrowForwardOutline
    })
   }

  ngOnInit() {
    this.tuitionFeeRange$.subscribe((res) => {
      this.min = res?.min ?? ''
      this.max = res?.max ?? ''
      this.minRange = typeof res?.min === 'string' ? res.min.replace(/[,$]/g, "") : res?.min ?? ''
      this.maxRange = typeof res?.max === 'string' ? res.max.replace(/[,$]/g, "") : res?.max ?? ''
    })
  }

  priceRange(event: Event | any) {
    this.store.dispatch(new TuitionFeeFilter({min: event.detail.value.lower, max: event.detail.value.upper}))
  }

  

  counterFormatterFn(value: number) {
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k';
    }
    return value.toString();
  }

  openInstitute() {
    this.global.openModal(
      InstituteListComponent,
      {},
      100,
      false,
      'modal-right',
      'institute',
    )
  }

  closeFilter(){
    this.global.closeModal({id: 'filter'})
  }

  clearAllFilter() {
    this.store.dispatch(new ClearAllFilterObjects())
  }

  ngOnDestroy(): void {
    if(this.filterObjectsSub) this.filterObjectsSub.unsubscribe()
  }
}
