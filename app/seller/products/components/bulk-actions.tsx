'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select
} from '@/components/ui/select'
import { Trash2, Edit, Download, Loader2 } from 'lucide-react'
import { Database } from '@/lib/supabase/database.types'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Product = Database['public']['Tables']['products']['Row']

interface BulkActionsProps {
  products: Product[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export default function BulkActions({
  products,
  selectedIds,
  onSelectionChange,
}: BulkActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [bulkUpdateData, setBulkUpdateData] = useState({
    discount: '',
    stock: '',
  })

  const allSelected = products.length > 0 && selectedIds.length === products.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < products.length

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(products.map((p) => p.id))
    }
  }

  const handleBulkDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const deletePromises = selectedIds.map((id) =>
        fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      )

      const responses = await Promise.all(deletePromises)
      const failedDeletes = responses.filter((r) => !r.ok)

      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} products`)
      }

      setShowDeleteDialog(false)
      onSelectionChange([])
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeleting(false)
    }
  }

  const handleBulkUpdate = async () => {
    setUpdating(true)
    setError('')

    try {
      const updates: Record<string, number> = {}
      if (bulkUpdateData.discount) updates.discount = parseFloat(bulkUpdateData.discount)
      if (bulkUpdateData.stock) updates.stock = parseInt(bulkUpdateData.stock)

      if (Object.keys(updates).length === 0) {
        throw new Error('Please specify at least one field to update')
      }

      const updatePromises = selectedIds.map((id) =>
        fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        })
      )

      const responses = await Promise.all(updatePromises)
      const failedUpdates = responses.filter((r) => !r.ok)

      if (failedUpdates.length > 0) {
        throw new Error(`Failed to update ${failedUpdates.length} products`)
      }

      setShowUpdateDialog(false)
      onSelectionChange([])
      setBulkUpdateData({ discount: '', stock: '' })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setUpdating(false)
    }
  }

  const exportToCSV = () => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id))
    
    const csvHeader = 'ID,Name,Category,Price,Discount,Stock,Rating\n'
    const csvRows = selectedProducts
      .map(
        (p) =>
          `${p.id},"${p.name}",${p.category},${p.price},${p.discount || 0},${p.stock},${p.rating || 0}`
      )
      .join('\n')

    const csv = csvHeader + csvRows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (products.length === 0) return null

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-4">
        <Checkbox
          checked={allSelected}
          onCheckedChange={toggleSelectAll}
        />
        <span className="text-sm font-medium">
          {selectedIds.length > 0
            ? `${selectedIds.length} selected`
            : 'Select all'}
        </span>

        {selectedIds.length > 0 && (
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpdateDialog(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Bulk Update
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.length} product(s)? This
              action cannot be undone.
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
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedIds.length} Products`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Update Products</DialogTitle>
            <DialogDescription>
              Update {selectedIds.length} product(s). Leave fields empty to keep
              current values.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-discount">Discount (%)</Label>
              <Input
                id="bulk-discount"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Leave empty to skip"
                value={bulkUpdateData.discount}
                onChange={(e) =>
                  setBulkUpdateData({ ...bulkUpdateData, discount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-stock">Stock</Label>
              <Input
                id="bulk-stock"
                type="number"
                min="0"
                placeholder="Leave empty to skip"
                value={bulkUpdateData.stock}
                onChange={(e) =>
                  setBulkUpdateData({ ...bulkUpdateData, stock: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUpdateDialog(false)
                setBulkUpdateData({ discount: '', stock: '' })
              }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                `Update ${selectedIds.length} Products`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
