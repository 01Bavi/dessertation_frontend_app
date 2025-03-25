import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUserTie } from 'react-icons/fa';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getAvailableStaff } from '../../services/complaint';

const AssignComplaintModal = ({ isOpen, onClose, onAssign, complaintId }) => {
  const [availableStaff, setAvailableStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setStaffLoading(true);
        const staff = await getAvailableStaff();
        setAvailableStaff(staff);
      } catch (error) {
        console.error('Error fetching available staff:', error);
      } finally {
        setStaffLoading(false);
      }
    };

    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

  // Validation schema
  const validationSchema = Yup.object({
    staffId: Yup.number().required('Please select a staff member'),
    note: Yup.string(),
  });

  // Initial form values
  const initialValues = {
    staffId: '',
    note: '',
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await onAssign(complaintId, parseInt(values.staffId), values.note);
      onClose();
    } catch (error) {
      console.error('Error assigning complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Complaint" size="md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            {staffLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading available staff...</p>
              </div>
            ) : availableStaff.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No active staff members available. Please add or activate staff members first.
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Staff Member *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserTie className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      as="select"
                      name="staffId"
                      id="staffId"
                      className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.staffId && touched.staffId ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select Staff Member</option>
                      {availableStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} - {staff.department || 'No Department'}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="staffId"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Note (Optional)
                  </label>
                  <Field
                    as="textarea"
                    name="note"
                    id="note"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Add any specific instructions or context for the staff member..."
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="light" onClick={onClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                    disabled={isSubmitting || loading}
                  >
                    Assign Complaint
                  </Button>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AssignComplaintModal;