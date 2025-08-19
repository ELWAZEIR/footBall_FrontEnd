import { useState } from 'react';

export interface FilterState {
  searchTerm: string;
  filterStatus: string;
  filterYear: string;
}

export const useFilters = (initialState: FilterState = {
  searchTerm: '',
  filterStatus: '',
  filterYear: '',
}) => {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialState);
  };

  const clearSearch = () => {
    setFilters(prev => ({
      ...prev,
      searchTerm: '',
    }));
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    clearSearch,
  };
};
