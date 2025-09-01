import React, { useState } from 'react';
import { Search, Download, Eye, User, Calendar, Award, FileText, ArrowLeft, TrendingUp, BookOpen, GraduationCap, Star, Trophy, Medal, Target, BarChart3, PieChart, BookMarked, Users, School, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

// Types
interface Student {
  admissionNo: string;
  name: string;
  photo: string;
  class: string;
  section: string;
  dateOfAdmission: string;
  currentPercentage: number;
  rank: number;
  emoji: string;
}

interface SubjectMark {
  subject: string;
  totalMarks: number;
  sem1: number;
  sem2: number;
  finalMarks: number;
  finalPercentage: number;
  emoji: string;
}

interface YearlyResult {
  academicYear: string;
  classSection: string;
  sem1Percentage: number;
  sem2Percentage: number;
  finalPercentage: number;
  rank: number;
  subjects: SubjectMark[];
  grade: string;
  teacherRemarks: string;
}

interface StudentReport {
  student: Student;
  history: YearlyResult[];
}

// Sample Data with emojis
const sampleStudents: Student[] = [
  {
    admissionNo: "2024001",
    name: "Aarav Sharma",
    photo: "/api/placeholder/40/40",
    class: "9",
    section: "A",
    dateOfAdmission: "2021-04-15",
    currentPercentage: 85,
    rank: 7,
    emoji: "👨‍🎓"
  },
  {
    admissionNo: "2024002",
    name: "Priya Singh",
    photo: "/api/placeholder/40/40",
    class: "9",
    section: "A",
    dateOfAdmission: "2021-04-15",
    currentPercentage: 92,
    rank: 2,
    emoji: "👩‍🎓"
  },
  {
    admissionNo: "2024003",
    name: "Rohit Kumar",
    photo: "/api/placeholder/40/40",
    class: "9",
    section: "A",
    dateOfAdmission: "2021-04-15",
    currentPercentage: 78,
    rank: 15,
    emoji: "👨‍🎓"
  }
];

const sampleSubjects: SubjectMark[] = [
  { subject: "English", totalMarks: 100, sem1: 78, sem2: 82, finalMarks: 160, finalPercentage: 80, emoji: "📚" },
  { subject: "Mathematics", totalMarks: 100, sem1: 85, sem2: 90, finalMarks: 175, finalPercentage: 87.5, emoji: "🔢" },
  { subject: "Science", totalMarks: 100, sem1: 80, sem2: 84, finalMarks: 164, finalPercentage: 82, emoji: "🔬" },
  { subject: "Social Science", totalMarks: 100, sem1: 83, sem2: 87, finalMarks: 170, finalPercentage: 85, emoji: "🌍" },
  { subject: "Computer Science", totalMarks: 100, sem1: 90, sem2: 94, finalMarks: 184, finalPercentage: 92, emoji: "💻" }
];

const sampleHistory: YearlyResult[] = [
  {
    academicYear: "2021-22",
    classSection: "6 A",
    sem1Percentage: 78,
    sem2Percentage: 81,
    finalPercentage: 80,
    rank: 12,
    subjects: sampleSubjects,
    grade: "A",
    teacherRemarks: "Good performance with room for improvement in English"
  },
  {
    academicYear: "2022-23",
    classSection: "7 A",
    sem1Percentage: 82,
    sem2Percentage: 85,
    finalPercentage: 84,
    rank: 9,
    subjects: sampleSubjects,
    grade: "A",
    teacherRemarks: "Consistent improvement shown throughout the year"
  },
  {
    academicYear: "2023-24",
    classSection: "8 A",
    sem1Percentage: 88,
    sem2Percentage: 90,
    finalPercentage: 89,
    rank: 4,
    subjects: sampleSubjects,
    grade: "A+",
    teacherRemarks: "Excellent performance in all subjects"
  },
  {
    academicYear: "2024-25",
    classSection: "9 A",
    sem1Percentage: 83,
    sem2Percentage: 86,
    finalPercentage: 85,
    rank: 7,
    subjects: sampleSubjects,
    grade: "A",
    teacherRemarks: "Good overall performance with strong analytical skills"
  }
];

const MarksheetManagementSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'student-report' | 'detailed-report'>('main');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchAdmissionNo, setSearchAdmissionNo] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentReport | null>(null);
  const [selectedYearForDetail, setSelectedYearForDetail] = useState<YearlyResult | null>(null);
  const [classResults, setClassResults] = useState<Student[]>([]);

  const classes = Array.from({length: 12}, (_, i) => (i + 1).toString());
  const sections = ['A', 'B', 'C', 'D'];

  const handleClassSectionFilter = () => {
    if (selectedClass && selectedSection) {
      // Filter students by class and section
      const filtered = sampleStudents.filter(
        student => student.class === selectedClass && student.section === selectedSection
      );
      setClassResults(filtered);
    }
  };

  const handleSearchByAdmission = () => {
    if (searchAdmissionNo) {
      // Find student by admission number
      const student = sampleStudents.find(s => s.admissionNo === searchAdmissionNo);
      if (student) {
        const studentReport: StudentReport = {
          student,
          history: sampleHistory
        };
        setSelectedStudent(studentReport);
        setCurrentView('student-report');
      } else {
        alert('Student not found! 😔');
      }
    }
  };

  const handleViewDetailedReport = (yearResult: YearlyResult) => {
    setSelectedYearForDetail(yearResult);
    setCurrentView('detailed-report');
  };

  const exportToPDF = () => {
    alert('📄 PDF export functionality would be implemented here');
  };

  const exportToExcel = () => {
    alert('📊 Excel export functionality would be implemented here');
  };

  // Get grade emoji
  const getGradeEmoji = (grade: string) => {
    switch (grade) {
      case 'A+': return '🏆';
      case 'A': return '🥇';
      case 'B+': return '🥈';
      case 'B': return '🥉';
      case 'C+': return '⭐';
      case 'C': return '📈';
      default: return '📊';
    }
  };

  // Get performance emoji
  const getPerformanceEmoji = (percentage: number) => {
    if (percentage >= 90) return '🌟';
    if (percentage >= 80) return '🎯';
    if (percentage >= 70) return '📈';
    if (percentage >= 60) return '📊';
    return '📉';
  };

  const MainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="gradient-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center space-x-4">
              <div className="text-4xl animate-bounce">🎓</div>
              <div>
                <h1 className="text-4xl font-bold text-white animate-fade-in-up flex items-center space-x-3">
                  
                  <span>Marksheet Management System</span>
                  <div className="text-2xl emoji-wave">📚</div>
                </h1>
                <p className="mt-2 text-purple-100 text-lg">Admin Panel - View and manage student results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search by Admission Number */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 card-glow animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800">Search by Admission Number</h2>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter admission number..."
                value={searchAdmissionNo}
                onChange={(e) => setSearchAdmissionNo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchByAdmission()}
              />
            </div>
            <button
              onClick={handleSearchByAdmission}
              className="px-8 py-3 gradient-success text-white rounded-xl hover-scale font-medium flex items-center shadow-lg"
            >
              
              🔍 Search
            </button>
          </div>
        </div>

        {/* Class & Section Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 card-glow animate-slide-in-left">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800">Class & Section Results</h2>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">🏫 Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">📂 Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Section</option>
                {sections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleClassSectionFilter}
                className="px-8 py-3 gradient-warning text-white rounded-xl hover-scale font-medium shadow-lg"
              >
                🎯 Filter
              </button>
            </div>
          </div>

          {/* Class Results Table */}
          {classResults.length > 0 && (
            <div className="overflow-x-auto animate-slide-in-right">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  📊 Results for Class {selectedClass} - Section {selectedSection}
                </h3>
                <button
                  onClick={exportToExcel}
                  className="px-6 py-3 gradient-info text-white rounded-xl hover-scale font-medium flex items-center shadow-lg"
                >
                 
                  📥 Export Excel
                </button>
              </div>
              <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg">
                <table className="min-w-full">
                  <thead className="gradient-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">👤 Photo</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">🎓 Admission No.</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">👨‍🎓 Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">📊 Percentage</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">🏆 Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">🔍 Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {classResults.map((student, index) => (
                      <tr key={student.admissionNo} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl shadow-lg">
                            {student.emoji}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                          {student.admissionNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${
                            student.currentPercentage >= 90 ? 'bg-green-100 text-green-800' :
                            student.currentPercentage >= 80 ? 'bg-blue-100 text-blue-800' :
                            student.currentPercentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            <span>{getPerformanceEmoji(student.currentPercentage)}</span>
                            <span>{student.currentPercentage}%</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          🏆 #{student.rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => {
                              const studentReport: StudentReport = {
                                student,
                                history: sampleHistory
                              };
                              setSelectedStudent(studentReport);
                              setCurrentView('student-report');
                            }}
                            className="px-4 py-2 gradient-primary text-white rounded-lg hover-scale flex items-center space-x-2 shadow-md"
                          >
                            
                            <span>👁️ Info</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const StudentReportView = () => {
    if (!selectedStudent) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="gradient-primary shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('main')}
                  className="text-white hover:text-purple-200 transition-colors duration-300"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">📋</div>
                  <h1 className="text-3xl font-bold text-white">Student Academic Report</h1>
                </div>
              </div>
              <button
                onClick={exportToPDF}
                className="px-6 py-3 gradient-secondary text-white rounded-xl hover-scale font-medium flex items-center shadow-lg"
              >
                <Download size={16} />
                📄 Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Student Profile */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 card-glow animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">👨‍🎓</div>
              <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
            </div>
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl shadow-lg">
                {selectedStudent.student.emoji}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-500">🎓 Admission Number</p>
                  <p className="text-lg font-bold text-purple-600">{selectedStudent.student.admissionNo}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-500">👤 Name</p>
                  <p className="text-lg font-bold text-gray-900">{selectedStudent.student.name}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-500">🏫 Current Class & Section</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedStudent.student.class} {selectedStudent.student.section}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-500">📅 Date of Admission</p>
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar size={16} />
                    {selectedStudent.student.dateOfAdmission}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic History */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-glow animate-slide-in-left">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">📊</div>
              <h2 className="text-2xl font-bold text-gray-800">Complete Result History</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg">
                <table className="min-w-full">
                  <thead className="gradient-info">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">📅 Academic Year</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">🏫 Class & Section</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">📊 Sem 1 %</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">📊 Sem 2 %</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">🎯 Final %</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">🏆 Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">🔍 View Detailed Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedStudent.history.map((yearResult, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                          📅 {yearResult.academicYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          🏫 {yearResult.classSection}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {yearResult.sem1Percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {yearResult.sem2Percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${
                            yearResult.finalPercentage >= 90 ? 'bg-green-100 text-green-800' :
                            yearResult.finalPercentage >= 80 ? 'bg-blue-100 text-blue-800' :
                            yearResult.finalPercentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            <span>{getPerformanceEmoji(yearResult.finalPercentage)}</span>
                            <span>{yearResult.finalPercentage}%</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          🏆 #{yearResult.rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleViewDetailedReport(yearResult)}
                            className="px-4 py-2 gradient-primary text-white rounded-lg hover-scale flex items-center space-x-2 shadow-md"
                          >
                            
                            <span>🔍 View</span>
                          </button>
                        </td>
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

  const DetailedReportView = () => {
    if (!selectedYearForDetail) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="gradient-primary shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('student-report')}
                  className="text-white hover:text-purple-200 transition-colors duration-300"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">📋</div>
                  <h1 className="text-3xl font-bold text-white">
                    Detailed Report - {selectedYearForDetail.academicYear}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Subject-wise Marks */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 card-glow animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">📚</div>
              <h2 className="text-2xl font-bold text-gray-800">Subject-wise Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg">
                <table className="min-w-full">
                  <thead className="gradient-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">📚 Subject</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">📊 Total Marks</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">📈 Sem 1</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">📈 Sem 2</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">🎯 Final Marks</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">📊 Final Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedYearForDetail.subjects.map((subject, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{subject.emoji}</span>
                            <span>{subject.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subject.totalMarks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subject.sem1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subject.sem2}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {subject.finalMarks}/200
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${
                            subject.finalPercentage >= 90 ? 'bg-green-100 text-green-800' :
                            subject.finalPercentage >= 80 ? 'bg-blue-100 text-blue-800' :
                            subject.finalPercentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            <span>{getPerformanceEmoji(subject.finalPercentage)}</span>
                            <span>{subject.finalPercentage}%</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-glow animate-slide-in-right">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">📊</div>
              <h2 className="text-2xl font-bold text-gray-800">Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md hover-lift">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm font-medium text-blue-600">Yearly Percentage</p>
                <p className="text-3xl font-bold text-blue-900">{selectedYearForDetail.finalPercentage}%</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md hover-lift">
                <div className="text-4xl mb-2">{getGradeEmoji(selectedYearForDetail.grade)}</div>
                <p className="text-sm font-medium text-green-600">Grade</p>
                <p className="text-3xl font-bold text-green-900">{selectedYearForDetail.grade}</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-md hover-lift">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-sm font-medium text-purple-600">Class Rank</p>
                <p className="text-3xl font-bold text-purple-900">#{selectedYearForDetail.rank}</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-md hover-lift">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-sm font-medium text-orange-600">Academic Year</p>
                <p className="text-xl font-bold text-orange-900">{selectedYearForDetail.academicYear}</p>
              </div>
            </div>
            
            {/* Teacher Remarks */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl border-2 border-purple-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">💬</div>
                <h3 className="text-lg font-bold text-gray-900">Teacher Remarks</h3>
              </div>
              <p className="text-gray-700 italic text-lg">"{selectedYearForDetail.teacherRemarks}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  switch (currentView) {
    case 'student-report':
      return <StudentReportView />;
    case 'detailed-report':
      return <DetailedReportView />;
    default:
      return <MainView />;
  }
};

export default MarksheetManagementSystem;