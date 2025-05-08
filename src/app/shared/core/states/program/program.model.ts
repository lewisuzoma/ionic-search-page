import { IInstitutes } from "@app-shared/core/interfaces/IInstitutes"
import { IProgramme } from "@app-shared/core/interfaces/IPrograme"

export interface ProgramStateModel {
    program: {
      tags: string[] | []
      programs: IProgramme[] | []
      filteredPrograms: IProgramme[] | []
      institues: IInstitutes[] | []
      filterObjects: [] | []
      selectedFilterInstitute: string | null
      tuitionFeeRange: {min: string | number, max: string | number}
      program: IProgramme | null,
      selectCourse: string | null;
      lastFetched: number | null;
      loading: boolean;
    }
  }
  