import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  Plus, 
  Edit, 
  X, 
  Play, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  User,
  Star,
  TrendingUp,
  BarChart3,
  Sparkles,
  Heart,
  Zap,
  Target,
  Award,
  BookMarked,
  GraduationCap,
  Lightbulb,
  Smile
} from 'lucide-react';

// Enhanced Types
interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  attendance: 'present' | 'absent' | 'late' | 'not-marked';
  joinedAt?: string;
  leftAt?: string;
}

interface Class {
  id: string;
  subject: string;
  topic: string;
  classSection: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  platform: 'zoom' | 'google-meet' | 'teams' | 'other';
  notes?: string;
  status: 'ongoing' | 'upcoming' | 'cancelled' | 'completed';
  cancelReason?: string;
  studentsCount?: number;
  students?: Student[];
  attendanceSummary?: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
  teacherId: string;
  teacherName: string;
  recordingLink?: string;
  materials?: string[];
}

interface Notification {
  id: string;
  type: 'class-scheduled' | 'class-rescheduled' | 'class-cancelled' | 'reminder' | 'attendance';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  classId?: string;
}

// Subject emojis mapping
const subjectEmojis: { [key: string]: string } = {
  'Mathematics': '📐',
  'Physics': '⚡',
  'Chemistry': '🧪',
  'Biology': '🧬',
  'English': '📚',
  'History': '🏛️',
  'Geography': '🌍',
  'Computer Science': '💻',
  'Art': '🎨',
  'Music': '🎵',
  'Physical Education': '⚽',
  'Economics': '💰',
  'Psychology': '🧠',
  'Literature': '📖',
  'Philosophy': '🤔',
  'Sociology': '👥',
  'Political Science': '🗳️',
  'Environmental Science': '🌱',
  'Astronomy': '🌌',
  'Statistics': '📊'
};

// Platform emojis mapping
const platformEmojis: { [key: string]: string } = {
  'zoom': '📹',
  'google-meet': '🎥',
  'teams': '💼',
  'other': '🔗'
};

// Status emojis mapping
const statusEmojis: { [key: string]: string } = {
  'ongoing': '🟢',
  'upcoming': '🔵',
  'cancelled': '🔴',
  'completed': '✅'
};
  'Music': '🎵',
  'Physical Education': '⚽',
  'Economics': '💰',
  'Psychology': '🧠',
  'Literature': '📖',
  'Philosophy': '🤔',
  'Sociology': '👥',
  'Political Science': '🗳️',
  'Environmental Science': '🌱',
  'Astronomy': '🌌',
  'Statistics': '📊'
};

// Platform emojis mapping
const platformEmojis: { [key: string]: string } = {
  'zoom': '📹',
  'google-meet': '🎥',
  'teams': '💼',
  'other': '🔗'
};

// Status emojis mapping
const statusEmojis: { [key: string]: string } = {
  'ongoing': '🟢',
  'upcoming': '🔵',
  'cancelled': '🔴',
  'completed': '✅'
};

// Enhanced sample data
const sampleStudents: Student[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@school.com', rollNumber: '10A001', attendance: 'present', joinedAt: '10:05' },
  { id: '2', name: 'Priya Patel', email: 'priya@school.com', rollNumber: '10A002', attendance: 'present', joinedAt: '10:02' },
  { id: '3', name: 'Amit Kumar', email: 'amit@school.com', rollNumber: '10A003', attendance: 'late', joinedAt: '10:15' },
  { id: '4', name: 'Neha Singh', email: 'neha@school.com', rollNumber: '10A004', attendance: 'absent' },
  { id: '5', name: 'Vikram Mehta', email: 'vikram@school.com', rollNumber: '10A005', attendance: 'present', joinedAt: '10:01' },
];

const sampleClasses: Class[] = [
  {
    id: '1',
    subject: 'Mathematics',
    topic: 'Algebra Basics',
    classSection: '10A',
    date: '2025-01-15',
    time: '10:00',
    duration: 60,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    platform: 'google-meet',
    notes: 'Bring calculator and notebook. We will cover quadratic equations.',
    status: 'ongoing',
    studentsCount: 28,
    students: sampleStudents,
    attendanceSummary: { present: 4, absent: 1, late: 1, total: 6 },
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    teacherId: 'T001',
    teacherName: 'Dr. Sarah Johnson',
    materials: ['algebra_notes.pdf', 'practice_questions.docx']
  },
  {
    id: '2',
    subject: 'Physics',
    topic: 'Motion and Forces',
    classSection: '9B',
    date: '2025-01-15',
    time: '14:00',
    duration: 45,
    meetingLink: 'https://zoom.us/j/123456789',
    platform: 'zoom',
    status: 'upcoming',
    studentsCount: 25,
    createdAt: '2025-01-12T14:30:00Z',
    updatedAt: '2025-01-12T14:30:00Z',
    teacherId: 'T001',
    teacherName: 'Dr. Sarah Johnson'
  },
  {
    id: '3',
    subject: 'English',
    topic: 'Poetry Analysis',
    classSection: '8A',
    date: '2025-01-14',
    time: '11:30',
    duration: 50,
    meetingLink: 'https://meet.google.com/xyz-mnop-qrs',
    platform: 'google-meet',
    status: 'cancelled',
    cancelReason: 'Teacher unavailable due to emergency',
    studentsCount: 30,
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-14T08:00:00Z',
    teacherId: 'T001',
    teacherName: 'Dr. Sarah Johnson'
  },
  {
    id: '4',
    subject: 'Chemistry',
    topic: 'Organic Compounds',
    classSection: '11A',
    date: '2025-01-13',
    time: '09:00',
    duration: 60,
    meetingLink: 'https://zoom.us/j/987654321',
    platform: 'zoom',
    status: 'completed',
    studentsCount: 22,
    attendanceSummary: { present: 20, absent: 2, late: 0, total: 22 },
    createdAt: '2025-01-05T11:00:00Z',
    updatedAt: '2025-01-13T10:00:00Z',
    teacherId: 'T001',
    teacherName: 'Dr. Sarah Johnson',
    recordingLink: 'https://drive.google.com/recording/chem-organic',
    materials: ['organic_compounds_notes.pdf']
  }
];

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Class Reminder',
    message: 'Physics class starts in 15 minutes',
    timestamp: '2025-01-15T13:45:00Z',
    read: false,
    classId: '2'
  },
  {
    id: '2',
    type: 'class-cancelled',
    title: 'Class Cancelled',
    message: 'English class has been cancelled',
    timestamp: '2025-01-14T08:00:00Z',
    read: true,
    classId: '3'
  },
  {
    id: '3',
    type: 'attendance',
    title: 'Attendance Summary',
    message: 'Chemistry class attendance: 20/22 students present',
    timestamp: '2025-01-13T10:00:00Z',
    read: false,
    classId: '4'
  }
];

const TeacherDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [classes, setClasses] = useState<Class[]>(sampleClasses);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [showCancelClassModal, setShowCancelClassModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [cancellingClass, setCancellingClass] = useState<Class | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // New class form state
  const [newClass, setNewClass] = useState({
    subject: '',
    topic: '',
    classSection: '',
    date: '',
    time: '',
    duration: 60,
    meetingLink: '',
    platform: 'google-meet' as 'zoom' | 'google-meet' | 'teams' | 'other',
    notes: ''
  });

  // Cancel class form state
  const [cancelReason, setCancelReason] = useState('');

  // Filter and search classes
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.classSection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || classItem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Filter classes by status
  const ongoingClasses = filteredClasses.filter(c => c.status === 'ongoing');
  const upcomingClasses = filteredClasses.filter(c => c.status === 'upcoming');
  const cancelledClasses = filteredClasses.filter(c => c.status === 'cancelled');
  const completedClasses = filteredClasses.filter(c => c.status === 'completed');

  // Notification functions
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const sendStudentNotification = useCallback((classItem: Class, type: string, message: string) => {
    // In a real app, this would send notifications to students
    console.log(`Sending ${type} notification to students of ${classItem.classSection}: ${message}`);
    addNotification({
      type: type as any,
      title: `Notification Sent`,
      message: `Students of ${classItem.classSection} notified about ${type}`,
      read: false,
      classId: classItem.id,
      timestamp: new Date().toISOString()
    });
  }, [addNotification]);

  // Class management functions
  const handleCreateClass = () => {
    const classData: Class = {
      id: Date.now().toString(),
      ...newClass,
      status: 'upcoming',
      studentsCount: Math.floor(Math.random() * 30) + 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teacherId: 'T001',
      teacherName: 'Dr. Sarah Johnson'
    };
    
    setClasses(prev => [classData, ...prev]);
    sendStudentNotification(classData, 'class-scheduled', `New ${classData.subject} class scheduled`);
    
    setNewClass({
      subject: '',
      topic: '',
      classSection: '',
      date: '',
      time: '',
      duration: 60,
      meetingLink: '',
      platform: 'google-meet',
      notes: ''
    });
    setShowNewClassModal(false);
  };

  const handleEditClass = () => {
    if (!editingClass) return;
    
    const updatedClass = { ...editingClass, ...newClass, updatedAt: new Date().toISOString() };
    setClasses(prev => prev.map(c => c.id === editingClass.id ? updatedClass : c));
    sendStudentNotification(updatedClass, 'class-rescheduled', `Class ${updatedClass.subject} has been rescheduled`);
    
    setEditingClass(null);
    setShowEditClassModal(false);
  };

  const handleCancelClass = () => {
    if (!cancellingClass) return;
    
    const updatedClass = { 
      ...cancellingClass, 
      status: 'cancelled' as const, 
      cancelReason,
      updatedAt: new Date().toISOString()
    };
    setClasses(prev => prev.map(c => c.id === cancellingClass.id ? updatedClass : c));
    sendStudentNotification(updatedClass, 'class-cancelled', `Class ${updatedClass.subject} has been cancelled`);
    
    setCancellingClass(null);
    setCancelReason('');
    setShowCancelClassModal(false);
  };

  const handleStartClass = (classItem: Class) => {
    const updatedClass = { ...classItem, status: 'ongoing' as const, updatedAt: new Date().toISOString() };
    setClasses(prev => prev.map(c => c.id === classItem.id ? updatedClass : c));
    addNotification({
      type: 'class-scheduled',
      title: 'Class Started',
      message: `${classItem.subject} class is now live`,
      read: false,
      classId: classItem.id,
      timestamp: new Date().toISOString()
    });
  };

  const handleEndClass = (classItem: Class) => {
    const updatedClass = { ...classItem, status: 'completed' as const, updatedAt: new Date().toISOString() };
    setClasses(prev => prev.map(c => c.id === classItem.id ? updatedClass : c));
    addNotification({
      type: 'attendance',
      title: 'Class Ended',
      message: `${classItem.subject} class has ended`,
      read: false,
      classId: classItem.id,
      timestamp: new Date().toISOString()
    });
  };

  const handleAttendanceChange = (classId: string, studentId: string, attendance: Student['attendance']) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId && c.students) {
        const updatedStudents = c.students.map(s => 
          s.id === studentId ? { ...s, attendance } : s
        );
        const present = updatedStudents.filter(s => s.attendance === 'present').length;
        const absent = updatedStudents.filter(s => s.attendance === 'absent').length;
        const late = updatedStudents.filter(s => s.attendance === 'late').length;
        
        return {
          ...c,
          students: updatedStudents,
          attendanceSummary: { present, absent, late, total: updatedStudents.length }
        };
      }
      return c;
    }));
  };

  // Auto-update ongoing classes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClasses(prev => prev.map(c => {
        if (c.status === 'upcoming') {
          const classTime = new Date(`${c.date}T${c.time}`);
          const timeDiff = classTime.getTime() - now.getTime();
          
          // Start class 5 minutes before scheduled time
          if (timeDiff <= 5 * 60 * 1000 && timeDiff > 0) {
            addNotification({
              type: 'reminder',
              title: 'Class Starting Soon',
              message: `${c.subject} class starts in ${Math.floor(timeDiff / 60000)} minutes`,
              read: false,
              classId: c.id,
              timestamp: new Date().toISOString()
            });
          }
          
          // Auto-start class at scheduled time
          if (timeDiff <= 0) {
            return { ...c, status: 'ongoing' as const, updatedAt: new Date().toISOString() };
          }
        }
        
        if (c.status === 'ongoing') {
          const classTime = new Date(`${c.date}T${c.time}`);
          const endTime = new Date(classTime.getTime() + c.duration * 60 * 1000);
          
          // Auto-end class after duration
          if (now.getTime() >= endTime.getTime()) {
            return { ...c, status: 'completed' as const, updatedAt: new Date().toISOString() };
          }
        }
        
        return c;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [addNotification]);

  // Enhanced ClassCard component with colors and emojis
  const ClassCard = ({ classItem, showActions = true }: { classItem: Class; showActions?: boolean }) => {
    const subjectEmoji = subjectEmojis[classItem.subject] || '📚';
    const platformEmoji = platformEmojis[classItem.platform] || '🔗';
    const statusEmoji = statusEmojis[classItem.status] || '❓';
    
    const getStatusColors = (status: string) => {
      switch (status) {
        case 'ongoing':
          return {
            border: 'border-orange-500',
            bg: 'bg-gradient-to-r from-orange-50 to-red-50',
            statusBg: 'bg-gradient-to-r from-orange-500 to-red-500',
            statusText: 'text-white'
          };
        case 'upcoming':
          return {
            border: 'border-blue-500',
            bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
            statusBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
            statusText: 'text-white'
          };
        case 'cancelled':
          return {
            border: 'border-red-500',
            bg: 'bg-gradient-to-r from-red-50 to-pink-50',
            statusBg: 'bg-gradient-to-r from-red-500 to-pink-500',
            statusText: 'text-white'
          };
        case 'completed':
          return {
            border: 'border-green-500',
            bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
            statusBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
            statusText: 'text-white'
          };
        default:
          return {
            border: 'border-gray-300',
            bg: 'bg-white',
            statusBg: 'bg-gray-100',
            statusText: 'text-gray-700'
          };
      }
    };

    const colors = getStatusColors(classItem.status);

    return (
      <div className={`p-6 rounded-xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${colors.bg} ${colors.border}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{subjectEmoji}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                {classItem.subject}
                <span className="text-sm font-normal text-gray-600">• {classItem.topic}</span>
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-lg">👥</span>
                Class {classItem.classSection} • {classItem.studentsCount} students
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.statusBg} ${colors.statusText} flex items-center gap-1`}>
              <span className="text-sm">{statusEmoji}</span>
              {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/80 text-gray-700 flex items-center gap-1">
              <span className="text-sm">{platformEmoji}</span>
              {classItem.platform.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg">
            <span className="text-lg">🕐</span>
            <span className="font-medium">{classItem.date} at {classItem.time} ({classItem.duration} min)</span>
          </div>
          {classItem.notes && (
            <div className="flex items-start gap-2 bg-white/50 p-2 rounded-lg">
              <span className="text-lg">📝</span>
              <p className="text-gray-600 italic">{classItem.notes}</p>
            </div>
          )}
          {classItem.cancelReason && (
            <div className="flex items-start gap-2 bg-red-100 p-2 rounded-lg">
              <span className="text-lg">⚠️</span>
              <p className="text-red-700 italic">Cancelled: {classItem.cancelReason}</p>
            </div>
          )}
          {classItem.attendanceSummary && (
            <div className="flex items-center gap-4 text-xs bg-white/50 p-2 rounded-lg">
              <span className="text-green-600 flex items-center gap-1">
                <span className="text-sm">✅</span> Present: {classItem.attendanceSummary.present}
              </span>
              <span className="text-red-600 flex items-center gap-1">
                <span className="text-sm">❌</span> Absent: {classItem.attendanceSummary.absent}
              </span>
              <span className="text-yellow-600 flex items-center gap-1">
                <span className="text-sm">⏰</span> Late: {classItem.attendanceSummary.late}
              </span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 flex-wrap">
            {classItem.status === 'ongoing' && (
              <>
                <button 
                  onClick={() => window.open(classItem.meetingLink, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Video className="w-4 h-4" />
                  🚀 Join Now
                </button>
                <button 
                  onClick={() => handleEndClass(classItem)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  🛑 End Class
                </button>
                <button 
                  onClick={() => {
                    setSelectedClass(classItem);
                    setShowAttendanceModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Users className="w-4 h-4" />
                  📊 Attendance
                </button>
              </>
            )}
            {classItem.status === 'upcoming' && (
              <>
                <button 
                  onClick={() => {
                    setEditingClass(classItem);
                    setNewClass({
                      subject: classItem.subject,
                      topic: classItem.topic,
                      classSection: classItem.classSection,
                      date: classItem.date,
                      time: classItem.time,
                      duration: classItem.duration,
                      meetingLink: classItem.meetingLink,
                      platform: classItem.platform,
                      notes: classItem.notes || ''
                    });
                    setShowEditClassModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => {
                    setCancellingClass(classItem);
                    setShowCancelClassModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  ❌ Cancel
                </button>
                <button 
                  onClick={() => handleStartClass(classItem)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Play className="w-4 h-4" />
                  🎬 Start Now
                </button>
              </>
            )}
            {classItem.status === 'completed' && (
              <>
                <button 
                  onClick={() => {
                    setSelectedClass(classItem);
                    setShowAttendanceModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  👁️ View Attendance
                </button>
                {classItem.recordingLink && (
                  <button 
                    onClick={() => window.open(classItem.recordingLink, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 text-sm font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <Video className="w-4 h-4" />
                    🎥 Recording
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const WeeklyView = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(today.getDate() - day);
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    const getClassesForDate = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return classes.filter(c => c.date === dateStr);
    };

    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-600 mb-2">
          {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {
            new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }
        </div>
        {weekDays.map((date, index) => {
          const dayClasses = getClassesForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          return (
            <div key={index} className={`border-l-2 pl-3 ${isToday ? 'border-blue-500' : 'border-gray-200'}`}>
              <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              {dayClasses.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {dayClasses.map(classItem => (
                    <div key={classItem.id} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-medium">{classItem.subject}</div>
                      <div className="text-gray-600">{classItem.time} • {classItem.classSection}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 mt-1">No classes</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const MonthlyView = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const getClassesForDay = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return classes.filter(c => c.date === dateStr);
    };

    return (
      <div>
        <div className="text-sm font-medium text-gray-600 mb-3">
          {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 p-1">
              {day}
            </div>
          ))}
          {emptyDays.map(i => (
            <div key={`empty-${i}`} className="p-1"></div>
          ))}
          {days.map(day => {
            const dayClasses = getClassesForDay(day);
            const isToday = day === today.getDate() && month === today.getMonth();
            return (
              <div key={day} className={`p-1 text-center ${isToday ? 'bg-blue-100 rounded' : ''}`}>
                <div className={`${isToday ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  {day}
                </div>
                {dayClasses.length > 0 && (
                  <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };





  const ClassList = ({ classList, title }: { classList: Class[]; title: string }) => {
    const getTitleEmoji = (title: string) => {
      if (title.includes('All')) return '📚';
      if (title.includes('Ongoing')) return '🟢';
      if (title.includes('Upcoming')) return '🔵';
      if (title.includes('Cancelled')) return '🔴';
      if (title.includes('Past') || title.includes('Completed')) return '✅';
      return '📚';
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <span className="text-2xl">{getTitleEmoji(title)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <p className="text-gray-600 text-sm">Manage your {title.toLowerCase()} efficiently</p>
            </div>
          </div>
          {title === 'Upcoming Classes' && (
            <button
              onClick={() => setShowNewClassModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              ✨ Schedule New Class
            </button>
          )}
        </div>
        <div className="space-y-6">
          {classList.length > 0 ? (
            classList.map(classItem => (
              <ClassCard key={classItem.id} classItem={classItem} />
            ))
          ) : (
            <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg font-medium">No {title.toLowerCase()} found</p>
              <p className="text-gray-400 text-sm mt-2">Start by scheduling a new class! 🚀</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CalendarView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const getClassesForDay = (day: number) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return classes.filter(c => c.date === dateStr);
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Calendar View</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-lg">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="p-2 h-24"></div>
            ))}
            {days.map(day => {
              const dayClasses = getClassesForDay(day);
              return (
                <div key={day} className="p-1 h-24 border border-gray-100 rounded">
                  <div className="text-sm font-medium text-gray-700 mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayClasses.slice(0, 2).map(classItem => (
                      <div
                        key={classItem.id}
                        className={`text-xs p-1 rounded text-white ${
                          classItem.status === 'ongoing' ? 'bg-orange-500' :
                          classItem.status === 'upcoming' ? 'bg-blue-500' :
                          classItem.status === 'cancelled' ? 'bg-red-500' :
                          'bg-green-500'
                        }`}
                      >
                        {classItem.subject}
                      </div>
                    ))}
                    {dayClasses.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayClasses.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const NewClassModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Schedule New Class</h3>
          </div>
          <button 
            onClick={() => setShowNewClassModal(false)}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              📚 Subject
            </label>
            <input
              type="text"
              value={newClass.subject}
              onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Mathematics, Physics, English..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              📖 Topic
            </label>
            <input
              type="text"
              value={newClass.topic}
              onChange={(e) => setNewClass({...newClass, topic: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Algebra Basics, Motion and Forces..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              👥 Class/Section
            </label>
            <input
              type="text"
              value={newClass.classSection}
              onChange={(e) => setNewClass({...newClass, classSection: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., 10A, 9B, 11C..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                📅 Date
              </label>
              <input
                type="date"
                value={newClass.date}
                onChange={(e) => setNewClass({...newClass, date: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                🕐 Time
              </label>
              <input
                type="time"
                value={newClass.time}
                onChange={(e) => setNewClass({...newClass, time: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={newClass.duration}
              onChange={(e) => setNewClass({...newClass, duration: parseInt(e.target.value)})}
              className="w-full p-2 border rounded-lg"
              min="15"
              max="180"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Meeting Link</label>
            <input
              type="url"
              value={newClass.meetingLink}
              onChange={(e) => setNewClass({...newClass, meetingLink: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="https://meet.google.com/..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              value={newClass.notes}
              onChange={(e) => setNewClass({...newClass, notes: e.target.value})}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Additional instructions for students"
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setShowNewClassModal(false)}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200 transform hover:scale-105"
          >
            ❌ Cancel
          </button>
          <button
            onClick={handleCreateClass}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ✨ Schedule Class
          </button>
        </div>
      </div>
    </div>
  );

  const EditClassModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Class</h3>
          <button 
            onClick={() => setShowEditClassModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={editingClass?.subject}
              onChange={(e) => setEditingClass(prev => prev ? { ...prev, subject: e.target.value } : null)}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Mathematics"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <input
              type="text"
              value={editingClass?.topic}
              onChange={(e) => setEditingClass(prev => prev ? { ...prev, topic: e.target.value } : null)}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Algebra Basics"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Class/Section</label>
            <input
              type="text"
              value={editingClass?.classSection}
              onChange={(e) => setEditingClass(prev => prev ? { ...prev, classSection: e.target.value } : null)}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., 10A"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={editingClass?.date}
                onChange={(e) => setEditingClass(prev => prev ? { ...prev, date: e.target.value } : null)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                value={editingClass?.time}
                onChange={(e) => setEditingClass(prev => prev ? { ...prev, time: e.target.value } : null)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={editingClass?.duration}
              onChange={(e) => setEditingClass(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
              className="w-full p-2 border rounded-lg"
              min="15"
              max="180"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Meeting Link</label>
            <input
              type="url"
              value={editingClass?.meetingLink}
              onChange={(e) => setEditingClass(prev => prev ? { ...prev, meetingLink: e.target.value } : null)}
              className="w-full p-2 border rounded-lg"
              placeholder="https://meet.google.com/..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              value={editingClass?.notes}
              onChange={(e) => setEditingClass(prev => prev ? { ...prev, notes: e.target.value } : null)}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Additional instructions for students"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowEditClassModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleEditClass}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const CancelClassModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cancel Class</h3>
          <button 
            onClick={() => setShowCancelClassModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to cancel the class for {cancellingClass?.classSection} on {cancellingClass?.date} at {cancellingClass?.time}?
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">Reason for cancellation</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="e.g., Teacher unavailable, technical issue"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowCancelClassModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCancelClass}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const AttendanceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Attendance for {selectedClass?.subject} {selectedClass?.classSection}</h3>
          <button 
            onClick={() => setShowAttendanceModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">
            Total Students: {selectedClass?.attendanceSummary?.total || 0}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAttendanceChange(selectedClass?.id || '', '1', 'present')}
              className={`p-3 rounded-lg border ${
                selectedClass?.students?.find(s => s.id === '1')?.attendance === 'present' 
                  ? 'bg-green-100 border-green-500 text-green-800' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-6 h-6" />
              Rahul Sharma
            </button>
            <button
              onClick={() => handleAttendanceChange(selectedClass?.id || '', '2', 'absent')}
              className={`p-3 rounded-lg border ${
                selectedClass?.students?.find(s => s.id === '2')?.attendance === 'absent' 
                  ? 'bg-red-100 border-red-500 text-red-800' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-6 h-6" />
              Priya Patel
            </button>
            <button
              onClick={() => handleAttendanceChange(selectedClass?.id || '', '3', 'late')}
              className={`p-3 rounded-lg border ${
                selectedClass?.students?.find(s => s.id === '3')?.attendance === 'late' 
                  ? 'bg-yellow-100 border-yellow-500 text-yellow-800' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-6 h-6" />
              Amit Kumar
            </button>
            <button
              onClick={() => handleAttendanceChange(selectedClass?.id || '', '4', 'present')}
              className={`p-3 rounded-lg border ${
                selectedClass?.students?.find(s => s.id === '4')?.attendance === 'present' 
                  ? 'bg-green-100 border-green-500 text-green-800' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-6 h-6" />
              Neha Singh
            </button>
            <button
              onClick={() => handleAttendanceChange(selectedClass?.id || '', '5', 'present')}
              className={`p-3 rounded-lg border ${
                selectedClass?.students?.find(s => s.id === '5')?.attendance === 'present' 
                  ? 'bg-green-100 border-green-500 text-green-800' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-6 h-6" />
              Vikram Mehta
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationList = () => (
    <div className="fixed bottom-4 right-4 w-full max-w-sm z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
          <div className="space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  notification.read ? 'bg-gray-100' : 'bg-blue-50'
                }`}
              >
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleDateString()}</p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  🎓 Teacher Dashboard
                </h1>
                <p className="text-blue-100 text-sm">Manage your online classes with ease ✨</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">📅 Schedule</span>
                </button>
                
                {showCalendarDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Quick Schedule</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCalendarView('week')}
                            className={`px-2 py-1 text-xs rounded ${
                              calendarView === 'week' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Week
                          </button>
                          <button
                            onClick={() => setCalendarView('month')}
                            className={`px-2 py-1 text-xs rounded ${
                              calendarView === 'month' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Month
                          </button>
                        </div>
                      </div>
                      
                      {calendarView === 'week' ? <WeeklyView /> : <MonthlyView />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

            {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-white to-gray-50 shadow-md border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto py-2">
            {[
              { id: 'all', label: '📚 All Classes', icon: BookOpen, emoji: '📚' },
              { id: 'ongoing', label: '🟢 Ongoing', icon: Play, emoji: '🟢' },
              { id: 'upcoming', label: '🔵 Upcoming', icon: Clock, emoji: '🔵' },
              { id: 'cancelled', label: '🔴 Cancelled', icon: X, emoji: '🔴' },
              { id: 'past', label: '✅ Past Classes', icon: CheckCircle, emoji: '✅' },
              { id: 'calendar', label: '📅 Calendar', icon: Calendar, emoji: '📅' },
              { id: 'notifications', label: '🔔 Notifications', icon: Bell, emoji: '🔔' }
            ].map(({ id, label, icon: Icon, emoji }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                  activeTab === id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

              {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
                    {activeTab === 'all' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="🔍 Search classes by subject, topic, or section..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">🎯 Filter:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="all">📚 All Classes</option>
                    <option value="ongoing">🟢 Ongoing</option>
                    <option value="upcoming">🔵 Upcoming</option>
                    <option value="cancelled">🔴 Cancelled</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        {activeTab === 'all' && <ClassList classList={filteredClasses} title="All Classes" />}
        {activeTab === 'ongoing' && <ClassList classList={ongoingClasses} title="Ongoing Classes" />}
        {activeTab === 'upcoming' && <ClassList classList={upcomingClasses} title="Upcoming Classes" />}
        {activeTab === 'cancelled' && <ClassList classList={cancelledClasses} title="Cancelled Classes" />}
        {activeTab === 'past' && <ClassList classList={completedClasses} title="Past Classes" />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Notifications</h2>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications yet.</p>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.read ? 'bg-gray-100' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleDateString()}</p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewClassModal && <NewClassModal />}
      {editingClass && <EditClassModal />}
      {cancellingClass && <CancelClassModal />}
      {showAttendanceModal && selectedClass && <AttendanceModal />}
      
      {/* Close dropdown when clicking outside */}
      {showCalendarDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCalendarDropdown(false)}
        />
      )}
      {showNotifications && <NotificationList />}
    </div>
  );
};

export default TeacherDashboard;