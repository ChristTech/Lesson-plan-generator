
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlanInput, GeneratedLessonPlan } from "../types";

export const generateLessonPlanContent = async (input: LessonPlanInput): Promise<GeneratedLessonPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Generate a detailed lesson plan following the provided format.
  
  INPUT DETAILS:
  School: ${input.schoolName}
  Teacher's Name: ${input.teacherName}
  Term: ${input.term}
  Session: ${input.session}
  Subject: ${input.subject}
  Theme: ${input.theme}
  Topic: ${input.topic}
  Sub-Topic: ${input.subTopic}
  Date: ${input.date}
  Time: ${input.time}
  Duration: ${input.duration}
  Class: ${input.className}
  Average Age: ${input.averageAge}
  Sex: ${input.sex}
  No. in Class: ${input.noInClass}
  Week: ${input.week}

  The generated content should be professional and specifically tailored to the level of the specified class. 
  Follow the structure of a standardized academic lesson plan.
  
  Please provide:
  1. Learning Objectives (specific and measurable)
  2. Rationale / Reason for the lesson
  3. Pre-requisite Knowledge
  4. Learning Materials
  5. Teaching Resources
  6. Reference Materials (books, pages)
  7. Detailed Lesson Development Table (including Introduction, at least 4 Presentation Steps, Evaluation, and Chalkboard Summary/Conclusion).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          learningObjectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of learning objectives."
          },
          rationale: { type: Type.STRING },
          preRequisiteKnowledge: { type: Type.STRING },
          learningMaterials: { type: Type.STRING },
          teachingResources: { type: Type.STRING },
          referenceMaterial: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of books and specific pages used as references."
          },
          developmentSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage: { type: Type.STRING },
                teacherActivities: { type: Type.STRING },
                pupilsActivities: { type: Type.STRING },
                learningPoints: { type: Type.STRING }
              },
              required: ["stage", "teacherActivities", "pupilsActivities", "learningPoints"]
            }
          }
        },
        required: [
          "learningObjectives",
          "rationale", 
          "preRequisiteKnowledge", 
          "learningMaterials", 
          "teachingResources", 
          "referenceMaterial", 
          "developmentSteps"
        ]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate lesson plan content.");
  }

  return JSON.parse(response.text) as GeneratedLessonPlan;
};
