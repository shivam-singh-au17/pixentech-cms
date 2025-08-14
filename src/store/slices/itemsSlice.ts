import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Item {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'inactive' | 'draft'
  price?: number
  image?: string
  createdAt: string
  updatedAt: string
}

export interface ItemsFilters {
  search: string
  category: string
  status: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface ItemsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ItemsState {
  items: Item[]
  filters: ItemsFilters
  pagination: ItemsPagination
  loading: boolean
  error: string | null
  selectedItems: string[]
}

const initialState: ItemsState = {
  items: [],
  filters: {
    search: '',
    category: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
  selectedItems: [],
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    fetchItemsStart: state => {
      state.loading = true
      state.error = null
    },
    fetchItemsSuccess: (
      state,
      action: PayloadAction<{
        items: Item[]
        pagination: ItemsPagination
      }>
    ) => {
      state.loading = false
      state.items = action.payload.items
      state.pagination = action.payload.pagination
      state.error = null
    },
    fetchItemsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<ItemsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<ItemsPagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.unshift(action.payload)
      state.pagination.total += 1
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.pagination.total -= 1
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      const index = state.selectedItems.indexOf(itemId)
      if (index !== -1) {
        state.selectedItems.splice(index, 1)
      } else {
        state.selectedItems.push(itemId)
      }
    },
    selectAllItems: state => {
      state.selectedItems = state.items.map(item => item.id)
    },
    clearSelection: state => {
      state.selectedItems = []
    },
    clearError: state => {
      state.error = null
    },
  },
})

export const {
  fetchItemsStart,
  fetchItemsSuccess,
  fetchItemsFailure,
  setFilters,
  setPagination,
  addItem,
  updateItem,
  removeItem,
  toggleItemSelection,
  selectAllItems,
  clearSelection,
  clearError,
} = itemsSlice.actions

export default itemsSlice.reducer
