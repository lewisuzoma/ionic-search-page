export interface IProgramme {
  id: number;
  image_src: string;
  programme_name: string;
  course: string;
  institute: string;
  country: string;
  description: string;
  view_count: number;
  impression_count: number;
  program_breakdown: {
    duration: string;
    level: string;
    tuition_fee: string;
    attendance: string;
    study_mode: string;
    language: string;
  };
  requirements: string[];
  structure: string;
  fees: {
    service_fee: string | null;
    international_degree_tuition_fee: string | null;
    housing_fee: string | null;
    acceptance_fee: string | null;
    tuition_fee: string | null;
    application_fee: string | null;
    living_fee: string | null;
  };
  extra_information: string;
  character: string;
  favorite: boolean;
}
