import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';

const AssignComplaintModal = ({ 
  isOpen, 
  onClose, 
  onAssign, 
  complaintId,
  staffList,
  isLoading
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStaff, setFilteredStaff] = useState([]);

  useEffect(() => {
    if (staffList) {
      if (searchTerm) {
        const filtered = staffList.filter(staff => 
          staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStaff(filtered);
      } else {
        setFilteredStaff(staffList);
      }
    }
  }, [staffList, searchTerm]);

  // Reset selected staff when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStaffId('');
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleAssign = () => {
    if (selectedStaffId) {
      onAssign(complaintId, selectedStaffId);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Complaint to Staff"
      size="md"
      footer={
        <>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedStaffId || isLoading}
            isLoading={isLoading}
          >
            Assign
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="ml-3"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Select a staff member to assign this complaint to. The staff member will be notified.
        </p>
        
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search staff by name, email or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredStaff && filteredStaff.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredStaff.map((staff) => (
              <div 
                key={staff.id} 
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedStaffId === staff.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedStaffId(staff.id)}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {staff.avatar ? (
                      <img src={staff.avatar} alt={staff.name} className="h-10 w-10 object-cover" />
                    ) : (
                      <span className="text-gray-500 font-medium">{staff.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                    <p className="text-xs text-gray-500">{staff.email}</p>
                    <p className="text-xs text-gray-500">{staff.department}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      staff.activeComplaints < 3 ? 'bg-green-100 text-green-800' : 
                      staff.activeComplaints < 6 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {staff.activeComplaints} active complaints
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      staff.responseRate >= 80 ? 'bg-green-100 text-green-800' : 
                      staff.responseRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {staff.responseRate}% response rate
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            {searchTerm ? 'No staff members found matching your search.' : 'No staff members available.'}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignComplaintModal;