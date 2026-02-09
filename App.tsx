
import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2, BookOpen, GraduationCap, Library, Trash2, Download, FileDown, CheckCircle2, Mail } from 'lucide-react';
import { LessonPlanInput, GeneratedLessonPlan, SavedLessonPlan } from './types';
import { generateLessonPlanContent } from './services/geminiService';
import LessonPreview from './components/LessonPreview';

import logo from './assets/logo.png';

// The logo is now imported to ensure Vite processes it correctly
const SCHOOL_LOGO = logo;

const App: React.FC = () => {
  const [formData, setFormData] = useState<LessonPlanInput>({
    schoolName: 'TOLPBY GRACE AND GLORY ACADEMY TUNGA MAJE',
    address: ' Abuja, Nigeria',
    teacherName: 'Adebisi Victor',
    term: 'First term',
    session: '2025/2026',
    subject: 'Civic Education',
    theme: 'National values',
    topic: 'Values',
    subTopic: 'Meaning of values',
    date: '11/09/2025',
    time: '8:30am - 9:10am',
    duration: '40 minutes',
    className: 'JSS 1',
    averageAge: '10 Years',
    sex: 'Mixed',
    noInClass: '20',
    week: '1'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<GeneratedLessonPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedLessonPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const plan = await generateLessonPlanContent(formData);
      setCurrentPlan(plan);
    } catch (err) {
      console.error(err);
      setError("Failed to generate lesson plan. Please check your network connection or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCollection = useCallback(() => {
    if (!currentPlan) return;

    const newSavedPlan: SavedLessonPlan = {
      id: crypto.randomUUID(),
      input: { ...formData },
      plan: currentPlan
    };

    setSavedPlans(prev => [...prev, newSavedPlan]);
    setCurrentPlan(null);
    setSuccessMessage(`Week ${formData.week} plan added to collection!`);

    const nextWeek = parseInt(formData.week) + 1;
    setFormData(prev => ({ ...prev, week: nextWeek.toString() }));

    setTimeout(() => {
      document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [currentPlan, formData]);

  const removePlan = (id: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
  };

  const downloadCombinedPdf = useCallback(() => {
    const element = document.getElementById('combined-collection-preview');
    if (!element || savedPlans.length === 0) return;

    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: `Weekly_Lesson_Plans_${formData.subject.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  }, [savedPlans, formData.subject]);

  const downloadCombinedWord = useCallback(() => {
    const element = document.getElementById('combined-collection-preview');
    if (!element || savedPlans.length === 0) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Weekly Lesson Plans</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.4; position: relative; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          th, td { border: 1px solid #999; padding: 6px; text-align: left; vertical-align: top; }
          th { background-color: #f8f9fa; color: #1e3a8a; }
          h1 { color: #1e3a8a; }
          .page-break { page-break-after: always; }
          .watermark-bg { position: fixed; top: 25%; left: 25%; width: 50%; opacity: 0.04; z-index: -1; }
        </style>
      </head>
      <body>
        <img src="${SCHOOL_LOGO}" class="watermark-bg" />
    `;
    const footer = "</body></html>";
    const content = element.innerHTML;
    const blob = new Blob([header + content + footer], { type: 'application/msword' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Weekly_Lesson_Plans_${formData.subject.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [savedPlans, formData.subject]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1 rounded-lg flex items-center justify-center">
              <img src={SCHOOL_LOGO} alt="School Logo" className="w-10 h-10 object-contain rounded-md"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Smart Lesson Plan</h1>
              <p className="text-xs text-blue-600 font-semibold tracking-tight">Built by CHRISTTech • adebisivictor39@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {savedPlans.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <Library className="w-3 h-3" />
                {savedPlans.length} {savedPlans.length === 1 ? 'Plan' : 'Plans'} Saved
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <BookOpen className="w-4 h-4" />
              <span>Standard Template Mode</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Form Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-slate-800">New Lesson Details</h2>
              </div>
              <p className="text-xs text-slate-400">Template Version 2026</p>
            </div>

            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-sm font-medium text-slate-700">School Name</label>
                <input
                  type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. TOLPBY GRACE AND GLORY ACADEMY TUNGA MAJE" required
                />
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-sm font-medium text-slate-700">School Address</label>
                <input
                  type="text" name="address" value={formData.address} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="School address" required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Teacher's Name</label>
                <input
                  type="text" name="teacherName" value={formData.teacherName} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Term</label>
                <select
                  name="term" value={formData.term} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>First term</option>
                  <option>Second term</option>
                  <option>Third term</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Session</label>
                <input
                  type="text" name="session" value={formData.session} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Week</label>
                <input
                  type="number" name="week" value={formData.week} onChange={handleInputChange} min="1" max="15"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Subject</label>
                <input
                  type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Theme</label>
                <input
                  type="text" name="theme" value={formData.theme} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Topic</label>
                <input
                  type="text" name="topic" value={formData.topic} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Sub-Topic</label>
                <input
                  type="text" name="subTopic" value={formData.subTopic} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Date</label>
                <input
                  type="text" name="date" value={formData.date} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Time Range</label>
                <input
                  type="text" name="time" value={formData.time} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 8:30am - 9:10am"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Class</label>
                <input
                  type="text" name="className" value={formData.className} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Average Age</label>
                <input
                  type="text" name="averageAge" value={formData.averageAge} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Sex</label>
                <input
                  type="text" name="sex" value={formData.sex} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">No. in Class</label>
                <input
                  type="text" name="noInClass" value={formData.noInClass} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Duration</label>
                <input
                  type="text" name="duration" value={formData.duration} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="lg:col-span-4 pt-4 border-t border-slate-100 flex gap-3 items-center">
                <button
                  type="submit" disabled={isLoading}
                  className="flex-1 md:flex-none px-12 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Designing Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Plan
                    </>
                  )}
                </button>
                {successMessage && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {successMessage}
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* Current Generation Result */}
        {currentPlan && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <LessonPreview
              input={formData}
              plan={currentPlan}
              onAddToCollection={addToCollection}
              schoolLogo={SCHOOL_LOGO}
            />
          </div>
        )}

        {/* Saved Collection Section */}
        {savedPlans.length > 0 && (
          <section id="collection-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Library className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Weekly Collection</h2>
                  <p className="text-sm text-slate-500">All plans formatted to your specified template.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadCombinedWord}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  Export All (Word)
                </button>
                <button
                  onClick={downloadCombinedPdf}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export All (PDF)
                </button>
              </div>
            </div>

            <div id="combined-collection-preview" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Library className="w-5 h-5 text-blue-500" />
                  Full Collection Preview
                </h3>
              </div>
              <div className="divide-y-2 divide-slate-100">
                {savedPlans.map((item) => (
                  <LessonPreview
                    key={item.id}
                    input={item.input}
                    plan={item.plan}
                    isInsideCollection={true}
                    schoolLogo={SCHOOL_LOGO}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {!currentPlan && savedPlans.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="bg-blue-50 p-6 rounded-full mb-4 opacity-50 flex items-center justify-center">
              <img src={SCHOOL_LOGO} alt="Logo" className="w-16 h-16 grayscale object-contain rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/graduation-cap.svg'; }} />
            </div>
            <h3 className="text-xl font-bold text-slate-600">No Plans Yet</h3>
            <p className="text-sm text-slate-500 max-w-xs text-center mt-2">
              Generate a plan above. It will be formatted to your school's official template automatically.
            </p>
          </div>
        )}
      </main>

      <footer className="py-12 bg-slate-900 text-slate-400 text-center text-sm print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-white font-bold text-lg opacity-80">
              <img src={SCHOOL_LOGO} alt="Logo" className="w-8 h-8 rounded-md object-contain bg-white/10 p-0.5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              Tolpby Smart Lesson Plan Generator
            </div>
            <div className="flex flex-col items-center gap-1 mt-4">
              <p className="font-bold text-blue-400">Built by CHRISTTech</p>
              <a href="mailto:adebisivictor39@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                adebisivictor39@gmail.com
              </a>
            </div>
            <div className="h-px w-full bg-slate-800 my-4"></div>
            <p>&copy; 2026. Standardized Educational Resource Tool.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;