'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash, Loader2 } from 'lucide-react'
import { Database } from '@/lib/supabase/database.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BulkActions from './components/bulk-actions'
import ProductFilters, { FilterState } from './components/product-filters'
import ProductStats from './components/product-stats'

type Product = Database['public']['Tables']['products']['Row']

interface SellerProductsClientProps {
  products: Product[]
}

export default function SellerProductsClient({ products }: SellerProductsClientProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    stockStatus: 'all',
    sortBy: 'newest',
  })

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
    setError('')
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/products?id=${productToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product')
      }

      setDeleteDialogOpen(false)
      setProductToDelete(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeleting(false)
    }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter((p) => p.category === filters.category)
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(filters.maxPrice))
    }

    // Stock status filter
    if (filters.stockStatus === 'in_stock') {
      filtered = filtered.filter((p) => p.stock > 0)
    } else if (filters.stockStatus === 'out_of_stock') {
      filtered = filtered.filter((p) => p.stock === 0)
    } else if (filters.stockStatus === 'low_stock') {
      filtered = filtered.filter((p) => p.stock > 0 && p.stock < 10)
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
        break
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateA - dateB
        })
        break
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'stock_low':
        filtered.sort((a, b) => a.stock - b.stock)
        break
      case 'stock_high':
        filtered.sort((a, b) => b.stock - a.stock)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    return filtered
  }, [products, filters])

  return (
    <>
      <ProductStats products={products} />
      
      <ProductFilters onFilterChange={setFilters} />

      <BulkActions
        products={filteredProducts}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <span className="font-medium">Price: ₹{product.price}</span>
                    {(product.discount ?? 0) > 0 && (
                      <span className="text-green-600">Discount: {product.discount}%</span>
                    )}
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      Stock: {product.stock}
                    </span>
                    <span>Rating: {(product.rating || 0).toFixed(1)} ⭐</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/seller/products/${product.id}/edit`}>
                    <Button variant="outline" size="icon" title="Edit product">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(product)}
                    title="Delete product"
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{productToDelete?.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
