
import React, { useState, useCallback } from 'react';
import { Clipboard, Download, FileText, Bot, UploadCloud, CheckCircle } from 'lucide-react';
import { Tool, ExamDifficulty, ExamType } from '../types';
import { generateContent } from '../services/geminiService';
import ToolContainer from './shared/ToolContainer';
import ActionButton from './shared/ActionButton';
import FileUpload from './shared/FileUpload';

const ExamMaker: React.FC = () => {
  const [difficulty, setDifficulty] = useState<ExamDifficulty>(ExamDifficulty.Medium);
  const [examType, setExamType] = useState<ExamType>(ExamType.MultipleChoice);
  const [sourceText, setSourceText] = useState('');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [generatedExam, setGeneratedExam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // Handle form submission to generate the exam
  const handleSubmit = useCallback(async () => {
    if (!sourceText && !sourceFile) {
      setError('يرجى تقديم بعض النص أو تحميل ملف لإنشاء الامتحان.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedExam('');

    const prompt = `
      أنت مساعد ذكاء اصطناعي متخصص في إنشاء الاختبارات التعليمية.
      قم بإنشاء اختبار كامل بناءً على المحتوى المقدم.
      
      المعلمات:
      - مستوى الصعوبة: ${difficulty}
      - نوع الاختبار: ${examType}
      
      المحتوى:
      ${sourceText}
      
      التعليمات:
      - قم بتنسيق المخرجات بصيغة ماركداون نظيفة ومنظمة جيدًا باللغة العربية.
      - بالنسبة لأسئلة الاختيار من متعدد، قدم 4 خيارات وحدد الإجابة الصحيحة بوضوح.
      - بالنسبة لأسئلة املأ الفراغ، استخدم الشرطة السفلية (_) للمساحة الفارغة.
      - بالنسبة للاختبارات المتكاملة، قم بتضمين مزيج من جميع أنواع الأسئلة.
      - بعد كل الأسئلة، قدم قسمًا منفصلاً لمفتاح الإجابات.
    `;
    
    try {
      const result = await generateContent(prompt, sourceFile || undefined);
      setGeneratedExam(result);
    } catch (err) {
      setError('فشل في إنشاء الامتحان. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, examType, sourceText, sourceFile]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedExam);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const acceptedFileTypes = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

  return (
    <ToolContainer 
      title="صانع الامتحانات" 
      description="ارفع مستندًا أو الصق نصًا لإنشاء اختبار مخصص على الفور."
      icon={<FileText className="w-6 h-6 text-white"/>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-purple-300">الإعدادات</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">مستوى الصعوبة</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as ExamDifficulty)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500">
                {Object.values(ExamDifficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">نوع الامتحان</label>
              <select value={examType} onChange={(e) => setExamType(e.target.value as ExamType)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500">
                {Object.values(ExamType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">النص المصدر</label>
              <textarea 
                value={sourceText} 
                onChange={(e) => setSourceText(e.target.value)} 
                rows={8} 
                placeholder="الصق محتوى الدرس هنا..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <FileUpload
                file={sourceFile}
                onFileChange={setSourceFile}
                acceptedTypes={acceptedFileTypes}
              />
            </div>
            <ActionButton onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء الامتحان'}
            </ActionButton>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">الامتحان الذي تم إنشاؤه</h3>
          <div className="bg-black/30 rounded-lg p-4 min-h-[400px] border border-gray-700 prose prose-invert max-w-none">
            {isLoading && <div className="flex justify-center items-center h-full"><Bot className="w-10 h-10 animate-spin text-purple-400" /></div>}
            {generatedExam && (
              <>
                <div className="flex justify-end space-x-2 mb-4">
                   <button onClick={handleCopy} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm flex items-center">
                    {isCopied ? <CheckCircle size={16} className="ml-1 text-green-400"/> : <Clipboard size={16} className="ml-1"/>}
                    {isCopied ? 'تم النسخ!' : 'نسخ'}
                  </button>
                  <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm flex items-center"><Download size={16} className="ml-1"/>PDF</button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-right">{generatedExam}</pre>
              </>
            )}
            {!isLoading && !generatedExam && <p className="text-gray-500">سيظهر امتحانك الذي تم إنشاؤه هنا.</p>}
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};

export default ExamMaker;
