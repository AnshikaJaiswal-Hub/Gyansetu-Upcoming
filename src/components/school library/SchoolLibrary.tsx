import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Users, Calendar, AlertTriangle, CheckCircle, Clock, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';

// Types
interface Student {
  admission_number: string;
  name: string;
  class: string;
  class_teacher: string;
}

interface Book {
  book_id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'Available' | 'Issued';
  total_copies: number;
  available_copies: number;
}

interface IssuedBook {
  issue_id: string;
  book_id: string;
  admission_number: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  student_name: string;
  book_title: string;
  book_author: string;
}

// Mock Data
const mockStudents: Student[] = [
  { admission_number: '2024-15', name: 'Ananya Sharma', class: '8B', class_teacher: 'Mr. Gupta' },
  { admission_number: '2024-22', name: 'Rahul Singh', class: '9A', class_teacher: 'Ms. Patel' },
  { admission_number: '2024-08', name: 'Priya Mehta', class: '7C', class_teacher: 'Mr. Kumar' },
  { admission_number: '2024-33', name: 'Arjun Reddy', class: '10B', class_teacher: 'Ms. Sharma' },
];

const mockBooks: Book[] = [
  { book_id: 'B001', title: 'Mathematics Grade 8', author: 'R.D. Sharma', isbn: '978-0123456789', category: 'Mathematics', status: 'Available', total_copies: 5, available_copies: 3 },
  { book_id: 'B002', title: 'Science for Class 9', author: 'NCERT', isbn: '978-0987654321', category: 'Science', status: 'Available', total_copies: 4, available_copies: 1 },
  { book_id: 'B003', title: 'English Literature', author: 'William Shakespeare', isbn: '978-1234567890', category: 'English', status: 'Issued', total_copies: 3, available_copies: 0 },
  { book_id: 'B004', title: 'History of India', author: 'Bipin Chandra', isbn: '978-5432167890', category: 'History', status: 'Available', total_copies: 6, available_copies: 4 },
];

const mockIssuedBooks: IssuedBook[] = [
  {
    issue_id: 'I001',
    book_id: 'B001',
    admission_number: '2024-15',
    issue_date: '2025-08-30',
    due_date: '2025-09-07',
    status: 'Issued',
    student_name: 'Ananya Sharma',
    book_title: 'Mathematics Grade 8',
    book_author: 'R.D. Sharma'
  },
  {
    issue_id: 'I002',
    book_id: 'B003',
    admission_number: '2024-22',
    issue_date: '2025-08-25',
    due_date: '2025-08-31',
    status: 'Overdue',
    student_name: 'Rahul Singh',
    book_title: 'English Literature',
    book_author: 'William Shakespeare'
  },
];

const LibraryManagementSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'issue-book' | 'add-book' | 'manage-books' | 'reports' | 'students'>('dashboard');
  const [students] = useState<Student[]>(mockStudents);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(mockIssuedBooks);
  
  // Form states
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Book form states
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total_copies: 1
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'issued'>('all');
  
  // Student filter states
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState<'all' | 'active' | 'overdue' | 'no-books'>('all');
  
  // Reports search state
  const [reportsSearchTerm, setReportsSearchTerm] = useState('');

  // Auto-fetch student details when admission number changes
  useEffect(() => {
    if (admissionNumber) {
      const student = students.find(s => s.admission_number === admissionNumber);
      setSelectedStudent(student || null);
    } else {
      setSelectedStudent(null);
    }
  }, [admissionNumber, students]);

  // Get dashboard statistics
  const getDashboardStats = () => {
    const totalBooks = books.reduce((sum, book) => sum + book.total_copies, 0);
    const issuedCount = issuedBooks.filter(ib => ib.status === 'Issued' || ib.status === 'Overdue').length;
    const overdueCount = issuedBooks.filter(ib => ib.status === 'Overdue').length;
    const todayIssued = issuedBooks.filter(ib => ib.issue_date === '2025-08-30').length;
    
    // Calculate today's fine collection
    const todayFineCollection = issuedBooks
      .filter(ib => ib.status === 'Overdue')
      .reduce((total, issue) => {
        const dueDate = new Date(issue.due_date);
        const today = new Date('2025-08-30');
        const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return total + (daysOverdue > 0 ? daysOverdue * 10 : 0);
      }, 0);
    
    return {
      totalBooks,
      issuedBooks: issuedCount,
      availableBooks: totalBooks - issuedCount,
      overdueBooks: overdueCount,
      todayIssued,
      todayFineCollection
    };
  };

  // Calculate fine for a specific issue
  const calculateFine = (issue: IssuedBook) => {
    if (issue.status === 'Returned') return 0;
    
    const dueDate = new Date(issue.due_date);
    const today = new Date('2025-08-30'); // Using mock date for demo
    const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysOverdue > 0 ? daysOverdue * 10 : 0;
  };

  const handleIssueBook = () => {
    if (!selectedStudent || !selectedBookId || !dueDate) {
      alert('Please fill all required fields');
      return;
    }

    const book = books.find(b => b.book_id === selectedBookId);
    if (!book || book.available_copies === 0) {
      alert('Book is not available');
      return;
    }

    const newIssue: IssuedBook = {
      issue_id: `I${Date.now()}`,
      book_id: selectedBookId,
      admission_number: selectedStudent.admission_number,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: dueDate,
      status: 'Issued',
      student_name: selectedStudent.name,
      book_title: book.title,
      book_author: book.author
    };

    setIssuedBooks([...issuedBooks, newIssue]);
    
    // Update book availability
    setBooks(books.map(b => 
      b.book_id === selectedBookId 
        ? { ...b, available_copies: b.available_copies - 1, status: b.available_copies === 1 ? 'Issued' : 'Available' }
        : b
    ));

    // Reset form
    setAdmissionNumber('');
    setSelectedBookId('');
    setDueDate('');
    setSelectedStudent(null);
    
    
    setCurrentView('dashboard');
  };

  const handleAddBook = () => {
    if (!bookForm.title || !bookForm.author || !bookForm.isbn) {
      alert('Please fill all required fields');
      return;
    }

    const newBook: Book = {
      book_id: `B${Date.now()}`,
      ...bookForm,
      status: 'Available',
      available_copies: bookForm.total_copies
    };

    setBooks([...books, newBook]);
    setBookForm({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
   
    setCurrentView('manage-books');
  };

  const handleReturnBook = (issueId: string) => {
    const issue = issuedBooks.find(ib => ib.issue_id === issueId);
    if (!issue) return;

    setIssuedBooks(issuedBooks.map(ib => 
      ib.issue_id === issueId 
        ? { ...ib, status: 'Returned', return_date: new Date().toISOString().split('T')[0] }
        : ib
    ));

    setBooks(books.map(b => 
      b.book_id === issue.book_id 
        ? { ...b, available_copies: b.available_copies + 1, status: 'Available' }
        : b
    ));

   
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'available' && book.available_copies > 0) ||
                         (filterStatus === 'issued' && book.available_copies === 0);
    return matchesSearch && matchesFilter;
  });

  // Filter students based on search and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                         student.admission_number.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(studentSearchTerm.toLowerCase());
    
    const studentIssues = issuedBooks.filter(ib => ib.admission_number === student.admission_number && 
                                           (ib.status === 'Issued' || ib.status === 'Overdue'));
    const hasOverdue = issuedBooks.some(ib => ib.admission_number === student.admission_number && ib.status === 'Overdue');
    
    const matchesFilter = studentFilterStatus === 'all' || 
                         (studentFilterStatus === 'active' && studentIssues.length > 0) ||
                         (studentFilterStatus === 'overdue' && hasOverdue) ||
                         (studentFilterStatus === 'no-books' && studentIssues.length === 0);
    
    return matchesSearch && matchesFilter;
  });

  // Filter issued books for reports table
  const filteredIssuedBooks = issuedBooks.filter(issue => {
    const book = books.find(b => b.book_id === issue.book_id);
    const matchesSearch = (book?.title.toLowerCase().includes(reportsSearchTerm.toLowerCase()) || false) ||
                         (book?.book_id.toLowerCase().includes(reportsSearchTerm.toLowerCase()) || false) ||
                         issue.student_name.toLowerCase().includes(reportsSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = getDashboardStats();

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              📚 Library Management System
            </h1>
            <p className="text-lg text-indigo-700 font-medium">School Admin Dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-blue-100 text-sm font-medium">Total Books</p>
                  <p className="text-3xl font-bold">{stats.totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-emerald-100 text-sm font-medium">Available Books</p>
                  <p className="text-3xl font-bold">{stats.availableBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-amber-100 text-sm font-medium">Books Issued</p>
                  <p className="text-3xl font-bold">{stats.issuedBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-rose-100 text-sm font-medium">Overdue Books</p>
                  <p className="text-3xl font-bold">{stats.overdueBooks}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              <button
                onClick={() => setCurrentView('issue-book')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[80px]"
              >
                <Users className="h-5 w-5" />
                <span className="font-semibold text-base">Issue Book</span>
              </button>

              <button
                onClick={() => setCurrentView('add-book')}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[80px]"
              >
                <Plus className="h-5 w-5" />
                <span className="font-semibold text-base">Add Book</span>
              </button>

              <button
                onClick={() => setCurrentView('manage-books')}
                className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white p-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[80px]"
              >
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold text-base">Manage Books</span>
              </button>
            </div>
          </div>
          <div>
            <h1 className='text-4xl pt-5 pb-5 font-bold'>Reports & Analytics</h1>
          </div>

          {/* Daily Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-md border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{stats.todayIssued}</div>
              <div className="text-sm text-blue-800 font-medium">Books Issued Today</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-md border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-700">
                {issuedBooks.filter(ib => ib.return_date === '2025-08-30').length}
              </div>
              <div className="text-sm text-emerald-800 font-medium">Books Returned Today</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl shadow-md border border-rose-200">
              <div className="text-2xl font-bold text-rose-700">{stats.overdueBooks}</div>
              <div className="text-sm text-rose-800 font-medium">Overdue Books</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl shadow-md border border-violet-200">
              <div className="text-2xl font-bold text-violet-700">
                ₹{stats.todayFineCollection}
              </div>
              <div className="text-sm text-violet-800 font-medium">Today's Fine Collection</div>
            </div>
          </div>

          {/* All Books Issue Table */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">All Book Issues</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={reportsSearchTerm}
                  onChange={(e) => setReportsSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by book number or name..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Fine
                     </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIssuedBooks
                    .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())
                    .map((issue) => {
                      const book = books.find(b => b.book_id === issue.book_id);
                      const isOverdue = issue.status === 'Overdue';
                      const isReturned = issue.status === 'Returned';
                      
                      return (
                        <tr key={issue.issue_id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {issue.book_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{issue.book_title}</div>
                              <div className="text-sm text-gray-500">by {issue.book_author}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              issue.status === 'Returned' 
                                ? 'bg-green-100 text-green-800'
                                : issue.status === 'Overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{issue.student_name}</div>
                              <div className="text-sm text-gray-500">{issue.admission_number}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(issue.issue_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                              {new Date(issue.due_date).toLocaleDateString()}
                            </span>
                          </td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {issue.status === 'Overdue' ? `₹${calculateFine(issue)}` : '₹0'}
                           </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!isReturned ? (
                              <button
                                onClick={() => handleReturnBook(issue.issue_id)}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white transition-colors ${
                                  isOverdue 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                              >
                                Mark Returned
                              </button>
                            ) : (
                              <span className="text-green-600 text-xs font-medium">Returned</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              
              {filteredIssuedBooks.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                  <p className="text-gray-600">
                    {reportsSearchTerm ? 'No books match your search criteria.' : 'No book issue records available.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fine Collection Summary */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">💰</span>
              Fine Collection Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl border border-rose-200 shadow-md">
                <div className="text-2xl font-bold text-rose-700">
                  ₹{stats.todayFineCollection}
                </div>
                <div className="text-sm text-rose-800 font-medium">Today's Fine Collection</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl border border-orange-200 shadow-md">
                <div className="text-2xl font-bold text-orange-700">
                  {issuedBooks.filter(ib => ib.status === 'Overdue').length}
                </div>
                <div className="text-sm text-orange-800 font-medium">Books with Pending Fines</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl border border-yellow-200 shadow-md">
                <div className="text-2xl font-bold text-yellow-700">
                  ₹{issuedBooks
                    .filter(ib => ib.status === 'Overdue')
                    .reduce((total, issue) => total + calculateFine(issue), 0)}
                </div>
                <div className="text-sm text-yellow-800 font-medium">Total Outstanding Fines</div>
              </div>
            </div>
            
            {/* Overdue Books with Fines */}
            <div className="mt-6">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">📚</span>
                Overdue Books with Fines:
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {issuedBooks
                  .filter(ib => ib.status === 'Overdue')
                  .map(issue => (
                    <div key={issue.issue_id} className="flex justify-between items-center p-3 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg border border-rose-200 shadow-sm">
                      <div>
                        <p className="font-bold text-rose-900">{issue.book_title}</p>
                        <p className="text-sm text-rose-700 font-medium">{issue.student_name} ({issue.admission_number})</p>
                        <p className="text-xs text-rose-600 font-medium">Due: {issue.due_date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-rose-700 bg-white px-3 py-1 rounded-full shadow-sm">₹{calculateFine(issue)}</div>
                        <div className="text-xs text-rose-600 font-medium mt-1">
                          {Math.ceil((new Date('2025-08-30').getTime() - new Date(issue.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                        </div>
                      </div>
                    </div>
                  ))}
                {issuedBooks.filter(ib => ib.status === 'Overdue').length === 0 && (
                  <p className="text-blue-600 text-center py-4 font-medium">No overdue books with fines</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Students View
  if (currentView === 'students') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              
              Back 
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              👥 Student Management
            </h1>
            <p className="text-lg text-indigo-700 font-medium">View and manage student book records</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                  <input
                    type="text"
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Search by student name, admission number, or class..."
                  />
                </div>
              </div>
              <div>
                <select
                  value={studentFilterStatus}
                  onChange={(e) => setStudentFilterStatus(e.target.value as any)}
                  className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                >
                  <option value="all">All Students</option>
                  <option value="active">Students with Issued Books</option>
                  <option value="overdue">Students with Overdue Books</option>
                  <option value="no-books">Students with No Books</option>
                </select>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-800 font-medium">Total Students: {filteredStudents.length}</span>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-2 rounded-full">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-800 font-medium">With Issued Books: {filteredStudents.filter(s => {
                  const issues = issuedBooks.filter(ib => ib.admission_number === s.admission_number && 
                                                  (ib.status === 'Issued' || ib.status === 'Overdue'));
                  return issues.length > 0;
                }).length}</span>
              </div>
              <div className="flex items-center space-x-2 bg-rose-100 px-3 py-2 rounded-full">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-rose-800 font-medium">With Overdue Books: {filteredStudents.filter(s => {
                  return issuedBooks.some(ib => ib.admission_number === s.admission_number && ib.status === 'Overdue');
                }).length}</span>
              </div>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => {
              const studentIssues = issuedBooks.filter(ib => 
                ib.admission_number === student.admission_number && 
                (ib.status === 'Issued' || ib.status === 'Overdue')
              );
              const overdueCount = studentIssues.filter(ib => ib.status === 'Overdue').length;
              const totalIssued = studentIssues.length;

              return (
                <div key={student.admission_number} className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:scale-105">
                  {/* Student Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900 mb-2">{student.name}</h3>
                      <p className="text-sm text-blue-700 font-medium">ID: {student.admission_number}</p>
                      <p className="text-sm text-indigo-600">Class: {student.class}</p>
                      <p className="text-sm text-cyan-600">Teacher: {student.class_teacher}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {overdueCount > 0 && (
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md">
                          {overdueCount} Overdue
                        </span>
                      )}
                      {totalIssued > 0 && overdueCount === 0 && (
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
                          {totalIssued} Issued
                        </span>
                      )}
                      {totalIssued === 0 && (
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-md">
                          No Books
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Books Summary */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-blue-700 mb-2">
                      <span className="font-medium">Current Books:</span>
                      <span className="font-bold text-blue-900">{totalIssued}</span>
                    </div>
                    {overdueCount > 0 && (
                      <div className="flex justify-between text-sm text-rose-600">
                        <span className="font-medium">Overdue Books:</span>
                        <span className="font-bold">{overdueCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Current Books List */}
                  {totalIssued > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-blue-800 mb-2">Current Books:</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {studentIssues.map((issue) => (
                          <div 
                            key={issue.issue_id} 
                            className={`p-2 rounded-lg text-xs border ${
                              issue.status === 'Overdue' 
                                ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-200' 
                                : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200'
                            }`}
                          >
                            <p className="font-bold truncate text-blue-900">{issue.book_title}</p>
                            <p className="text-blue-700">Due: {issue.due_date}</p>
                            {issue.status === 'Overdue' && (
                              <p className="text-rose-600 font-bold">OVERDUE</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setAdmissionNumber(student.admission_number);
                        setCurrentView('issue-book');
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-all duration-300 font-semibold shadow-md"
                    >
                      Issue Book
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm py-2 px-3 rounded-lg transition-all duration-300 shadow-md">
                      <Eye className="h-4 w-4 mx-auto" />
                    </button>
                  </div>

                  {/* Quick Return for Overdue */}
                  {studentIssues.filter(ib => ib.status === 'Overdue').length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-rose-600 mb-2 font-bold">Quick Return Overdue Books:</p>
                      <div className="flex flex-wrap gap-1">
                        {studentIssues
                          .filter(ib => ib.status === 'Overdue')
                          .slice(0, 2)
                          .map(issue => (
                            <button
                              key={issue.issue_id}
                              onClick={() => handleReturnBook(issue.issue_id)}
                              className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-2 py-1 rounded transition-all duration-300 font-semibold shadow-md"
                              title={`Return: ${issue.book_title}`}
                            >
                              Return
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-800 mb-2">No Students Found</h3>
              <p className="text-blue-600 font-medium">
                {studentSearchTerm ? 'Try adjusting your search terms or filters.' : 'No students match the selected filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Issue Book View
  if (currentView === 'issue-book') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              <span className="font-semibold"> Back </span>
            </button>
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                📚 Issue Book
              </h1>
              <p className="text-xl text-indigo-700 font-medium">✨ Lend knowledge to eager minds! ✨</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Details */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100 transform hover:scale-105 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                  <span className="text-3xl">👨‍🎓</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">👤 Student Information</h3>
                <p className="text-blue-600">Enter student details to proceed</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-800 mb-3 flex items-center">
                  <span className="mr-2">🆔</span>
                  Admission Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="📝 Enter admission number..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-blue-400">🎯</span>
                  </div>
                </div>
              </div>

              {selectedStudent && (
                <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-6 rounded-xl border-2 border-emerald-200 shadow-lg transform scale-105">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">✅</span>
                    <h4 className="text-lg font-bold text-emerald-800">Student Found! 🎉</h4>
                  </div>
                  <div className="space-y-3 text-emerald-800">
                    <div className="flex items-center">
                      <span className="mr-3">👤</span>
                      <span className="font-semibold">Name:</span>
                      <span className="ml-2 font-bold">{selectedStudent.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">🏫</span>
                      <span className="font-semibold">Class:</span>
                      <span className="ml-2 font-bold">{selectedStudent.class}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">👨‍🏫</span>
                      <span className="font-semibold">Teacher:</span>
                      <span className="ml-2 font-bold">{selectedStudent.class_teacher}</span>
                    </div>
                  </div>
                </div>
              )}

              {admissionNumber && !selectedStudent && (
                <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-6 rounded-xl border-2 border-rose-200 shadow-lg">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">❌</span>
                    <p className="text-rose-800 font-semibold text-lg">Student not found with this admission number 😔</p>
                  </div>
                </div>
              )}
            </div>

            {/* Book Selection */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl p-8 border border-emerald-100 transform hover:scale-105 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">📚 Book Selection</h3>
                <p className="text-emerald-600">Choose the perfect book for the student</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                  <span className="mr-2">📚</span>
                  Select Book
                </label>
                <div className="relative">
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 text-lg appearance-none bg-white"
                  >
                    <option value="">🎯 Choose a book...</option>
                    {books
                      .filter(book => book.available_copies > 0)
                      .map(book => (
                        <option key={book.book_id} value={book.book_id}>
                          📖 {book.title} by {book.author} ({book.available_copies} available)
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <span className="text-emerald-400">📚</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                  <span className="mr-2">📅</span>
                  Return Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 text-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-emerald-400">📅</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center">
                    <span className="mr-3">📅</span>
                    <span className="font-semibold text-blue-800">Issue Date:</span>
                    <span className="ml-2 font-bold text-blue-900">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleIssueBook}
                disabled={!selectedStudent || !selectedBookId || !dueDate}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  !selectedStudent || !selectedBookId || !dueDate
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-500/50'
                }`}
              >
                {!selectedStudent || !selectedBookId || !dueDate ? (
                  <span>🔒 Please fill all fields</span>
                ) : (
                  <span>🚀 Issue Book Now!</span>
                )}
              </button>
            </div>
          </div>

          
        </div>
      </div>
    );
  }

  // Add Book View
  if (currentView === 'add-book') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center text-emerald-600 hover:text-emerald-800 mb-6 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              <span className="font-semibold">Back </span>
            </button>
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                📚 Add New Book
              </h1>
              <p className="text-xl text-emerald-700 font-medium">✨ Expand your library with amazing new titles! ✨</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl p-8 border border-emerald-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
                <span className="text-4xl">📖</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">📝 Book Details Form</h3>
              <p className="text-emerald-600">Fill in the information below to add a new book</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                    <span className="mr-2">📖</span>
                    Book Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookForm.title}
                      onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 text-lg"
                      placeholder="📝 Enter book title..."
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-emerald-400">✍️</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                    <span className="mr-2">✍️</span>
                    Author *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookForm.author}
                      onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 text-lg"
                      placeholder="👤 Enter author name..."
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-emerald-400">👨‍🎨</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                    <span className="mr-2">🏷️</span>
                    ISBN *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookForm.isbn}
                      onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 text-lg"
                      placeholder="🔢 Enter ISBN..."
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-emerald-400">📋</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                    <span className="mr-2">📂</span>
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={bookForm.category}
                      onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 text-lg appearance-none bg-white"
                    >
                      <option value="">🎯 Select category</option>
                      <option value="Mathematics">🔢 Mathematics</option>
                      <option value="Science">🧪 Science</option>
                      <option value="English">📚 English</option>
                      <option value="History">🏛️ History</option>
                      <option value="Geography">🌍 Geography</option>
                      <option value="Literature">📖 Literature</option>
                      <option value="Computer Science">💻 Computer Science</option>
                      <option value="Art">🎨 Art</option>
                      <option value="Music">🎵 Music</option>
                      <option value="Sports">⚽ Sports</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <span className="text-emerald-400">📚</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                    <span className="mr-2">📚</span>
                    Total Copies
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={bookForm.total_copies}
                      onChange={(e) => setBookForm({ ...bookForm, total_copies: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 text-lg"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-emerald-400">📊</span>
                    </div>
                  </div>
                </div>

                {/* Book Preview Card */}
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                    <span className="mr-2">👁️</span>
                    Book Preview
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div><span className="font-semibold">Title:</span> {bookForm.title || 'Not specified'}</div>
                    <div><span className="font-semibold">Author:</span> {bookForm.author || 'Not specified'}</div>
                    <div><span className="font-semibold">Category:</span> {bookForm.category || 'Not specified'}</div>
                    <div><span className="font-semibold">Copies:</span> {bookForm.total_copies}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAddBook}
                disabled={!bookForm.title || !bookForm.author || !bookForm.isbn}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  !bookForm.title || !bookForm.author || !bookForm.isbn
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-500/50'
                }`}
              >
                {!bookForm.title || !bookForm.author || !bookForm.isbn ? (
                  <span>🔒 Please fill required fields</span>
                ) : (
                  <span>🚀 Add Book to Library!</span>
                )}
              </button>
              <button
                onClick={() => setBookForm({ title: '', author: '', isbn: '', category: '', total_copies: 1 })}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🗑️ Clear Form
              </button>
            </div>
          </div>

          
        </div>
      </div>
    );
  }

  // Manage Books View
  if (currentView === 'manage-books') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center text-violet-600 hover:text-violet-800 mb-6 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              <span className="font-semibold">Back </span>
            </button>
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                📚 Manage Books
              </h1>
              <p className="text-xl text-violet-700 font-medium">✨ Organize and maintain your library collection! ✨</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl shadow-xl p-8 mb-8 border border-violet-100">
            <div className="text-center mb-6">
              
              <h3 className="text-2xl font-bold text-violet-900 mb-2">🔍 Search & Filter Books</h3>
              <p className="text-violet-600">Find the books you're looking for quickly</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-300 focus:border-violet-500 transition-all duration-300 text-lg"
                    placeholder="🔍 Search books by title or author..."
                  />
                </div>
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-6 py-4 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-300 focus:border-violet-500 transition-all duration-300 bg-white text-lg font-medium min-w-[200px] appearance-none"
                >
                  <option value="all">📚 All Books</option>
                  <option value="available">✅ Available</option>
                  <option value="issued">❌ Out of Stock</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <span className="text-violet-400">📋</span>
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-violet-100 px-4 py-2 rounded-full border border-violet-200">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <span className="text-violet-800 font-medium">Total: {filteredBooks.length}</span>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-800 font-medium">Available: {filteredBooks.filter(b => b.available_copies > 0).length}</span>
              </div>
              <div className="flex items-center space-x-2 bg-rose-100 px-4 py-2 rounded-full border border-rose-200">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-rose-800 font-medium">Out of Stock: {filteredBooks.filter(b => b.available_copies === 0).length}</span>
              </div>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl shadow-xl overflow-hidden border border-violet-100">
            <div className="p-6 border-b border-violet-200">
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mr-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-xl font-bold text-violet-900">📚 Library Collection</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-violet-200">
                <thead className="bg-gradient-to-r from-violet-100 to-purple-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">
                      📖 Book Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">
                      🏷️ ISBN
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">
                      📂 Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">
                      📊 Copies
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">
                      📈 Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">
                      ⚡ Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-violet-100">
                  {filteredBooks.map((book) => (
                    <tr key={book.book_id} className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-300">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-white text-xl">📚</span>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-violet-900 mb-1">{book.title}</div>
                            <div className="text-sm text-violet-600 flex items-center">
                              <span className="mr-2">✍️</span>
                              by {book.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-2 rounded-lg border border-blue-200">
                          <span className="text-sm font-mono text-blue-800">{book.isbn}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="inline-flex px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                          <span className="mr-2">📂</span>
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-violet-900 mb-1">{book.available_copies}/{book.total_copies}</div>
                          <div className="w-full bg-violet-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(book.available_copies / book.total_copies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full border-2 ${
                          book.available_copies > 0 
                            ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-300' 
                            : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-300'
                        }`}>
                          <span className="mr-2">
                            {book.available_copies > 0 ? '✅' : '❌'}
                          </span>
                          {book.available_copies > 0 ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg">
                            <Trash2 className="h-5 w-5" />
                          </button>
                         
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBooks.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full mb-6">
                    <BookOpen className="h-10 w-10 text-violet-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-violet-800 mb-3">No Books Found 📚</h3>
                  <p className="text-violet-600 text-lg">
                    {searchTerm ? '🔍 No books match your search criteria.' : '📖 No books available in the library.'}
                  </p>
                  <button
                    onClick={() => setCurrentView('add-book')}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🚀 Add Your First Book!
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentView('add-book')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-6 w-6 mr-3" />
              🚀 Add New Book
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reports View
  if (currentView === 'reports') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              📊 Reports & Analytics
            </h1>
          </div>

          
          
        </div>
      </div>
    );
  }

  return null;
};

export default LibraryManagementSystem;