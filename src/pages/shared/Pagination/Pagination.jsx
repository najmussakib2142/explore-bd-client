import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

export function usePaginatedQuery(key, url, extraParams = {}) {
  const axiosSecure = useAxiosSecure();

  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [key, currentPage, itemsPerPage, extraParams],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...extraParams,
      };

      const res = await axiosSecure.get(url, { params });
      return res.data;
    },
    keepPreviousData: true, // ✅ smooth transitions when switching pages
  });

  // Normalized response
  const items = data?.[key] ?? [];
  const totalPages = data?.totalPages || 0;

  // Handlers
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  const handleItemsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  return {
    items,
    totalPages,
    currentPage,
    itemsPerPage,
    isLoading,
    isError,
    refetch,
    setCurrentPage,
    handlePrevPage,
    handleNextPage,
    handleItemsPerPage,
  };
}
