import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, Plus, X, Filter, Search, Bell, Brain, Zap, Sparkles, TrendingUp, FileText, Eye, Upload, User, Phone, UserCheck } from 'lucide-react';

// Types
interface Staff {
  id: number;
  name: string;
  designation: string;
  staffType: string;
  phone: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  staffId: number;
  staffName: string;
  staffType: string;
  endDateTime: string;
  status: 'Active' | 'Completed' | 'Overdue';
  createdAt: string;
  
}

interface Notification {
  id: number;
  message: string;
  type: 'overdue' | 'info' | 'ai-insight';
  timestamp: string;
}

// Mock data
const mockStaff: Staff[] = [
  { id: 1, name: 'Mr. Rajesh Kumar', designation: 'Senior Accountant', staffType: 'Finance', phone: '+91-9876543210', email: 'rajesh.kumar@school.edu' },
  { id: 2, name: 'Ms. Priya Sharma', designation: 'Math Teacher', staffType: 'Teacher', phone: '+91-9876543211', email: 'priya.sharma@school.edu' },
  { id: 3, name: 'Mr. Amit Singh', designation: 'Security Guard', staffType: 'Security', phone: '+91-9876543212', email: 'amit.singh@school.edu' },
  { id: 4, name: 'Mrs. Sunita Devi', designation: 'Head Cleaner', staffType: 'Cleaners', phone: '+91-9876543213', email: 'sunita.devi@school.edu' },
  { id: 5, name: 'Dr. Anita Verma', designation: 'School Nurse', staffType: 'Medical', phone: '+91-9876543214', email: 'anita.verma@school.edu' },
  { id: 6, name: 'Mr. Ramesh Pal', designation: 'Head Gardener', staffType: 'Gardener', phone: '+91-9876543215', email: 'ramesh.pal@school.edu' },
  { id: 7, name: 'Mrs. Kavita Roy', designation: 'Pantry Supervisor', staffType: 'Pantry', phone: '+91-9876543216', email: 'kavita.roy@school.edu' },
  { id: 8, name: 'Mr. Vikash Jha', designation: 'Finance Assistant', staffType: 'Finance', phone: '+91-9876543217', email: 'vikash.jha@school.edu' }
];

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Prepare Monthly Fee Report',
    description: 'Compile and analyze monthly fee collection data for August 2025',
    staffId: 1,
    staffName: 'Mr. Rajesh Kumar',
    staffType: 'Finance',
    endDateTime: '2025-08-31T17:00',
    status: 'Active',
    createdAt: '2025-08-25T10:00',
   
  },
  {
    id: 2,
    title: 'Update Security Protocols',
    description: 'Review and update evening security checklist procedures',
    staffId: 3,
    staffName: 'Mr. Amit Singh',
    staffType: 'Security',
    endDateTime: '2025-08-29T15:00',
    status: 'Overdue',
    createdAt: '2025-08-20T09:00',
    
  },
  {
    id: 3,
    title: 'Prepare Grade 10 Math Test',
    description: 'Create comprehensive test for Chapter 5 - Trigonometry',
    staffId: 2,
    staffName: 'Ms. Priya Sharma',
    staffType: 'Teacher',
    endDateTime: '2025-09-02T12:00',
    status: 'Completed',
    createdAt: '2025-08-28T11:00',
   
  }
];

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [currentView, setCurrentView] = useState<'main' | 'assign' | 'records'>('assign');
  const [taskFilter, setTaskFilter] = useState<'All' | 'Active' | 'Completed' | 'Overdue'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Task assignment form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    staffType: '',
    staffId: '',
    endDateTime: ''
  });
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const staffTypes = ['Security', 'Finance', 'Teacher', 'Gardener', 'Cleaners', 'Medical', 'Pantry'];

  // Get staff by type
  const getStaffByType = (type: string) => {
    return staff.filter(s => s.staffType === type);
  };

  // Handle staff type change
  const handleStaffTypeChange = (type: string) => {
    setTaskForm(prev => ({ ...prev, staffType: type, staffId: '' }));
    setSelectedStaff(null);
  };

  // Handle staff selection
  const handleStaffSelection = (staffId: string) => {
    const staffMember = mockStaff.find(s => s.id === parseInt(staffId));
    setSelectedStaff(staffMember || null);
    setTaskForm(prev => ({ ...prev, staffId }));
  };

 

  // Submit task assignment
  const handleTaskSubmit = () => {
    if (!taskForm.title || !taskForm.staffId || !taskForm.endDateTime) return;

    

    const newTask: Task = {
      id: Date.now(),
      title: taskForm.title,
      description: taskForm.description,
      staffId: parseInt(taskForm.staffId),
      staffName: selectedStaff?.name || '',
      staffType: taskForm.staffType,
      endDateTime: taskForm.endDateTime,
      status: 'Active',
      createdAt: new Date().toISOString(),
      
    };

    setTasks(prev => [newTask, ...prev]);
    setTaskForm({ title: '', description: '', staffType: '', staffId: '', endDateTime: '' });
    setSelectedStaff(null);
    setCurrentView('records');
  };

  // Get task counts
  const taskCounts = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'Active').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.status === 'Overdue').length
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = taskFilter === 'All' || task.status === taskFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium';
      case 'Completed':
        return 'bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium';
      case 'Overdue':
        return 'bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium';
      default:
        return 'bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-2xl border-b-4 border-purple-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-5xl hidden sm:inline">🏫</span>
                Task Management System
              </h1>
              <p className="text-purple-200 text-lg lg:ml-20">Secure • Smart • Simple</p>
            </div>
            
            {/* Stats Badge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Clock className="text-yellow-300" size={20} />
                <span className="font-bold text-lg">{taskCounts.active}</span>
                <span className="text-purple-200">tasks today</span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <button
                onClick={() => setCurrentView('assign')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  currentView === 'assign'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg transform scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ➕ Assign Task
              </button>
              <button
                onClick={() => setCurrentView('records')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  currentView === 'records'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg transform scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                📋 Records ({taskCounts.total})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Dashboard View */}
        {currentView === 'main' && (
          <div className="space-y-8">
            {/* Main Action Buttons */}
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setCurrentView('assign')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-6 w-6" />
                <span>Assign Task</span>
              </button>
              <button
                onClick={() => setCurrentView('records')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FileText className="h-6 w-6" />
                <span>View Records ({taskCounts.total})</span>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium">Total Tasks</h3>
                    <p className="text-4xl font-bold">{taskCounts.total}</p>
                  </div>
                  <Users className="h-12 w-12 text-white/60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium">Active Tasks</h3>
                    <p className="text-4xl font-bold">{taskCounts.active}</p>
                  </div>
                  <Clock className="h-12 w-12 text-white/60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium">Completed</h3>
                    <p className="text-4xl font-bold">{taskCounts.completed}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Assignment View */}
        {currentView === 'assign' && (
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 rounded-t-2xl p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">⚡</div>
                <div>
                  <h2 className="text-2xl font-bold">Task Assignment</h2>
                  <p className="text-purple-200">Smart task distribution for school staff</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-b-2xl shadow-xl p-8 space-y-6">
              {/* Task Title */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <label className="text-gray-700 font-bold">Task Title *</label>
                </div>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors bg-gray-50"
                  placeholder="Enter task title"
                />
              </div>

              {/* Task Description */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <label className="text-gray-700 font-bold">Task Description</label>
                </div>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors bg-gray-50"
                  placeholder="Provide detailed task instructions"
                />
              </div>

              {/* Staff Type */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <label className="text-gray-700 font-bold">Staff Type *</label>
                </div>
                <select
                  required
                  value={taskForm.staffType}
                  onChange={(e) => handleStaffTypeChange(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors bg-white"
                >
                  <option value="">Select staff type</option>
                  {staffTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Staff Member */}
              {taskForm.staffType && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-5 w-5 text-indigo-600" />
                    <label className="text-gray-700 font-bold">Staff Member *</label>
                  </div>
                  <select
                    required
                    value={taskForm.staffId}
                    onChange={(e) => handleStaffSelection(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors bg-white"
                  >
                    <option value="">Select staff member</option>
                    {getStaffByType(taskForm.staffType).map((staffMember) => (
                      <option key={staffMember.id} value={staffMember.id.toString()}>
                        {staffMember.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Staff Details Card */}
              {selectedStaff && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Staff Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-bold text-blue-700">👤 Name:</span>
                      <p className="text-gray-900 font-medium">{selectedStaff.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-purple-700">🎯 Designation:</span>
                      <p className="text-gray-900 font-medium">{selectedStaff.designation}</p>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-green-700">📱 Phone:</span>
                      <p className="text-gray-900 font-medium">{selectedStaff.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-pink-700">✉️ Email:</span>
                      <p className="text-gray-900 font-medium text-sm">{selectedStaff.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* End Date & Time */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-5 w-5 text-pink-600" />
                  <label className="text-gray-700 font-bold">End Date & Time *</label>
                </div>
                <input
                  type="datetime-local"
                  required
                  value={taskForm.endDateTime}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, endDateTime: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors bg-white"
                />
                
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleTaskSubmit}
                  disabled={!taskForm.title || !taskForm.staffId || !taskForm.endDateTime}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Zap className="h-5 w-5" />
                  <span>Assign Task</span>
                  <Sparkles className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      <div className='bg-blue-100 rounded-2xl'>
        {/* Task Records View */}
        {currentView === 'records' && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-t-2xl p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📋</div>
                <div>
                  <h2 className="text-2xl font-bold">Task Records</h2>
                  <p className="text-cyan-200">Track and manage all task entries</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:pl-10 lg:pr-10">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium">Total Tasks</h3>
                    <p className="text-4xl font-bold">{taskCounts.total}</p>
                  </div>
                  <Users className="h-12 w-12 text-white/60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium">Active Tasks</h3>
                    <p className="text-4xl font-bold">{taskCounts.active}</p>
                  </div>
                  <Clock className="h-12 w-12 text-white/60" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium">Other Tasks</h3>
                    <p className="text-4xl font-bold">{taskCounts.completed + taskCounts.overdue}</p>
                  </div>
                  <Sparkles className="h-12 w-12 text-white/60" />
                </div>
              </div>
            </div>

                         {/* Search and Filter */}
             <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4 lg:pl-10 lg:pr-10">
               <div className="flex-1 relative w-full lg:w-auto">
                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                 <input
                   type="text"
                   placeholder="🔍 Search tasks..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white"
                 />
               </div>
               <div className="flex items-center space-x-2 w-full lg:w-auto">
                 <Filter className="h-5 w-5 text-green-600" />
                 <select
                   value={taskFilter}
                   onChange={(e) => setTaskFilter(e.target.value as any)}
                   className="flex-1 lg:flex-none border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors bg-white min-w-32"
                 >
                   <option value="All">🌈 All Types</option>
                   <option value="Active">🔵 Active</option>
                   <option value="Completed">🟢 Completed</option>
                   <option value="Overdue">🔴 Overdue</option>
                 </select>
               </div>
             </div>

                         {/* Task Table */}
             <div className="rounded-2xl shadow-xl overflow-hidden p-4 lg:p-10">
               {/* Desktop Table */}
               <div className="hidden lg:block">
                 {/* Table Header */}
                 <div className="bg-gray-800 text-white">
                   <div className="grid grid-cols-6 gap-4 p-6 font-bold text-sm">
                     <div className="w-16">Photo</div>
                     <div className="flex-1">Task</div>
                     <div className="w-32">Staff</div>
                     <div className="w-24">Type</div>
                     <div className="w-24">Status</div>
                     <div className="w-28">Date & Time</div>
                   </div>
                 </div>

                 {/* Table Body */}
                 <div className="bg-white divide-y divide-gray-100">
                   {filteredTasks.length === 0 ? (
                     <div className="p-12 text-center text-gray-500">
                       <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                       <p className="text-lg">No tasks found matching your criteria.</p>
                     </div>
                   ) : (
                     filteredTasks.map((task, index) => (
                       <div key={task.id} className="grid grid-cols-6 gap-4 p-8 hover:bg-gray-50 transition-colors items-start">
                         {/* Photo */}
                         <div>
                           <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                             {task.staffName.charAt(0)}
                           </div>
                         </div>

                         {/* Task */}
                         <div className="flex-1">
                           <p className="font-bold text-gray-900 text-sm mb-2">{task.title}</p>
                           <p className="text-xs text-gray-500 leading-relaxed">{task.description}</p>
                         </div>

                         {/* Staff */}
                         <div className="w-32">
                           <p className="font-medium text-gray-900 text-sm">{task.staffName}</p>
                           <p className="text-xs text-gray-500">{mockStaff.find(s => s.id === task.staffId)?.phone}</p>
                         </div>

                         {/* Type */}
                         <div className="w-24">
                           <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                             {task.staffType}
                           </span>
                         </div>

                         {/* Status */}
                         <div className="w-24">
                           <span className={getStatusBadge(task.status)}>
                             {task.status}
                           </span>
                         </div>

                         {/* Date/Time */}
                         <div className="w-28">
                           <div className="flex items-center space-x-1">
                             <Clock className="h-3 w-3 text-gray-400" />
                             <div>
                               <p className="text-xs text-gray-900 font-medium">
                                 {formatDate(task.endDateTime)}
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </div>

               {/* Mobile Cards */}
               <div className="lg:hidden space-y-4">
                 {filteredTasks.length === 0 ? (
                   <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
                     <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                     <p className="text-lg">No tasks found matching your criteria.</p>
                   </div>
                 ) : (
                   filteredTasks.map((task, index) => (
                     <div key={task.id} className={`bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-4 hover:shadow-2xl transition-all duration-200 ${
                       index % 2 === 0 ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-white'
                     }`}>
                       <div className="flex items-center justify-between">
                         {/* Left side - Photo and Staff Name */}
                         <div className="flex items-center gap-4 flex-1">
                           <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                             {task.staffName.charAt(0)}
                           </div>
                           <div className="flex-1">
                             <h3 className="font-bold text-gray-800 text-lg">{task.staffName}</h3>
                             <p className="text-gray-600 text-sm">{mockStaff.find(s => s.id === task.staffId)?.designation}</p>
                           </div>
                         </div>

                         {/* Right side - Status and Info button */}
                         <div className="flex flex-col items-end gap-2">
                           <span className={getStatusBadge(task.status)}>
                             {task.status}
                           </span>
                           <button
                             onClick={() => setSelectedTask(task)}
                             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:from-purple-600 hover:to-pink-600 shadow-lg transform hover:scale-110 transition-all"
                           >
                             <Eye size={16} />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))
                 )}
               </div>
             </div>
            
          </div>
        )}
        </div>
      </main>

      {/* Task Details Modal for Mobile */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 rounded-3xl max-w-md w-full shadow-2xl border-2 border-purple-200 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Task Details
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-red-500 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Task Title */}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-purple-100">
                <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Task Title
                </h4>
                <p className="font-bold text-gray-800 text-sm">{selectedTask.title}</p>
              </div>

              {/* Task Description */}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
                <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Description
                </h4>
                <p className="text-gray-800 text-xs leading-relaxed">{selectedTask.description}</p>
              </div>

              {/* Staff Information */}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-green-100">
                <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  Assigned Staff
                </h4>
                <div className="space-y-1">
                  <p className="font-bold text-gray-800 text-xs">{selectedTask.staffName}</p>
                  <p className="text-gray-600 text-xs">{mockStaff.find(s => s.id === selectedTask.staffId)?.designation}</p>
                  <p className="text-gray-600 text-xs">{mockStaff.find(s => s.id === selectedTask.staffId)?.phone}</p>
                </div>
              </div>

              {/* Task Details */}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-pink-100">
                <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-pink-600" />
                  Task Details
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-pink-700 font-medium">Type</label>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {selectedTask.staffType}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs text-pink-700 font-medium">Status</label>
                    <span className={getStatusBadge(selectedTask.status)}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-pink-700 font-medium">Due Date</label>
                    <p className="font-bold text-gray-800 text-xs">{formatDate(selectedTask.endDateTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;