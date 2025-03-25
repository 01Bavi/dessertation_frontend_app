import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { createStaff } from '../services/staff';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const StaffCreate = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    mobile_no: Yup.string().required('Mobile number is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    id_no: Yup.string().required('Staff ID is required'),
    date_of_birth: Yup.date().required('Date of birth is required'),
    nic_no: Yup.string().required('NIC number is required'),
    is_active: Yup.boolean().required('Status is required'),
  });

  // Initial form values
  const initialValues = {
    name: '',
    mobile_no: '',
    email: '',
    id_no: '',
    date_of_birth: '',
    nic_no: '',
    department: '',
    specialization: '',
    image_url: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    is_active: true,
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await createStaff(values);
      toast.success('Staff member created successfully');
      navigate('/staff');
    } catch (error) {
      toast.error(error.message || 'Failed to create staff member');
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Button
          variant="light"
          icon={<FaArrowLeft />}
          onClick={() => navigate('/staff')}
          className="mr-4"
        >
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Staff</h1>
      </div>

      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Basic Information Section */}
                <div className="md:col-span-2 mb-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.name && touched.name ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Staff ID */}
                <div>
                  <label htmlFor="id_no" className="block text-sm font-medium text-gray-700">
                    Staff ID *
                  </label>
                  <Field
                    type="text"
                    name="id_no"
                    id="id_no"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.id_no && touched.id_no ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage name="id_no" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* NIC Number */}
                <div>
                  <label htmlFor="nic_no" className="block text-sm font-medium text-gray-700">
                    NIC Number *
                  </label>
                  <Field
                    type="text"
                    name="nic_no"
                    id="nic_no"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.nic_no && touched.nic_no ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage name="nic_no" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                    Date of Birth *
                  </label>
                  <Field
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.date_of_birth && touched.date_of_birth ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage name="date_of_birth" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.email && touched.email ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <Field
                    type="text"
                    name="mobile_no"
                    id="mobile_no"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.mobile_no && touched.mobile_no ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage name="mobile_no" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <Field
                    type="text"
                    name="department"
                    id="department"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <Field
                    type="text"
                    name="specialization"
                    id="specialization"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <Field
                    as="select"
                    name="is_active"
                    id="is_active"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.is_active && touched.is_active ? 'border-red-500' : ''
                    }`}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                  <ErrorMessage name="is_active" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Address Information Section */}
                <div className="md:col-span-2 mt-4 mb-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Address Information</h2>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Field
                    type="text"
                    name="address"
                    id="address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <Field
                    type="text"
                    name="city"
                    id="city"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <Field
                    type="text"
                    name="state"
                    id="state"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                    Zip/Postal Code
                  </label>
                  <Field
                    type="text"
                    name="zip"
                    id="zip"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                    Profile Image URL
                  </label>
                  <Field
                    type="text"
                    name="image_url"
                    id="image_url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Link to="/staff">
                  <Button variant="light" icon={<FaTimes />}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<FaSave />}
                  isLoading={submitting}
                  disabled={isSubmitting}
                >
                  Create Staff
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default StaffCreate;