import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiPlus, BiSearch, BiFilter } from 'react-icons/bi';
import StaffList from '../../components/staff/StaffList';
import Pagination from '../../components/common/Pagination';
import { getStaffs } from '../../api/staff';

const Staffs = () => {
  const location = useLocation();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    department: 'all',
  });
  const [message, setMessage] = useState(location.state?.message || null);

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const response = await getStaffs(page, search, filter);
      setStaffs(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to load staff members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [page, filter]);

  useEffect(() => {
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStaffs();
  };

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        <Link
          to="/staff/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <BiPlus className="mr-1" /> Add Staff
        </Link>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by ID or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <BiSearch className="text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
          >
            <BiFilter className="mr-1" /> Filter
          </button>
        </div>

        {showFilter && (
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                  <option value="technical">Technical</option>
                  <option value="support">Support</option>
                  <option value="facilities">Facilities</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={() => {
                  setFilter({
                    status: 'all',
                    department: 'all',
                  });
                }}
              >
                Reset
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={() => setShowFilter(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchStaffs}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        ) : staffs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No staff members found. Try adjusting your search or filters.
          </div>
        ) : (
          <StaffList staffs={staffs} onRefresh={fetchStaffs} />
        )}

        <div className="p-4 border-t">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Staffs;