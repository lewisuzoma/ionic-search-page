import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonRow,
  IonCol,
  IonText,
  IonBadge,
  IonChip, IonCard,
  IonCardContent, IonCardHeader,
  IonCardTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, close, chevronDownOutline, heartOutline, languageOutline, schoolOutline, shareSocialOutline, timeOutline, chevronBackOutline, checkmarkDoneOutline, alertCircleOutline, chevronForwardOutline, heart, closeOutline } from 'ionicons/icons';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { SelectProgram } from '@app-shared/core/states/program/program.action';
import { Observable, Subscription } from 'rxjs';
import { ProgramState } from '@app-shared/core/states/program/program.state';
import { IProgramme } from '@app-shared/core/interfaces/IPrograme';
import { ProgramDetailsComponent } from '@app-shared/components/program-details/program-details.component';
import { ProgramDetailLoader } from '@app-shared/components/loaders/program-detail-loader';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.page.html',
  styleUrls: ['./program-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonRow,
    IonCol,
    IonText,
    IonBadge,
    IonChip,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    ProgramDetailsComponent,
    RouterLink,
    ProgramDetailLoader
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgramDetailsPage implements OnInit, OnDestroy {
  program$: Observable<IProgramme | null> = this.store.select<IProgramme | null>(ProgramState.getProgram);
  loader$: Observable<boolean> = this.store.select<boolean>(ProgramState.getLoader);
  programData!: IProgramme
  userSub!: Subscription

  loading: boolean = true

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) { 
    addIcons({
      chevronDownOutline,
      chevronBackOutline,
      arrowBackOutline,
      close,
      shareSocialOutline,
      heartOutline,
      heart,
      timeOutline,
      schoolOutline,
      languageOutline,
      checkmarkDoneOutline,
      alertCircleOutline,
      chevronForwardOutline,
      closeOutline
    })
  }

  ngOnInit() {
    
    this.store.dispatch(new SelectProgram(parseInt(this.route.snapshot.params['id']))).subscribe(() => {
      this.userSub = this.program$.subscribe((res) => {
        if (res) {
          this.programData = res;
          this.loading = false
        }
      })
    })
  }

  ngOnDestroy(): void {
    if(this.userSub) this.userSub.unsubscribe()
  }

}
