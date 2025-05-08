import { IInstitutes } from "@app-shared/core/interfaces/IInstitutes";
import { IProgramme } from "@app-shared/core/interfaces/IPrograme";

const ACTION_SCOPE = '[Program]';

export class LoadPrograms {
    static readonly type = `${ACTION_SCOPE} List of Programs`;
    constructor(public payload?: IProgramme[] ) {}
}

export class SelectProgram {
    static readonly type = `${ACTION_SCOPE} Select Program`;
    constructor(public payload?: number ) {}
}

export class LoadTags {
    static readonly type = `${ACTION_SCOPE} List of Tags`;
    constructor(public payload?: string[] ) {}
}

export class RemoveTag {
    static readonly type = `${ACTION_SCOPE} Remove of Tag`;
    constructor(public payload?: { index: number } ) {}
}

export class LoadInstitutes {
    static readonly type = `${ACTION_SCOPE} List of Institutes`;
    constructor(public payload?: IInstitutes[] ) {}
}

export class SelectCourse {
    static readonly type = `${ACTION_SCOPE} Select course`;
    constructor(public payload?: string ) {}
}

export class TuitionFeeFilter {
    static readonly type = `${ACTION_SCOPE} Tuition fee filter`;
    constructor(public payload?: {min: number | string, max: number | string} ) {}
}

export class SelectFilterObjects {
    static readonly type = `${ACTION_SCOPE} Select filter objects`;
    constructor(public payload?: {name: string, value: string} ) {}
}

export class ClearFilterObjects {
    static readonly type = `${ACTION_SCOPE} Clear filter objects`;
    constructor(public payload?: {name: string, value: string} ) {}
}

export class ClearAllFilterObjects {
    static readonly type = `${ACTION_SCOPE} Clear all filter objects`;
}

export class ToggleFavorite {
    static readonly type = `${ACTION_SCOPE} Toggle favorite`;
    constructor(public payload: number ) {}
}