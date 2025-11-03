'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, FileText, Loader2 } from 'lucide-react'
import { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductActionsProps {
  product: Product
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter()
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [error, setError] = useState('')
  const [newProductName, setNewProductName] = useState(`${product.name} (Copy)`)
  const [templateName, setTemplateName] = useState('')

  const handleDuplicate = async () => {
    setDuplicating(true)
    setError('')

    try {
      const duplicatedProduct = {
        name: newProductName,
        description: product.description,
        category: product.category,
        price: product.price,
        discount: product.discount || 0,
        stock: 0, // Reset stock for duplicated product
        images: product.images || [],
        visibility: 'draft', // Start as draft
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedProduct),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to duplicate product')
      }

      setDuplicateDialogOpen(false)
      router.refresh()
      router.push(`/seller/products/${data.product.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDuplicating(false)
    }
  }

  const handleSaveAsTemplate = async () => {
    setSavingTemplate(true)
    setError('')

    try {
      const template = {
        name: templateName,
        product_data: {
          category: product.category,
          description: product.description,
          price: product.price,
          discount: product.discount || 0,
          images: product.images || [],
        },
        created_at: new Date().toISOString(),
      }

      // Store in localStorage for now (could be moved to database)
      const templates = JSON.parse(localStorage.getItem('product_templates') || '[]')
      templates.push(template)
      localStorage.setItem('product_templates', JSON.stringify(templates))

      setTemplateDialogOpen(false)
      setTemplateName('')
      
      // Show success message (you could add a toast notification here)
      alert('Template saved successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSavingTemplate(false)
    }
  }

  return (
    <>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDuplicateDialogOpen(true)}
          title="Duplicate Product"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTemplateDialogOpen(true)}
          title="Save as Template"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      {/* Duplicate Dialog */}
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Product</DialogTitle>
            <DialogDescription>
              Create a copy of &quot;{product.name}&quot;. You can edit the copy after
              creation.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">New Product Name</Label>
              <Input
                id="new-name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>The duplicated product will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Copy all product details</li>
                <li>Start with 0 stock</li>
                <li>Be saved as draft</li>
                <li>Open in edit mode for you to review</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDuplicateDialogOpen(false)}
              disabled={duplicating}
            >
              Cancel
            </Button>
            <Button onClick={handleDuplicate} disabled={duplicating || !newProductName}>
              {duplicating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Duplicating...
                </>
              ) : (
                'Duplicate'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save as Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save this product configuration as a template for future use.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Electronics Product Template"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Template will save:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Category</li>
                <li>Description</li>
                <li>Price</li>
                <li>Discount</li>
                <li>Images</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTemplateDialogOpen(false)}
              disabled={savingTemplate}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAsTemplate} disabled={savingTemplate || !templateName}>
              {savingTemplate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Template'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
