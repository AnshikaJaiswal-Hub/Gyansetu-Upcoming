import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Eye, Search, Filter } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraMode(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please try file upload instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, photo: photoDataUrl }));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraMode(false);
  };

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitor Registration</h2>
      
      <div className="space-y-6">
        {/* Photo Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Visitor Photo</label>
          
          {formData.photo ? (
            <div className="relative w-32 h-32">
              <img 
                src={formData.photo} 
                alt="Visitor" 
                className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Camera size={16} />
                Camera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <Upload size={16} />
                Upload
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

        {/* Camera Modal */}
        {cameraMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <video ref={videoRef} autoPlay className="w-80 h-60 rounded-lg mb-4" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Capture
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Common Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visitor Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter visitor name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value.replace(/\D/g, '') }))}
            maxLength={10}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contactNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 10-digit contact number"
          />
          {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.visitorType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select visitor type</option>
            <option value="Parent">Parent</option>
            <option value="Outsider">Outsider</option>
          </select>
          {errors.visitorType && <p className="text-red-500 text-sm mt-1">{errors.visitorType}</p>}
        </div>

        {/* Parent-specific fields */}
        {formData.visitorType === 'Parent' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admission Number *
              </label>
              <input
                type="text"
                value={formData.admissionNumber}
                onChange={(e) => handleAdmissionNumberChange(e.target.value)}
                onBlur={() => lookupStudent(formData.admissionNumber)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.admissionNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter student admission number (try STU001, STU002, or STU003)"
              />
              {studentLoading && <p className="text-blue-500 text-sm mt-1">Fetching student details...</p>}
              {studentError && <p className="text-red-500 text-sm mt-1">{studentError}</p>}
              {errors.admissionNumber && <p className="text-red-500 text-sm mt-1">{errors.admissionNumber}</p>}
            </div>

            {/* Student Details (Read-only) */}
            {studentDetails && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-800 mb-3">Student Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Student Name</label>
                    <p className="font-medium text-gray-800">{studentDetails.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Class</label>
                    <p className="font-medium text-gray-800">{studentDetails.class}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600">Parent Name</label>
                    <p className="font-medium text-gray-800">{studentDetails.parentName}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reason for Visit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Visit *
          </label>
          <textarea
            value={formData.reasonForVisit}
            onChange={(e) => setFormData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.reasonForVisit ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter reason for visit"
          />
          {errors.reasonForVisit && <p className="text-red-500 text-sm mt-1">{errors.reasonForVisit}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Register Visitor
        </button>
      </div>
    </div>
  );
};

// Student Details Modal
const StudentDetailsModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Student Details</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600">Student Name</label>
          <p className="font-medium text-gray-800">{student.name}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Class</label>
          <p className="font-medium text-gray-800">{student.class}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Parent Name</label>
          <p className="font-medium text-gray-800">{student.parentName}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Admission Number</label>
          <p className="font-medium text-gray-800">{student.admissionNumber}</p>
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

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.contactNumber.includes(searchTerm) ||
                         visitor.reasonForVisit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (visitor.studentDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'All' || visitor.visitorType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitor Records</h2>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'All' | 'Parent' | 'Outsider')}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Parent">Parent</option>
            <option value="Outsider">Outsider</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Photo</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Admission No.</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Student Name</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Reason</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan={8} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No visitors found
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    {visitor.photo ? (
                      <img 
                        src={visitor.photo} 
                        alt="Visitor" 
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Photo</span>
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                    {visitor.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    {visitor.contactNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      visitor.visitorType === 'Parent' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {visitor.visitorType}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {visitor.admissionNumber ? (
                      <button
                        onClick={() => setSelectedStudent(visitor.studentDetails || null)}
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                      >
                        {visitor.admissionNumber}
                        <Eye size={14} />
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    {visitor.studentDetails?.name || '-'}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    <div className="max-w-xs truncate" title={visitor.reasonForVisit}>
                      {visitor.reasonForVisit}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700 text-sm">
                    {new Date(visitor.dateTime).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

// Main App Component
const VisitorManagementSystem = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'records'>('register');
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
      reasonForVisit: 'Parent-Teacher Meeting',
      dateTime: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Dr. Anita Gupta',
      contactNumber: '8765432109',
      visitorType: 'Outsider',
      reasonForVisit: 'Health checkup and vaccination drive',
      dateTime: new Date(Date.now() - 3600000).toISOString()
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
    alert('Visitor registered successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">📘 Visitor Management System</h1>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('register')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Register Visitor
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'records'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Visitor Records ({visitors.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'register' ? (
          <VisitorForm onSubmit={handleVisitorSubmit} />
        ) : (
          <VisitorRecords visitors={visitors} />
        )}
      </main>
    </div>
  );
};

export default VisitorManagementSystem;