import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for pagination
 * 
 * @param {Function} fetchDataCallback - Async function to fetch data that accepts page, limit, and filters
 * @param {Object} initialFilters - Initial filter values
 * @param {number} initialPage - Initial page number (default: 1)
 * @param {number} initialLimit - Items per page (default: 10)
 */
const usePagination = (
  fetchDataCallback,
  initialFilters = {},
  initialPage = 1,
  initialLimit = 10
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  // Calculate total pages
  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / limit) || 1);
  }, [totalItems, limit]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchDataCallback(page, limit, filters);
      
      // The API should return an object with data array and total count
      // Adjust this based on your API response structure
      setData(response.data || []);
      setTotalItems(response.total || 0);
    } catch (err) {
      console.error('Pagination fetch error:', err);
      setError(err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchDataCallback, page, limit, filters]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle page change
  const handlePageChange = (newPage) => {
    // Ensure page is within bounds
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    // Reset to first page when changing limit
    setPage(1);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reset to first page when changing filters
    setPage(1);
  };

  // Manually refresh data
  const refreshData = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    page,
    limit,
    totalItems,
    totalPages,
    filters,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
    setFilters: handleFilterChange,
    refresh: refreshData
  };
};

export default usePagination;