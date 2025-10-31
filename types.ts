// Enum for the different AI tools available in the application
// تعداد لأنواع أدوات الذكاء الاصطناعي المختلفة في التطبيق
export enum Tool {
  ExamMaker = 'صانع الامتحانات',
  LessonExplainer = 'شرح الدروس',
  ProjectBuilder = 'باني المشاريع',
}

// Enum for exam difficulty levels
// تعداد لمستويات صعوبة الامتحان
export enum ExamDifficulty {
  Easy = 'سهل',
  Medium = 'متوسط',
  Hard = 'صعب',
}

// Enum for exam types
// تعداد لأنواع الامتحانات
export enum ExamType {
  MultipleChoice = 'اختيار من متعدد',
  FillInTheBlank = 'املأ الفراغ',
  TrueFalse = 'صح / خطأ',
  Integrated = 'امتحان متكامل',
}

// Enum for lesson explanation styles
// تعداد لأنماط شرح الدروس
export enum LessonStyle {
  Philosophical = 'فلسفي',
  Scientific = 'علمي',
  Simple = 'بسيط للطلاب',
}

// Interface for a single chat message
// واجهة لرسالة محادثة واحدة
export interface ChatMessage {
  id: string;
  tool: Tool;
  input: any; // Can be text, file info, settings, etc.
  output: string;
  timestamp: number;
}