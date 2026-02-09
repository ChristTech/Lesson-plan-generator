
export interface LessonPlanInput {
  schoolName: string;
  address: string;
  teacherName: string;
  term: string;
  session: string;
  subject: string;
  theme: string;
  topic: string;
  subTopic: string;
  date: string;
  time: string;
  duration: string;
  className: string;
  averageAge: string;
  sex: string;
  noInClass: string;
  week: string;
}

export interface LessonDevelopmentStep {
  stage: string;
  teacherActivities: string;
  pupilsActivities: string;
  learningPoints: string;
}

export interface GeneratedLessonPlan {
  learningObjectives: string[];
  rationale: string;
  preRequisiteKnowledge: string;
  learningMaterials: string;
  teachingResources: string;
  referenceMaterial: string[];
  developmentSteps: LessonDevelopmentStep[];
}

export interface SavedLessonPlan {
  id: string;
  input: LessonPlanInput;
  plan: GeneratedLessonPlan;
}
