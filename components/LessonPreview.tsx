
import React from 'react';
import { LessonPlanInput, GeneratedLessonPlan } from '../types';
import { Download, Printer, FileDown, Plus } from 'lucide-react';

interface LessonPreviewProps {
  input: LessonPlanInput;
  plan: GeneratedLessonPlan;
  onDownloadPdf?: () => void;
  onDownloadWord?: () => void;
  onAddToCollection?: () => void;
  isInsideCollection?: boolean;
  schoolLogo: string;
}

const LessonPreview: React.FC<LessonPreviewProps> = ({ 
  input, 
  plan, 
  onDownloadPdf, 
  onDownloadWord, 
  onAddToCollection,
  isInsideCollection = false,
  schoolLogo
}) => {
  return (
    <div className={`bg-white ${isInsideCollection ? 'border-b-2 border-slate-200 last:border-0 pb-12' : 'rounded-xl shadow-lg border border-slate-200 overflow-hidden'}`}>
      {!isInsideCollection && (
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap gap-4 justify-between items-center print:hidden">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <img src={schoolLogo} alt="School Logo" className="w-6 h-6 rounded-md object-contain" />
            Template Preview: {input.topic}
          </h2>
          <div className="flex flex-wrap gap-2">
            {onAddToCollection && (
              <button 
                onClick={onAddToCollection}
                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white text-sm font-medium hover:bg-green-700 rounded-lg shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add to Weekly Collection
              </button>
            )}
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            {onDownloadWord && (
              <button 
                onClick={onDownloadWord}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
              >
                <FileDown className="w-4 h-4" />
                Word
              </button>
            )}
            {onDownloadPdf && (
              <button 
                onClick={onDownloadPdf}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 rounded-lg shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            )}
          </div>
        </div>
      )}

      <div className={`watermark-container p-6 sm:p-12 max-w-5xl mx-auto text-slate-900 leading-snug space-y-6 bg-white ${isInsideCollection ? 'page-break' : ''}`}>
        {/* Watermark Logo */}
        <img src={schoolLogo} className="watermark-bg object-contain" alt="" aria-hidden="true" />
        
        <div className="lesson-content-inner space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6 border-b-2 border-slate-300 pb-4">
            <div className="flex-shrink-0">
              <img src={schoolLogo} alt="School Logo" className="w-24 h-24 object-contain" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-tight">{input.schoolName}</h1>
              <p className="text-sm font-semibold text-blue-800">Address: <span className="font-normal text-slate-600">{input.address}</span></p>
            </div>
          </div>

          {/* Teacher Metadata */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[15px] font-bold text-blue-900">
            <p>Teacher's Name: <span className="font-normal text-slate-700 border-b border-slate-300 min-w-[150px] inline-block ml-1">{input.teacherName}</span></p>
            <p>Term: <span className="font-normal text-slate-700 border-b border-slate-300 min-w-[100px] inline-block ml-1">{input.term}</span></p>
            <p>Session: <span className="font-normal text-slate-700 border-b border-slate-300 min-w-[100px] inline-block ml-1">{input.session}</span></p>
          </div>

          <h2 className="text-lg font-bold text-blue-900 uppercase text-center mt-4">Lesson Plan Template</h2>

          {/* Table 1: Meta Information */}
          <div className="overflow-hidden border border-slate-300 rounded-sm">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-1/3 p-2 font-bold text-blue-900 border-r border-slate-300">Subject</td>
                  <td className="p-2 text-slate-700">{input.subject}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Theme</td>
                  <td className="p-2 text-slate-700">{input.theme}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Topic</td>
                  <td className="p-2 text-slate-700">{input.topic}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Sub-Topic</td>
                  <td className="p-2 italic text-slate-700">{input.subTopic}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Date</td>
                  <td className="p-2 text-slate-700">{input.date}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Time</td>
                  <td className="p-2 text-slate-700">{input.time}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Duration</td>
                  <td className="p-2 text-slate-700">{input.duration}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Class</td>
                  <td className="p-2 text-slate-700">{input.className}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Average Age</td>
                  <td className="p-2 text-slate-700">{input.averageAge}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">Sex</td>
                  <td className="p-2 text-slate-700">{input.sex}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300">No. in Class</td>
                  <td className="p-2 text-slate-700">{input.noInClass}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Educational Content with HOD Remarks column */}
          <div className="overflow-hidden border border-slate-300 rounded-sm mt-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300">
                  <th className="w-[30%] p-2 text-left font-bold text-blue-900 border-r border-slate-300">Section</th>
                  <th className="w-[45%] p-2 text-left font-bold text-blue-900 border-r border-slate-300">Details</th>
                  <th className="w-[25%] p-2 text-left font-bold text-blue-600 bg-red-50/30">HOD's Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr className="page-break-inside-avoid">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300 align-top">Learning Objectives</td>
                  <td className="p-2 border-r border-slate-300">
                    <ol className="list-decimal pl-5 space-y-1">
                      {plan.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ol>
                  </td>
                  <td className="p-2 bg-red-50/10"></td>
                </tr>
                <tr className="page-break-inside-avoid">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300 align-top">Rationale / Reason</td>
                  <td className="p-2 border-r border-slate-300 text-justify">{plan.rationale}</td>
                  <td className="p-2 bg-red-50/10"></td>
                </tr>
                <tr className="page-break-inside-avoid">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300 align-top">Pre-requisite Knowledge</td>
                  <td className="p-2 border-r border-slate-300">{plan.preRequisiteKnowledge}</td>
                  <td className="p-2 bg-red-50/10"></td>
                </tr>
                <tr className="page-break-inside-avoid">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300 align-top">Learning Materials</td>
                  <td className="p-2 border-r border-slate-300">{plan.learningMaterials}</td>
                  <td className="p-2 bg-red-50/10"></td>
                </tr>
                <tr className="page-break-inside-avoid">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300 align-top">Teaching Resources</td>
                  <td className="p-2 border-r border-slate-300">{plan.teachingResources}</td>
                  <td className="p-2 bg-red-50/10"></td>
                </tr>
                <tr className="page-break-inside-avoid">
                  <td className="p-2 font-bold text-blue-900 border-r border-slate-300 align-top">Reference Material</td>
                  <td className="p-2 border-r border-slate-300">
                    <ul className="list-disc pl-5">
                      {plan.referenceMaterial.map((ref, i) => <li key={i}>{ref}</li>)}
                    </ul>
                  </td>
                  <td className="p-2 bg-red-50/10"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 3: Lesson Development Table */}
          <div className="mt-8 space-y-2">
            <h3 className="text-md font-bold text-blue-900">Lesson Development</h3>
            <div className="overflow-hidden border border-slate-300 rounded-sm">
              <table className="w-full text-[13px] border-collapse">
                <thead className="bg-slate-50 border-b border-slate-300">
                  <tr>
                    <th className="p-2 text-left font-bold text-blue-900 border-r border-slate-300 w-[15%]">Stage/Step</th>
                    <th className="p-2 text-left font-bold text-blue-900 border-r border-slate-300 w-[25%]">Teacher's Activities</th>
                    <th className="p-2 text-left font-bold text-blue-900 border-r border-slate-300 w-[25%]">Pupils' Activities</th>
                    <th className="p-2 text-left font-bold text-blue-900 border-r border-slate-300 w-[20%]">Learning Points</th>
                    <th className="p-2 text-left font-bold text-blue-600 bg-red-50/30 w-[15%]">HOD's Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {plan.developmentSteps.map((step, i) => (
                    <tr key={i} className="page-break-inside-avoid">
                      <td className="p-2 font-bold border-r border-slate-300 align-top">{step.stage}</td>
                      <td className="p-2 border-r border-slate-300 align-top whitespace-pre-wrap">{step.teacherActivities}</td>
                      <td className="p-2 border-r border-slate-300 align-top whitespace-pre-wrap">{step.pupilsActivities}</td>
                      <td className="p-2 border-r border-slate-300 align-top font-medium italic">{step.learningPoints}</td>
                      <td className="p-2 bg-red-50/10 align-top"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPreview;
