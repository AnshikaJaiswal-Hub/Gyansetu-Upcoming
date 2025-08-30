import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Eye, Search, Filter, Users, UserCheck, Clock, MapPin, Info } from 'lucide-react';

// Add custom styles for animations
const customStyles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slideIn 0.5s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

// Types
interface Student {
  name: string;
  class: string;
  parentName: string;
  admissionNumber: string;
}

interface Visitor {
  id: string;
  photo?: string;
  name: string;
  contactNumber: string;
  visitorType: 'Parent' | 'Outsider';
  admissionNumber?: string;
  studentDetails?: Student;
  reasonForVisit: string;
  dateTime: string;
}

// Mock API function to simulate student lookup
const fetchStudentDetails = async (admissionNumber: string): Promise<Student | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock student data
  const mockStudents: Record<string, Student> = {
    'STU001': {
      name: 'Arjun Sharma',
      class: '10-A',
      parentName: 'Rajesh Sharma',
      admissionNumber: 'STU001'
    },
    'STU002': {
      name: 'Priya Patel',
      class: '8-B',
      parentName: 'Vikram Patel',
      admissionNumber: 'STU002'
    },
    'STU003': {
      name: 'Rahul Kumar',
      class: '12-C',
      parentName: 'Suresh Kumar',
      admissionNumber: 'STU003'
    }
  };
  
  return mockStudents[admissionNumber] || null;
};

// Form Component
const VisitorForm = ({ onSubmit }: { onSubmit: (visitor: Omit<Visitor, 'id' | 'dateTime'>) => void }) => {
  const [formData, setFormData] = useState({
    photo: '',
    name: '',
    contactNumber: '',
    visitorType: '' as 'Parent' | 'Outsider' | '',
    admissionNumber: '',
    reasonForVisit: ''
  });
  
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Student lookup
  const lookupStudent = useCallback(async (admissionNumber: string) => {
    if (!admissionNumber.trim()) {
      setStudentDetails(null);
      setStudentError('');
      return;
    }

    setStudentLoading(true);
    setStudentError('');
    
    try {
      const student = await fetchStudentDetails(admissionNumber);
      if (student) {
        setStudentDetails(student);
      } else {
        setStudentError('No student found with this Admission Number');
        setStudentDetails(null);
      }
    } catch (error) {
      setStudentError('Error fetching student details');
      setStudentDetails(null);
    } finally {
      setStudentLoading(false);
    }
  }, []);

  const handleAdmissionNumberChange = (value: string) => {
    setFormData(prev => ({ ...prev, admissionNumber: value }));
    if (value.length >= 3) {
      lookupStudent(value);
    } else {
      setStudentDetails(null);
      setStudentError('');
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.contactNumber.trim() || !/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    
    if (!formData.visitorType) {
      newErrors.visitorType = 'Visitor type is required';
    }
    
    if (formData.visitorType === 'Parent') {
      if (!formData.admissionNumber.trim()) {
        newErrors.admissionNumber = 'Admission number is required for parent visitors';
      } else if (!studentDetails) {
        newErrors.admissionNumber = 'Valid student details must be fetched';
      }
    }
    
    if (!formData.reasonForVisit.trim()) {
      newErrors.reasonForVisit = 'Reason for visit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const visitorData: Omit<Visitor, 'id' | 'dateTime'> = {
      photo: formData.photo,
      name: formData.name,
      contactNumber: formData.contactNumber,
      visitorType: formData.visitorType as 'Parent' | 'Outsider',
      admissionNumber: formData.visitorType === 'Parent' ? formData.admissionNumber : undefined,
      studentDetails: formData.visitorType === 'Parent' ? studentDetails || undefined : undefined,
      reasonForVisit: formData.reasonForVisit
    };
    
    onSubmit(visitorData);
    
    // Reset form
    setFormData({
      photo: '',
      name: '',
      contactNumber: '',
      visitorType: '',
      admissionNumber: '',
      reasonForVisit: ''
    });
    setStudentDetails(null);
    setStudentError('');
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        {/* Form Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <UserCheck className="text-yellow-300" size={32} />
              Visitor Registration
            </h2>
            <p className="text-purple-100">Secure entry management for school premises</p>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Photo Section */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Upload className="text-purple-600" size={20} />
              Visitor Photo
            </label>
            
            {formData.photo ? (
              <div className="relative w-36 h-36 mx-auto">
                <img 
                  src={formData.photo} 
                  alt="Visitor" 
                  className="w-full h-full object-cover rounded-2xl border-4 border-gradient-to-r from-purple-400 to-pink-400 shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-pink-600 shadow-lg transform hover:scale-110 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transform hover:scale-105 transition-all font-medium"
                >
                  <Upload size={18} />
                  Upload Photo
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Visitor Name */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="text-indigo-600" size={20} />
              Visitor Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all text-lg ${
                errors.name 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 focus:border-purple-400'
              }`}
              placeholder="Enter visitor name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                ❌ {errors.name}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📱</span>
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value.replace(/\D/g, '') }))}
              maxLength={10}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all text-lg ${
                errors.contactNumber 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 focus:border-blue-400'
              }`}
              placeholder="Enter 10-digit contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                ❌ {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Visitor Type */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Visitor Type *
            </label>
            <select
              value={formData.visitorType}
              onChange={(e) => {
                setFormData(prev => ({ 
                  ...prev, 
                  visitorType: e.target.value as 'Parent' | 'Outsider',
                  admissionNumber: e.target.value === 'Outsider' ? '' : prev.admissionNumber
                }));
                if (e.target.value === 'Outsider') {
                  setStudentDetails(null);
                  setStudentError('');
                }
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all text-lg ${
                errors.visitorType 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 focus:border-emerald-400'
              }`}
            >
              <option value="">🎯 Select visitor type</option>
              <option value="Parent">👨‍👩‍👧‍👦 Parent</option>
              <option value="Outsider">🌟 Outsider</option>
            </select>
            {errors.visitorType && (
              <p className="text-red-500 text-sm mt-1 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                ❌ {errors.visitorType}
              </p>
            )}
          </div>

          {/* Parent-specific fields */}
          {formData.visitorType === 'Parent' && (
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-inner">
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Student Admission Number *
                </label>
                <input
                  type="text"
                  value={formData.admissionNumber}
                  onChange={(e) => handleAdmissionNumberChange(e.target.value)}
                  onBlur={() => lookupStudent(formData.admissionNumber)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all text-lg ${
                    errors.admissionNumber 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-indigo-300 bg-white focus:border-indigo-500'
                  }`}
                  placeholder="Enter admission number (try STU001, STU002, STU003)"
                />
                {studentLoading && (
                  <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200">
                    <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm font-medium">Fetching student details...</span>
                  </div>
                )}
                {studentError && (
                  <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    ❌ {studentError}
                  </p>
                )}
                {errors.admissionNumber && (
                  <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    ❌ {errors.admissionNumber}
                  </p>
                )}
              </div>

              {/* Student Details (Read-only) */}
              {studentDetails && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg">
                  <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Student Found!
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                      <label className="block text-sm text-green-700 font-medium mb-1">Student Name</label>
                      <p className="font-bold text-gray-800 text-lg">{studentDetails.name}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                      <label className="block text-sm text-green-700 font-medium mb-1">Class</label>
                      <p className="font-bold text-gray-800 text-lg">{studentDetails.class}</p>
                    </div>
                    <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-green-100">
                      <label className="block text-sm text-green-700 font-medium mb-1">Parent Name</label>
                      <p className="font-bold text-gray-800 text-lg">{studentDetails.parentName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reason for Visit */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="text-orange-600" size={20} />
              Reason for Visit *
            </label>
            <textarea
              value={formData.reasonForVisit}
              onChange={(e) => setFormData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all text-lg resize-none ${
                errors.reasonForVisit 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 focus:border-orange-400'
              }`}
              placeholder="Please describe the purpose of your visit..."
            />
            {errors.reasonForVisit && (
              <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                ❌ {errors.reasonForVisit}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🎉 Register Visitor
          </button>
        </div>
      </div>
    </div>
  );
};

// Student Details Modal
const StudentDetailsModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-3xl max-w-md w-full shadow-2xl border-2 border-blue-200 ">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">🎓</span>
          Student Details
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
          <label className="block text-sm text-blue-700 font-medium mb-1">Student Name</label>
          <p className="font-bold text-gray-800 text-lg">{student.name}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
          <label className="block text-sm text-blue-700 font-medium mb-1">Class</label>
          <p className="font-bold text-gray-800 text-lg">{student.class}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
          <label className="block text-sm text-blue-700 font-medium mb-1">Parent Name</label>
          <p className="font-bold text-gray-800 text-lg">{student.parentName}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
          <label className="block text-sm text-blue-700 font-medium mb-1">Admission Number</label>
          <p className="font-bold text-gray-800 text-lg">{student.admissionNumber}</p>
        </div>
      </div>
    </div>
  </div>
);

// Visitor Details Modal for Mobile
const VisitorDetailsModal = ({ visitor, onClose }: { visitor: Visitor; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-3 rounded-3xl max-w-md w-full shadow-2xl border-2 border-purple-200 max-h-[80vh] overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">👤</span>
          Visitor Details
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 bg-white rounded-full p-1.5 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Photo */}
        <div className="flex justify-center">
          {visitor.photo ? (
            <img 
              src={visitor.photo} 
              alt="Visitor" 
              className="w-16 h-16 object-cover rounded-full border-3 border-purple-300 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👤</span>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-purple-100">
          <h4 className="font-bold text-gray-800 text-sm mb-2">Basic Information</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-purple-700 font-medium">Name</label>
              <p className="font-bold text-gray-800 text-xs">{visitor.name}</p>
            </div>
            <div>
              <label className="block text-xs text-purple-700 font-medium">Contact</label>
              <p className="font-bold text-gray-800 text-xs">{visitor.contactNumber}</p>
            </div>
            <div>
              <label className="block text-xs text-purple-700 font-medium">Type</label>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                visitor.visitorType === 'Parent' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              }`}>
                {visitor.visitorType}
              </span>
            </div>
            <div>
              <label className="block text-xs text-purple-700 font-medium">Date & Time</label>
              <p className="font-bold text-gray-800 text-xs">{new Date(visitor.dateTime).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Student Details (if Parent) */}
        {visitor.visitorType === 'Parent' && visitor.studentDetails && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-xl border-2 border-green-200">
            <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <span className="text-lg">🎓</span>
              Student Information
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-green-700 font-medium">Student Name</label>
                <p className="font-bold text-gray-800 text-xs">{visitor.studentDetails.name}</p>
              </div>
              <div>
                <label className="block text-xs text-green-700 font-medium">Class</label>
                <p className="font-bold text-gray-800 text-xs">{visitor.studentDetails.class}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-green-700 font-medium">Admission Number</label>
                <p className="font-bold text-gray-800 text-xs">{visitor.admissionNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reason for Visit */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-2 rounded-xl border-2 border-yellow-200">
          <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <span className="text-lg">📝</span>
            Reason for Visit
          </h4>
          <p className="text-gray-800 leading-relaxed text-xs">{visitor.reasonForVisit}</p>
        </div>
      </div>
    </div>
  </div>
);

// Visitor Records Table
const VisitorRecords = ({ visitors }: { visitors: Visitor[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Parent' | 'Outsider'>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.contactNumber.includes(searchTerm) ||
                         visitor.reasonForVisit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (visitor.studentDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'All' || visitor.visitorType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-3xl shadow-2xl border border-cyan-200 overflow-hidden">
      {/* Records Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="text-4xl">📋</span>
            Visitor Records
          </h2>
          <p className="text-cyan-100">Track and manage all visitor entries</p>
        </div>
      </div>
      
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Visitors</p>
                <p className="text-3xl font-bold">{visitors.length}</p>
              </div>
              <Users className="text-purple-200" size={32} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Parent Visitors</p>
                <p className="text-3xl font-bold">{visitors.filter(v => v.visitorType === 'Parent').length}</p>
              </div>
              <span className="text-4xl">👨‍👩‍👧‍👦</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Other Visitors</p>
                <p className="text-3xl font-bold">{visitors.filter(v => v.visitorType === 'Outsider').length}</p>
              </div>
              <span className="text-4xl">🌟</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-purple-400" size={20} />
            <input
              type="text"
              placeholder="🔍 Search visitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 text-lg"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-4 text-emerald-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'All' | 'Parent' | 'Outsider')}
              className="pl-12 pr-8 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 text-lg"
            >
              <option value="All">🌈 All Types</option>
              <option value="Parent">👨‍👩‍👧‍👦 Parent</option>
              <option value="Outsider">🌟 Outsider</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white">
                  <th className="px-4 py-4 text-left text-sm font-bold w-20">Photo</th>
                  <th className="px-4 py-4 text-left text-sm font-bold w-32">Name</th>
                  <th className="px-4 py-4 text-left text-sm font-bold w-28">Contact</th>
                  <th className="px-4 py-4 text-left text-sm font-bold w-24">Type</th>
                  <th className="px-4 py-4 text-left text-sm font-bold w-28">Admission</th>
                  <th className="px-4 py-4 text-left text-sm font-bold w-32">Student</th>
                  <th className="px-4 py-4 text-left text-sm font-bold w-48">Reason</th>
                  <th className="px-4 py-4 text-left text-sm font-bold w-40">Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-6xl">🔍</span>
                        <p className="text-gray-500 text-xl">No visitors found</p>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map((visitor, index) => (
                    <tr key={visitor.id} className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}>
                      <td className="px-4 py-6">
                        {visitor.photo ? (
                          <img 
                            src={visitor.photo} 
                            alt="Visitor" 
                            className="w-12 h-12 object-cover rounded-full border-3 border-purple-300 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg">👤</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-6 font-bold text-gray-800 text-lg">
                        {visitor.name}
                      </td>
                      <td className="px-4 py-6 text-gray-700 font-medium">
                        {visitor.contactNumber}
                      </td>
                      <td className="px-4 py-6">
                        <span className={`px-3 py-2 rounded-full text-sm font-bold shadow-lg ${
                          visitor.visitorType === 'Parent' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        }`}>
                          {visitor.visitorType === 'Parent' ? 'Parent' : 'Outsider'}
                        </span>
                      </td>
                      <td className="px-4 py-6">
                        {visitor.admissionNumber ? (
                          <button
                            onClick={() => setSelectedStudent(visitor.studentDetails || null)}
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 font-bold bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-all"
                          >
                            {visitor.admissionNumber}
                            <Eye size={16} />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-lg">-</span>
                        )}
                      </td>
                      <td className="px-4 py-6 text-gray-700 font-medium">
                        {visitor.studentDetails?.name || '-'}
                      </td>
                      <td className="px-4 py-6 text-gray-700">
                        <div className="bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200 text-sm leading-relaxed" title={visitor.reasonForVisit}>
                          {visitor.reasonForVisit}
                        </div>
                      </td>
                      <td className="px-4 py-6 text-gray-600 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          <div className="whitespace-nowrap">
                            {new Date(visitor.dateTime).toLocaleDateString()}
                            <br />
                            {new Date(visitor.dateTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredVisitors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <span className="text-6xl">🔍</span>
                <p className="text-gray-500 text-xl">No visitors found</p>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            filteredVisitors.map((visitor, index) => (
              <div key={visitor.id} className={`bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-4 hover:shadow-2xl transition-all duration-200 ${
                index % 2 === 0 ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  {/* Left side - Photo and Name */}
                  <div className="flex items-center gap-4 flex-1">
                    {visitor.photo ? (
                      <img 
                        src={visitor.photo} 
                        alt="Visitor" 
                        className="w-16 h-16 object-cover rounded-full border-3 border-purple-300 shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">👤</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{visitor.name}</h3>
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Clock size={12} className="text-gray-400" />
                      <span>{new Date(visitor.dateTime).toLocaleTimeString()}</span>
                    </div>
                    </div>
                  </div>

                  {/* Right side - Type, Time, and Info button */}
                  <div className="flex flex-col items-end gap-2">
                  <button
                      onClick={() => setSelectedVisitor(visitor)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:from-purple-600 hover:to-pink-600 shadow-lg transform hover:scale-110 transition-all"
                    >
                      <Info size={16} />
                    </button>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      visitor.visitorType === 'Parent' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    }`}>
                      {visitor.visitorType === 'Parent' ? 'Parent' : 'Outsider'}
                    </span>
                    
                    
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}

        {/* Visitor Details Modal for Mobile */}
        {selectedVisitor && (
          <VisitorDetailsModal
            visitor={selectedVisitor}
            onClose={() => setSelectedVisitor(null)}
          />
        )}
      </div>
    </div>
  );
};

// Main App Component
const VisitorManagementSystem = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'records'>('register');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([
    // Mock data for demonstration
    {
      id: '1',
      name: 'Rajesh Sharma',
      contactNumber: '9876543210',
      visitorType: 'Parent',
      admissionNumber: 'STU001',
      studentDetails: {
        name: 'Arjun Sharma',
        class: '10-A',
        parentName: 'Rajesh Sharma',
        admissionNumber: 'STU001'
      },
      reasonForVisit: 'Parent-Teacher Meeting for quarterly progress discussion',
      dateTime: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Dr. Anita Gupta',
      contactNumber: '8765432109',
      visitorType: 'Outsider',
      reasonForVisit: 'Health checkup and vaccination drive for students',
      dateTime: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      name: 'Vikram Patel',
      contactNumber: '7654321098',
      visitorType: 'Parent',
      admissionNumber: 'STU002',
      studentDetails: {
        name: 'Priya Patel',
        class: '8-B',
        parentName: 'Vikram Patel',
        admissionNumber: 'STU002'
      },
      reasonForVisit: 'Collecting academic certificates and report cards',
      dateTime: new Date(Date.now() - 7200000).toISOString()
    }
  ]);

  const handleVisitorSubmit = (visitorData: Omit<Visitor, 'id' | 'dateTime'>) => {
    const newVisitor: Visitor = {
      ...visitorData,
      id: Date.now().toString(),
      dateTime: new Date().toISOString()
    };
    
    setVisitors(prev => [newVisitor, ...prev]);
    setActiveTab('records');
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const todayVisitors = visitors.filter(v => 
    new Date(v.dateTime).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl border-2 border-green-300 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <span className="text-2xl">🎉</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Success!</h3>
                <p className="text-green-100">Visitor registered successfully!</p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-blue-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-cyan-300/20 rounded-full animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-2xl border-b-4 border-purple-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-5xl hidden sm:inline">🏫</span>
                Visitor Management System
              </h1>
              <p className="text-purple-200 text-lg">Secure • Smart • Simple</p>
            </div>
            
            {/* Stats Badge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Clock className="text-yellow-300" size={20} />
                <span className="font-bold text-lg">{todayVisitors}</span>
                <span className="text-purple-200">visitors today</span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <button
                onClick={() => setActiveTab('register')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg transform scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ➕ Register Visitor
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'records'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg transform scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                📋 Records ({visitors.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'register' ? (
          <VisitorForm onSubmit={handleVisitorSubmit} />
        ) : (
          <VisitorRecords visitors={visitors} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300 flex items-center justify-center gap-2">
            <span className="text-2xl">🔒</span>
            Secure Visitor Management • Built with Gyansetu AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VisitorManagementSystem;