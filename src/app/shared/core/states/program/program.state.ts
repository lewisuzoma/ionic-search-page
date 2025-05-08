import { inject, Injectable } from "@angular/core";
import { ProgramStateModel } from "./program.model";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ClearAllFilterObjects, ClearFilterObjects, LoadInstitutes, LoadPrograms, LoadTags, RemoveTag, SelectCourse, SelectFilterObjects, SelectProgram, ToggleFavorite, TuitionFeeFilter } from "./program.action";
import { IProgramme } from "@app-shared/core/interfaces/IPrograme";
import { GlobalService } from "@app-shared/core/services/global.service";

@State<ProgramStateModel>({
    name: 'programState',
    defaults: {
        program: {
            tags: [],
            programs: [],
            filteredPrograms: [],
            program: null,
            institues: [],
            filterObjects: [],
            selectedFilterInstitute: null,
            tuitionFeeRange: {min: 70000, max: 100000},
            selectCourse: null,
            lastFetched: null,
            loading: false
        },
    }
  })
  
@Injectable()

export class ProgramState {
    public global = inject(GlobalService)

    @Selector()
    static getLoader(state: ProgramStateModel): boolean {
        return state.program.loading;
    }
   
    @Selector()
    static getTuitionFeeRange(state: ProgramStateModel): {min: string | number, max: string | number} | null {
        return state.program.tuitionFeeRange;
    }
    
    @Selector()
    static getLastFetched(state: ProgramStateModel): number | null {
        return state.program.lastFetched;
    }

    @Selector()
    static getPrograms(state: ProgramStateModel):  IProgramme[] | null {
        return state.program.programs;
    }
    
    @Selector()
    static getfilteredPrograms(state: ProgramStateModel):  IProgramme[] | null {
        return state.program.filteredPrograms;
    }
    
    @Selector()
    static getProgram(state: ProgramStateModel):  IProgramme | null {
        return state.program.program;
    }
    
    @Selector()
    static getInstitutes(state: ProgramStateModel):  any[] | null {
        return state.program.institues;
    }
    
    @Selector()
    static getTags(state: ProgramStateModel):  any[] | null {
        return state.program.tags;
    }
    
    @Selector()
    static getselectedCourse(state: ProgramStateModel):  string | null {
        return state.program.selectCourse;
    }
    
    @Selector()
    static getfilterObjects(state: ProgramStateModel):  string[] | [] {
        return state.program.filterObjects;
    }
    
    @Selector()
    static getselectedFilterInstitute(state: ProgramStateModel):  string | null {
        return state.program.selectedFilterInstitute;
    }

    @Action(LoadInstitutes)
    LoadInstitutes(ctx: StateContext<ProgramStateModel>, action: LoadInstitutes) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            program: {
                ...state.program,
                institues: action.payload || [],
                lastFetched: Date.now()
            }
        });
    }
    
    @Action(LoadTags)
    LoadTags(ctx: StateContext<ProgramStateModel>, action: LoadTags) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            program: {
                ...state.program,
                tags: action.payload || [],
                lastFetched: Date.now()
            }
        });
    }
    
    @Action(RemoveTag)
    RemoveTag(ctx: StateContext<ProgramStateModel>, action: RemoveTag) {
        const state = ctx.getState();
        const tags = state.program.tags.filter((_, index) => index !== (action.payload?.index ?? -1)); // Filter by index

        ctx.patchState({
            program: {
            ...state.program,
            tags: tags,
            lastFetched: Date.now(),
            },
        });
    }
   
    @Action(LoadPrograms)
    LoadPrograms(ctx: StateContext<ProgramStateModel>, action: LoadPrograms) {
        const state = ctx.getState();
        ctx.patchState({
            program: {
                ...state.program,
                loading: true
            }
        });
        ctx.setState({
            ...state,
            program: {
                ...state.program,
                programs: action.payload || [],
                lastFetched: Date.now(),
                loading: false
            }
        });
    }
    
    @Action(SelectProgram)
    SelectProgram(ctx: StateContext<ProgramStateModel>, action: SelectProgram) {
        const state = ctx.getState();
        ctx.patchState({
            program: {
                ...state.program,
                loading: true
            }
        });
        let program = state.program.programs.find(
            (program) => program.id === action.payload
        );

        ctx.patchState({
            ...state,
            program: {
                ...state.program,
                program: program || null,
                lastFetched: Date.now(),
                loading: false
            }
        });
    }
    
    @Action(SelectCourse)
    SelectCourse(ctx: StateContext<ProgramStateModel>, action: SelectCourse) {
        const state = ctx.getState();        
        const programs = state.program.programs.filter((program) => program.course === (action.payload));

        ctx.patchState({
            ...state,
            program: {
                ...state.program,
                filteredPrograms: (action.payload === 'All') ? state.program.programs : programs,
                selectCourse: action.payload || null,
                lastFetched: Date.now()
            }
        });
    }
    
    @Action(SelectFilterObjects)
    selectFilterObjects(ctx: StateContext<ProgramStateModel>, action: SelectFilterObjects) {
        const state = ctx.getState();
        const programs = state.program.programs.filter((program) => program.institute === (action.payload?.value ?? ''));

        ctx.patchState({
            ...state,
            program: {
                ...state.program,
                filteredPrograms: programs,
                selectedFilterInstitute: action.payload?.value ?? null,
                filterObjects: this.global.updateOrAddObject(state.program.filterObjects || [], action.payload) || [],
                lastFetched: Date.now()
            }
        });
    }
    
    @Action(TuitionFeeFilter)
    TuitionFeeFilter(ctx: StateContext<ProgramStateModel>, action: TuitionFeeFilter) {
        const state = ctx.getState();
        
        const programs = state.program.programs.filter((program) => {
            const min = action.payload?.min ?? 0;
            const max = action.payload?.max ?? 0;
            if (min && max) {
                const numericTuitionFee = program.fees.tuition_fee ? parseInt(program.fees.tuition_fee.replace(",", "")) : 0;
                return numericTuitionFee >= Number(min) && numericTuitionFee <= Number(max);
            } else if (min) {
                const numericTuitionFee = program.fees.tuition_fee ? parseInt(program.fees.tuition_fee.replace(",", "")) : 0;
                return numericTuitionFee >= Number(min);
            } else if (max) {
                const numericTuitionFee = program.fees.tuition_fee ? parseInt(program.fees.tuition_fee.replace(",", "")) : 0;
                return numericTuitionFee <= Number(max);
            }
            return false; // Ensure all code paths return a value
        });
        console.log(programs, action.payload?.min, action.payload?.max)
        let data = {
            ...state.program.tuitionFeeRange,
            min: this.global.formatCurrency(Number(action.payload?.min ?? 0)) ?? this.global.formatCurrency(Number(state.program.tuitionFeeRange.min)),
            max: this.global.formatCurrency(Number(action.payload?.max)) ?? this.global.formatCurrency(Number(state.program.tuitionFeeRange.max)),
        }

        ctx.patchState({
            ...state,
            program: {
                ...state.program,
                filteredPrograms: programs,
                tuitionFeeRange: data,
                lastFetched: Date.now()
            }
        });
    }
    
    @Action(ClearFilterObjects)
    ClearFilterObjects(ctx: StateContext<ProgramStateModel>, action: ClearFilterObjects) {
        const state = ctx.getState();
        
        ctx.patchState({
            ...state,
            program: {
                ...state.program,
                filteredPrograms: state.program.programs,
                selectedFilterInstitute: null,
                filterObjects: this.global.removeObject(state.program.filterObjects || [], action.payload) || [],
                lastFetched: Date.now()
            }
        });
    }
    
    @Action(ClearAllFilterObjects)
    ClearAllFilterObjects(ctx: StateContext<ProgramStateModel>) {
        const state = ctx.getState();
        
        ctx.patchState({
            ...state,
            program: {
                ...state.program,
                filteredPrograms: state.program.programs,
                selectedFilterInstitute: null,
                filterObjects: [],
                lastFetched: Date.now()
            }
        });
    }
    
    @Action(ToggleFavorite)
    ToggleFavorite(ctx: StateContext<ProgramStateModel>, action: ToggleFavorite) {
        const state = ctx.getState();
        const updatedPrograms = state.program.programs.map((program) => {
            if (program.id === action.payload) {
                console.log(program.id, action.payload)
                return {
                    ...program,
                    favorite: !program.favorite, // Correct way to toggle
                };
            }
            return program;
        });
        console.log(action.payload , updatedPrograms)
        ctx.patchState({
            ...state,
            program: {
                ...state.program,
                filteredPrograms: updatedPrograms,
            }
        });
    }
}
