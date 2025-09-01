import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, FileText, Settings, Calendar, Filter, Info, Plus, Edit, Trash2, Download, CreditCard, Receipt, TrendingUp, Users, Coffee, Pizza, IceCream, Utensils } from 'lucide-react';

// Types
interface Student {
  admissionNumber: string;
  name: string;
  class: string;
  phoneNumber: string;
  totalSpending: number;
  pendingBalance: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

interface Transaction {
  id: string;
  admissionNumber: string;
  studentName: string;
  class: string;
  phoneNumber: string;
  items: { item: MenuItem; quantity: number }[];
  totalAmount: number;
  date: string;
  time: string;
}

interface PurchaseHistory {
  id: string;
  items: string;
  amount: number;
  date: string;
  time: string;
}

// Sample Data with emojis
const sampleStudents: Student[] = [
  { admissionNumber: '2021001', name: 'Rahul Kumar', class: '12-A', phoneNumber: '9876543210', totalSpending: 450, pendingBalance: 0 },
  { admissionNumber: '2021002', name: 'Priya Sharma', class: '11-B', phoneNumber: '9876543211', totalSpending: 320, pendingBalance: 50 },
  { admissionNumber: '2021003', name: 'Amit Singh', class: '12-C', phoneNumber: '9876543212', totalSpending: 280, pendingBalance: 0 },
];

const sampleMenuItems: MenuItem[] = [
  { id: '1', name: 'Samosa', price: 15, category: 'Snacks', emoji: '🥟' },
  { id: '2', name: 'Macaroni', price: 25, category: 'Main Course', emoji: '🍝' },
  { id: '3', name: 'Sandwich', price: 30, category: 'Main Course', emoji: '🥪' },
  { id: '4', name: 'Chips', price: 10, category: 'Snacks', emoji: '🍟' },
  { id: '5', name: 'Pastry', price: 35, category: 'Dessert', emoji: '🧁' },
  { id: '6', name: 'Cold Coffee', price: 20, category: 'Beverages', emoji: '☕' },
  { id: '7', name: 'Tea', price: 8, category: 'Beverages', emoji: '🫖' },
];

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    admissionNumber: '2021001',
    studentName: 'Rahul Kumar',
    class: '12-A',
    phoneNumber: '9876543210',
    items: [{ item: sampleMenuItems[0], quantity: 2 }, { item: sampleMenuItems[3], quantity: 1 }],
    totalAmount: 40,
    date: '2025-09-01',
    time: '10:30 AM'
  },
  {
    id: '2',
    admissionNumber: '2021002',
    studentName: 'Priya Sharma',
    class: '11-B',
    phoneNumber: '9876543211',
    items: [{ item: sampleMenuItems[1], quantity: 1 }, { item: sampleMenuItems[5], quantity: 1 }],
    totalAmount: 45,
    date: '2025-09-01',
    time: '11:15 AM'
  },
];

export default function CashlessCanteenApp() {
  const [activeTab, setActiveTab] = useState<'purchase' | 'records' | 'reports' | 'menu'>('purchase');
  const [students] = useState<Student[]>(sampleStudents);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  
  // Purchase Screen State
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  
  // Records Screen State
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<Student | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Reports Screen State
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classFilter, setClassFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  
  // Menu Management State
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ name: '', price: 0, category: '', emoji: '' });

  // Purchase Screen Functions
  const searchStudent = () => {
    const student = students.find(s => s.admissionNumber === admissionNumber);
    setSelectedStudent(student || null);
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(c => c.item.id === item.id);
    if (existingItem) {
      setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(c => c.item.id !== itemId));
    } else {
      setCart(cart.map(c => c.item.id === itemId ? { ...c, quantity } : c));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, c) => total + (c.item.price * c.quantity), 0);
  };

  const saveTransaction = () => {
    if (!selectedStudent || cart.length === 0) return;
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      admissionNumber: selectedStudent.admissionNumber,
      studentName: selectedStudent.name,
      class: selectedStudent.class,
      phoneNumber: selectedStudent.phoneNumber,
      items: [...cart],
      totalAmount: calculateTotal(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setTransactions([...transactions, newTransaction]);
    setCart([]);
    setSelectedStudent(null);
    setAdmissionNumber('');
    alert('Transaction saved successfully! 🎉');
  };

  // Menu Management Functions
  const addMenuItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category || !newItem.emoji) return;
    
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: newItem.price,
      category: newItem.category,
      emoji: newItem.emoji
    };
    
    setMenuItems([...menuItems, item]);
    setNewItem({ name: '', price: 0, category: '', emoji: '' });
    setShowAddItemModal(false);
  };

  const editMenuItem = (item: MenuItem) => {
    setMenuItems(menuItems.map(m => m.id === item.id ? item : m));
    setEditingItem(null);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(m => m.id !== id));
  };

  // Get student purchase history
  const getStudentHistory = (admissionNumber: string): PurchaseHistory[] => {
    return transactions
      .filter(t => t.admissionNumber === admissionNumber)
      .map(t => ({
        id: t.id,
        items: t.items.map(i => `${i.item.emoji} ${i.item.name} (${i.quantity})`).join(', '),
        amount: t.totalAmount,
        date: t.date,
        time: t.time
      }));
  };

  // Filter transactions for reports
  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      const matchesDate = t.date === selectedDate;
      const matchesClass = !classFilter || t.class.includes(classFilter);
      const matchesItem = !itemFilter || t.items.some(i => i.item.name.toLowerCase().includes(itemFilter.toLowerCase()));
      return matchesDate && matchesClass && matchesItem;
    });
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Snacks': return '🍿';
      case 'Main Course': return '🍽️';
      case 'Beverages': return '🥤';
      case 'Dessert': return '🍰';
      default: return '🍴';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="gradient-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="text-4xl animate-bounce">🍕</div>
              <h1 className="text-3xl font-bold text-white animate-fade-in-up">
                Cashless Canteen System
              </h1>
              <div className="text-2xl emoji-wave">👨‍🍳</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('purchase')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover-scale ${
                  activeTab === 'purchase' 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-white hover:bg-white hover:text-purple-600 hover:shadow-lg'
                }`}
              >
                
                🛒 Purchase
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover-scale ${
                  activeTab === 'records' 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-white hover:bg-white hover:text-purple-600 hover:shadow-lg'
                }`}
              >
                
                👥 Records
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover-scale ${
                  activeTab === 'reports' 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-white hover:bg-white hover:text-purple-600 hover:shadow-lg'
                }`}
              >
                
                📊 Reports
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover-scale ${
                  activeTab === 'menu' 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-white hover:bg-white hover:text-purple-600 hover:shadow-lg'
                }`}
              >
                
                ⚙️ Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Purchase Screen */}
        {activeTab === 'purchase' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl p-8 card-glow">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">💳</div>
                <h2 className="text-2xl font-bold text-gray-800">Student Purchase</h2>
              </div>
              
              {/* Student Search */}
              <div className="flex space-x-4 mb-8">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎓 Admission Number
                  </label>
                  <input
                    type="text"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter admission number..."
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={searchStudent}
                    className="px-8 py-3 gradient-success text-white rounded-xl hover-scale font-medium flex items-center shadow-lg"
                  >
                    
                    🔍 Search
                  </button>
                </div>
              </div>

              {/* Student Details */}
              {selectedStudent && (
                <div className="gradient-info rounded-2xl p-6 mb-8 animate-slide-in-left">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl">👨‍🎓</div>
                    <h3 className="text-xl font-bold text-gray-800">Student Details</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <span className="text-gray-600 text-xs uppercase tracking-wide">Admission No</span>
                      <p className="font-bold text-lg text-purple-600">{selectedStudent.admissionNumber}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <span className="text-gray-600 text-xs uppercase tracking-wide">Name</span>
                      <p className="font-bold text-lg text-gray-800">{selectedStudent.name}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <span className="text-gray-600 text-xs uppercase tracking-wide">Class</span>
                      <p className="font-bold text-lg text-blue-600">{selectedStudent.class}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <span className="text-gray-600 text-xs uppercase tracking-wide">Phone</span>
                      <p className="font-bold text-lg text-green-600">{selectedStudent.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              {selectedStudent && (
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="text-2xl">🍽️</div>
                    <h3 className="text-xl font-bold text-gray-800">Menu Items</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover-lift card-glow animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{item.emoji}</div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500 flex items-center">
                                {getCategoryEmoji(item.category)} {item.category}
                              </p>
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full px-4 py-3 gradient-primary text-white rounded-xl hover-scale font-medium shadow-lg"
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cart */}
              {cart.length > 0 && (
                <div className="gradient-warning rounded-2xl p-6 animate-slide-in-right">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="text-2xl">🛒</div>
                    <h3 className="text-xl font-bold text-gray-800">Shopping Cart</h3>
                  </div>
                  <div className="space-y-4 mb-6">
                    {cart.map((cartItem) => (
                      <div key={cartItem.item.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{cartItem.item.emoji}</div>
                          <div>
                            <span className="font-bold text-lg">{cartItem.item.name}</span>
                            <p className="text-gray-500">₹{cartItem.item.price} each</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateCartQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-lg">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="w-8 h-8 bg-green-100 text-green-600 rounded-full hover:bg-green-200 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                          <span className="ml-4 font-bold text-xl text-green-600">
                            ₹{cartItem.item.price * cartItem.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t-2 border-white">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">💰</div>
                      <span className="text-3xl font-bold text-gray-800">Total: ₹{calculateTotal()}</span>
                    </div>
                    <button
                      onClick={saveTransaction}
                      className="px-8 py-4 gradient-success text-white rounded-xl hover-scale font-bold text-lg shadow-lg flex items-center space-x-2"
                    >
                      <CreditCard className="w-6 h-6" />
                      <span>💳 Save Transaction</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Student Records Screen */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl card-glow">
              <div className="p-8 border-b-2 border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">📋</div>
                  <h2 className="text-2xl font-bold text-gray-800">Student Spending Records</h2>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="gradient-info">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        🎓 Admission No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        👤 Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        🏫 Class
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        📱 Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        💰 Total Spending
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        ⚖️ Pending Balance
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        🔍 Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={student.admissionNumber} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                          {student.admissionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {student.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          💰 ₹{student.totalSpending}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.pendingBalance > 0 ? (
                            <span className="text-red-600 font-bold">⚠️ ₹{student.pendingBalance}</span>
                          ) : (
                            <span className="text-green-600 font-bold">✅ ₹{student.pendingBalance}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => {
                              setSelectedStudentHistory(student);
                              setShowHistoryModal(true);
                            }}
                            className="inline-flex items-center px-4 py-2 gradient-primary text-white rounded-lg hover-scale shadow-md"
                          >
                            <Info className="w-4 h-4 mr-2" />
                            History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Screen */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl p-8 card-glow">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">📊</div>
                <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="daily">📅 Daily</option>
                    <option value="weekly">📆 Weekly</option>
                    <option value="monthly">📅 Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏫 Class Filter
                  </label>
                  <input
                    type="text"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    placeholder="e.g., 12-A"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🍽️ Item Filter
                  </label>
                  <input
                    type="text"
                    value={itemFilter}
                    onChange={(e) => setItemFilter(e.target.value)}
                    placeholder="e.g., Samosa"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end mb-6">
                <button className="px-6 py-3 gradient-success text-white rounded-xl hover-scale font-medium flex items-center shadow-lg">
                  
                  📥 Export CSV
                </button>
              </div>

              {/* Report Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="gradient-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        🎓 Admission No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        👤 Student Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        🏫 Class
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        📱 Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        🍽️ Items Purchased
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        💰 Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        📅 Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredTransactions().map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                          {transaction.admissionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {transaction.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.phoneNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.items.map(i => `${i.item.emoji} ${i.item.name} (${i.quantity})`).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          💰 ₹{transaction.totalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date} {transaction.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Menu Management Screen */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl card-glow">
              <div className="p-8 border-b-2 border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🍽️</div>
                  <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
                </div>
                <button
                  onClick={() => setShowAddItemModal(true)}
                  className="px-6 py-3 gradient-primary text-white rounded-xl hover-scale font-medium flex items-center shadow-lg"
                >
                  
                  ➕ Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="gradient-info">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        🍽️ Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        📂 Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        💰 Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        ⚙️ Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {editingItem?.id === item.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editingItem.emoji}
                                onChange={(e) => setEditingItem({...editingItem, emoji: e.target.value})}
                                className="w-12 px-2 py-1 border rounded text-center"
                                placeholder="🍽️"
                              />
                              <input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                className="px-3 py-1 border rounded"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{item.emoji}</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingItem?.id === item.id ? (
                            <select
                              value={editingItem.category}
                              onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                              className="px-3 py-1 border rounded"
                            >
                              <option value="Snacks">🍿 Snacks</option>
                              <option value="Main Course">🍽️ Main Course</option>
                              <option value="Beverages">🥤 Beverages</option>
                              <option value="Dessert">🍰 Dessert</option>
                            </select>
                          ) : (
                            <span className="flex items-center space-x-1">
                              <span>{getCategoryEmoji(item.category)}</span>
                              <span>{item.category}</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {editingItem?.id === item.id ? (
                            <input
                              type="number"
                              value={editingItem.price}
                              onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                              className="px-3 py-1 border rounded w-20"
                            />
                          ) : (
                            `💰 ₹${item.price}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            {editingItem?.id === item.id ? (
                              <>
                                <button
                                  onClick={() => editMenuItem(editingItem)}
                                  className="px-3 py-1 gradient-success text-white rounded hover-scale"
                                >
                                  ✅ Save
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                  ❌ Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingItem(item)}
                                  className="px-3 py-1 gradient-primary text-white rounded hover-scale"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => deleteMenuItem(item.id)}
                                  className="px-3 py-1 gradient-secondary text-white rounded hover-scale"
                                >
                                  🗑️ Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Purchase History Modal */}
      {showHistoryModal && selectedStudentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="gradient-primary p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">📊 Purchase History</h3>
                  <p className="text-purple-100">
                    👤 {selectedStudentHistory.name} ({selectedStudentHistory.admissionNumber}) - 🏫 {selectedStudentHistory.class}
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-white hover:text-purple-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="gradient-info">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        🍽️ Items
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        💰 Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        📅 Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        ⏰ Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getStudentHistory(selectedStudentHistory.admissionNumber).map((history) => (
                      <tr key={history.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {history.items}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-green-600">
                          💰 ₹{history.amount}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          📅 {history.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          ⏰ {history.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getStudentHistory(selectedStudentHistory.admissionNumber).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">📭</div>
                    No purchase history found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="gradient-primary p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">➕ Add New Menu Item</h3>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="text-white hover:text-purple-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🍽️ Item Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎨 Emoji
                  </label>
                  <input
                    type="text"
                    value={newItem.emoji}
                    onChange={(e) => setNewItem({...newItem, emoji: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="🍽️"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📂 Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select category</option>
                    <option value="Snacks">🍿 Snacks</option>
                    <option value="Main Course">🍽️ Main Course</option>
                    <option value="Beverages">🥤 Beverages</option>
                    <option value="Dessert">🍰 Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💰 Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter price"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={addMenuItem}
                  className="px-4 py-2 gradient-primary text-white rounded-xl hover-scale font-medium"
                >
                  ➕ Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}