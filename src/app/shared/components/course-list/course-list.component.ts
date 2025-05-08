import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '@app-shared/core/services/global.service';
import { IonicModule } from '@ionic/angular'
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { NoContentComponent } from "../ui/no-content.component";
import { SearchPipe } from "../../core/pipes/search.pipe";
import { Store } from '@ngxs/store';
import { SelectCourse } from '@app-shared/core/states/program/program.action';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    NoContentComponent,
    SearchPipe
]
})
export class CourseListComponent  implements OnInit {
  searchText!: string; 
  courses: any[] = [
    {
      "name": "All"
    },
    {
      "name": "Computer Science"
    },
    {
      "name": "Computer Technologies"
    },
    {
      "name": "Software Engineer"
    },
    {
      "name": "Business Administration"
    },
  ]

  constructor(
    private global: GlobalService,
    private store: Store
  ) { 
    addIcons({
      chevronBackOutline
    })
  }

  ngOnInit() {}

  selectCourse(event: CustomEvent | null) {
    if (event) {
      this.store.dispatch(new SelectCourse(event.detail.value)).subscribe(() => {
        this.closeCourses()
      })
    }
  }

  closeCourses() {
    this.global.closeModal({id: 'course'})
  }

}
