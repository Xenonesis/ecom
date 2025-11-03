'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  category: string
  minPrice: string
  maxPrice: string
  stockStatus: string
  sortBy: string
}

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Toys',
  'Beauty',
  'Automotive',
  'Groceries',
  'Health',
]

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    stockStatus: 'all',
    sortBy: 'newest',
  })

  const [showFilterDialog, setShowFilterDialog] = useState(false)

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleFilterApply = () => {
    onFilterChange(filters)
    setShowFilterDialog(false)
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      stockStatus: 'all',
      sortBy: 'newest',
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
    setShowFilterDialog(false)
  }

  const activeFiltersCount = [
    filters.category !== 'All',
    filters.minPrice !== '',
    filters.maxPrice !== '',
    filters.stockStatus !== 'all',
    filters.sortBy !== 'newest',
  ].filter(Boolean).length

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or description..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Filter Products</DialogTitle>
              <DialogDescription>
                Apply filters to refine your product list
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="filter-category">Category</Label>
                <select
                  id="filter-category"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-min-price">Min Price (₹)</Label>
                  <Input
                    id="filter-min-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-max-price">Max Price (₹)</Label>
                  <Input
                    id="filter-max-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Any"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-stock">Stock Status</Label>
                <select
                  id="filter-stock"
                  value={filters.stockStatus}
                  onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Products</option>
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="low_stock">Low Stock (&lt; 10)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-sort">Sort By</Label>
                <select
                  id="filter-sort"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                  <option value="stock_low">Stock: Low to High</option>
                  <option value="stock_high">Stock: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleFilterApply} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {filters.category !== 'All' && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              Category: {filters.category}
            </span>
          )}
          {filters.minPrice && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              Min: ₹{filters.minPrice}
            </span>
          )}
          {filters.maxPrice && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              Max: ₹{filters.maxPrice}
            </span>
          )}
          {filters.stockStatus !== 'all' && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              {filters.stockStatus === 'in_stock'
                ? 'In Stock'
                : filters.stockStatus === 'out_of_stock'
                ? 'Out of Stock'
                : 'Low Stock'}
            </span>
          )}
          {filters.sortBy !== 'newest' && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              Sort: {filters.sortBy.replace('_', ' ')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
