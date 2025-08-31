import React, { useState } from 'react';
import { Plus, Upload, Calendar, X, Grid, Home, Camera, Search } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  date: string;
  uploadDate: Date;
}

const SchoolGalleryAdmin: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      title: 'Science Fair 2024',
      date: '2024-08-20',
      uploadDate: new Date('2024-08-20')
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
      title: 'Sports Day Championship',
      date: '2024-08-15',
      uploadDate: new Date('2024-08-15')
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop',
      title: 'Annual Cultural Program',
      date: '2024-08-10',
      uploadDate: new Date('2024-08-10')
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop',
      title: 'Mathematics Olympiad',
      date: '2024-08-05',
      uploadDate: new Date('2024-08-05')
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    image: null as File | null
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmitUpload = () => {
    if (uploadForm.image && uploadForm.title) {
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        src: URL.createObjectURL(uploadForm.image),
        title: uploadForm.title,
        date: uploadForm.date,
        uploadDate: new Date()
      };

      setImages(prev => [newImage, ...prev]);
      setUploadForm({ title: '', date: new Date().toISOString().split('T')[0], image: null });
      setShowUploadModal(false);
    }
  };

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  // Filter images based on search term and date
  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate === '' || image.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  // Get unique dates for the filter dropdown
  const uniqueDates = [...new Set(images.map(img => img.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setSelectedDate('');
    setShowDatePicker(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-cyan-100">
      
      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="lg:text-6xl text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              🎨 Gallery Collection
            </h2>
            <p className="text-gray-700 text-sm lg:text-xl lg:pt-3 font-medium">
              ✨ Manage and view all school event photos ✨
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-200/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1 lg:flex-none">
                <p className="text-blue-700 text-sm font-semibold bg-blue-100 px-4 py-2 rounded-full inline-block">
                  📊 Showing {filteredImages.length} of {images.length} images
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search by Name */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="🔍 Search by event name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500  bg-white/90 backdrop-blur-sm w-full sm:w-64 shadow-lg transition-all duration-300 hover:shadow-xl"
                  />
                </div>

                {/* Filter by Date - Calendar Icon */}
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`p-3 border-2 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl ${
                      selectedDate 
                        ? 'bg-gradient-to-r from-blue-400 to-indigo-500 border-blue-300 text-white shadow-blue-200' 
                        : 'bg-gradient-to-r from-white to-blue-50 border-blue-200 text-blue-600 hover:from-blue-50 hover:to-indigo-50'
                    }`}
                    title={selectedDate ? `Filtered by: ${new Date(selectedDate).toLocaleDateString()}` : 'Filter by date'}
                  >
                    <Calendar className="w-5 h-5" />
                  </button>

                  {/* Date Picker Dropdown */}
                  {showDatePicker && (
                    <div className="absolute top-full mt-3 right-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border-2 border-blue-200 p-6 z-[999999] min-w-72 backdrop-blur-md">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-blue-800 text-lg">📅 Select Date</h4>
                        <button
                          onClick={clearDateFilter}
                          className="text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                        >
                          Clear
                        </button>
                      </div>
                      
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateSelect(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 shadow-lg"
                      />
                      
                      {/* Quick Date Options */}
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-blue-600 font-semibold">🚀 Quick Options:</p>
                        <div className="flex flex-wrap gap-2">
                          {uniqueDates.slice(0, 5).map(date => (
                            <button
                              key={date}
                              onClick={() => handleDateSelect(date)}
                              className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                                selectedDate === date
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 text-white shadow-lg'
                                  : 'bg-gradient-to-r from-white to-blue-50 border-blue-200 text-blue-600 hover:from-blue-100 hover:to-indigo-100 hover:border-indigo-300'
                              }`}
                            >
                              {new Date(date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear All Filters Button */}
                {(searchTerm || selectedDate) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDate('');
                      setShowDatePicker(false);
                    }}
                    className="px-6 py-3 text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    🗑️ Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
           {/* Gallery Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group cursor-pointer transition-all duration-500 hover:scale-105 relative z-0"
                onClick={() => openImageModal(image)}
                style={{
                  animation: index === 0 ? 'fadeInScale 0.6s ease-out' : 'none'
                }}
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {index === 0 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-2 rounded-full font-bold animate-pulse">
                      🆕 New
                    </div>
                  )}
                </div>
                <div className="mt-4 p-6 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-xl   transition-all duration-300 group-hover:shadow-2xl">
                  <h3 className="font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors text-lg">
                    {image.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-2 rounded-full">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    {new Date(image.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-gray-500 text-xl mb-2 font-semibold">No images found</div>
              <p className="text-gray-400">
                Try adjusting your search terms or date filter
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-blue-600 hover:via-indigo-600 hover:to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
        style={{
          animation: 'fadeInScale 0.6s ease-out'
        }}
      >
        <Plus className="w-10 h-10" />
      </button>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 backdrop-blur-md rounded-3xl shadow-3xl max-w-md w-full p-8 ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ✨ Add New Picture
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">🎯 Event Title</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm shadow-lg"
                  placeholder="Enter event or activity name..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">📅 Date</label>
                <input
                  type="date"
                  value={uploadForm.date}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm shadow-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">🖼️ Upload Image</label>
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-indigo-50 hover:to-blue-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <Upload className="w-16 h-16 text-blue-400" />
                    <span className="text-blue-600 font-semibold text-lg">
                      {uploadForm.image ? uploadForm.image.name : 'Choose an image file'}
                    </span>
                    <span className="text-sm text-blue-500">PNG, JPG, JPEG up to 10MB</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitUpload}
                  disabled={!uploadForm.image || !uploadForm.title}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl rounded-xl text-white"
                >
                  🚀 Upload Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 backdrop-blur-md rounded-3xl shadow-3xl max-w-4xl max-h-[90vh] overflow-hidden border-2 border-blue-200">
            <div className="flex justify-between items-center p-6 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedImage.title}</h3>
                <p className="text-blue-600 flex items-center mt-1 font-semibold">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(selectedImage.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full max-h-96 object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SchoolGalleryAdmin;