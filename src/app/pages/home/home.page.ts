import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '@app-env/environment';
import { CourseListComponent } from '@app-shared/components/course-list/course-list.component';
import { FilterComponent } from '@app-shared/components/filter/filter.component';
import { ChipListLoader } from '@app-shared/components/loaders/chip-list-loader';
import { ProgramListLoader } from '@app-shared/components/loaders/program-list-loader';
import { ProgramListComponent } from '@app-shared/components/program-list/program-list.component';
import { NoContentComponent } from '@app-shared/components/ui/no-content.component';
import { IProgramme } from '@app-shared/core/interfaces/IPrograme';
import { GlobalService } from '@app-shared/core/services/global.service';
import { LoadPrograms, LoadTags, RemoveTag } from '@app-shared/core/states/program/program.action';
import { ProgramState } from '@app-shared/core/states/program/program.state';
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngxs/store';
import { addIcons } from 'ionicons';
import {arrowBackOutline, chevronDownOutline, close, heart, heartOutline, languageOutline, schoolOutline, shareSocialOutline, timeOutline} from "ionicons/icons";
import { EMPTY, Observable, Subscription, switchMap, take, withLatestFrom } from 'rxjs';
import { SearchPipe } from "@app-shared/core/pipes/search.pipe";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonicModule,
    ProgramListComponent,
    NoContentComponent,
    TitleCasePipe,
    AsyncPipe,
    ProgramListLoader,
    ChipListLoader,
    FormsModule,
    SearchPipe
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnDestroy{
  course$: Observable<string | null> = this.store.select<string | null>(ProgramState.getselectedCourse);
  program$: Observable<IProgramme[] | null> = this.store.select<IProgramme[] | null>(ProgramState.getfilteredPrograms);
  filterObjects$: Observable<string[] | null> = this.store.select<string[] | null>(ProgramState.getfilterObjects);

  readonly cacheValidityDuration = environment.cacheValidityDuration;
  programs: IProgramme[] = []
  tags: string[] = []
  courseData!: string
  searchText!: string
  loading: boolean = true
  
  courseSub!: Subscription
  programSub!: Subscription

  constructor(
    private store: Store,
    private global: GlobalService
  ) {
    addIcons({
      chevronDownOutline,
      arrowBackOutline,
      close,
      shareSocialOutline,
      heartOutline,
      heart,
      timeOutline,
      schoolOutline,
      languageOutline
    })
  }

  ionViewDidEnter() {
    this.loadPrograms()
    this.loadTags()
    this.courseSub = this.course$.subscribe((res: string | null) => {
      this.courseData = res ?? ''
    })
    setTimeout(() => {
      this.programSub = this.program$.subscribe((res) => {
        this.programs = res ?? []
      })
      this.loading = false
    }, 1000)
  }

  openFilter() {
    this.global.openModal(
      FilterComponent,
      {},
      100,
      false,
      'modal-right',
      'filter',
    )
  }
  
  openCourse() {
    this.global.openModal(
      CourseListComponent,
      {},
      100,
      false,
      'modal-right',
      'course',
    )
  }

  loadPrograms() {
    this.store.select(ProgramState.getPrograms)
    .pipe(
      take(1), // Only take the first emitted value
      withLatestFrom(this.store.select(ProgramState.getLastFetched)),
      switchMap(([programs, lastFetched]) => {
        const now = Date.now();
        const isCacheValid = lastFetched && (now - lastFetched < this.cacheValidityDuration);

        console.log('Mobile Networks from Store:', programs);
        if (programs && programs.length > 0 && isCacheValid) {
          console.log('Using data from store:', programs);
          // If data exists in the store, use it
          this.programs = programs;
          // this.loading = false;
          return EMPTY; // Do not proceed to API call
        } else {
          // Else, fetch from API
          console.log('Fetching data from API...');

          // this.loading = true;
          return environment.data;
        }
      })
    )
    .subscribe({
      next: (result: any) => {
        console.log('API Result:', result);
        this.programs = environment.data;
        console.log('Dispatching LoadPrograms with:', environment.data);
        this.store.dispatch(new LoadPrograms(environment.data));
        // this.loading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        // this.loading = false;
      }
    });
  }

  loadTags() {
    this.store.select(ProgramState.getTags)
      .pipe(
        take(1), // Only take the first emitted value
        withLatestFrom(this.store.select(ProgramState.getLastFetched)),
        switchMap(([tags, lastFetched]) => {
          const now = Date.now();
          const isCacheValid = lastFetched && (now - lastFetched < this.cacheValidityDuration);
  
          console.log('Mobile Networks from Store:', tags);
          if (tags && tags.length > 0 && isCacheValid) {
            console.log('Using data from store:', tags);
            // If data exists in the store, use it
            this.tags = tags;
            // this.loading = false;
            return EMPTY; // Do not proceed to API call
          } else {
            // Else, fetch from API
            console.log('Fetching data from API...');
  
            // this.loading = true;
            return environment.tags;
          }
        })
      )
      .subscribe({
        next: (result: any) => {
          console.log('API Result:', result);
          this.tags = environment.tags;
          console.log('Dispatching LoadTags with:', environment.tags);
          this.store.dispatch(new LoadTags(environment.tags));
          // this.loading = false;
        },
        error: (error) => {
          console.error('API Error:', error);
          // this.loading = false;
        }
      });
  }

  removeTags(index: number) {
    this.store.dispatch(new RemoveTag({ index })).subscribe(() => {
      this.loadTags()
    });
  }

  ngOnDestroy(): void {
    if(this.courseSub) this.courseSub.unsubscribe()
    if(this.programSub) this.programSub.unsubscribe()
  }
}
