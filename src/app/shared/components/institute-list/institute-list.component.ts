import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '@app-env/environment';
import { IInstitutes } from '@app-shared/core/interfaces/IInstitutes';
import { GlobalService } from '@app-shared/core/services/global.service';
import { ClearFilterObjects, LoadInstitutes, SelectFilterObjects } from '@app-shared/core/states/program/program.action';
import { ProgramState } from '@app-shared/core/states/program/program.state';
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngxs/store';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { EMPTY, Observable, Subscription, switchMap, take, withLatestFrom } from 'rxjs';
import { SearchPipe } from "@app-shared/core/pipes/search.pipe";
import { NoContentComponent } from "../ui/no-content.component";

@Component({
  selector: 'app-institute-list',
  templateUrl: './institute-list.component.html',
  styleUrls: ['./institute-list.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    SearchPipe,
    NoContentComponent
]
})
export class InstituteListComponent  implements OnInit,OnDestroy {
  filterObjects$: Observable<string[] | null> = this.store.select<string[] | null>(ProgramState.getfilterObjects);
  
  readonly cacheValidityDuration = environment.cacheValidityDuration;
  institues: IInstitutes[] = []
  searchText!: string; 
  selectedInstitute!: string; 

  filterObjectsSub!: Subscription

  constructor(
    private global: GlobalService,
    private store: Store
  ) { 
    addIcons({
      chevronBackOutline
    })
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadInstitutes()
    this.filterObjectsSub = this.filterObjects$.subscribe((res: any) => {
      if(res) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === 'institute') {
            this.selectedInstitute = res[i].value
            break;
          }
        }
      }
    })
  }

  loadInstitutes() {
    this.store.select(ProgramState.getInstitutes)
        .pipe(
          take(1),
          withLatestFrom(this.store.select(ProgramState.getLastFetched)),
          switchMap(([institues, lastFetched]) => {
            const now = Date.now();
            const isCacheValid = lastFetched && (now - lastFetched < this.cacheValidityDuration);
    
            if (institues && institues.length > 0 && isCacheValid) {
              this.institues = institues;
              return EMPTY;
            } else {
              // this.loading = true;
              return environment.institutes;
            }
          })
        )
        .subscribe({
          next: (result: any) => {
            console.log('API Result:', result);
            this.institues = environment.institutes;
            console.log('Dispatching LoadPrograms with:', environment.institutes);
            this.store.dispatch(new LoadInstitutes(environment.institutes));
            // this.loading = false;
          },
          error: (error) => {
            console.error('API Error:', error);
            // this.loading = false;
          }
        });
  }

  closeInstitute() {
    let data = {
      name: 'institute',
      value: this.selectedInstitute
    }
    
    this.store.dispatch(new SelectFilterObjects(data)).subscribe(() => {
      this.global.closeModal({id: 'institute'})
    })
  }
  
  clearInstitute() {
    let data = {
      name: 'institute',
      value: this.selectedInstitute
    }
    this.store.dispatch(new ClearFilterObjects(data))
    this.global.closeModal({id: 'institute'})
  }

  ngOnDestroy(): void {
    if(this.filterObjectsSub) this.filterObjectsSub.unsubscribe()
  }
}
