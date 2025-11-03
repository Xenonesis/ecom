'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, FileText, Trash, Plus } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Template {
  name: string
  product_data: {
    category: string
    description: string
    price: number
    discount: number
    images: string[]
  }
  created_at: string
}

export default function ProductTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    const stored = localStorage.getItem('product_templates')
    if (stored) {
      setTemplates(JSON.parse(stored))
    }
  }

  const handleDeleteTemplate = () => {
    if (templateToDelete !== null) {
      const newTemplates = templates.filter((_, index) => index !== templateToDelete)
      localStorage.setItem('product_templates', JSON.stringify(newTemplates))
      setTemplates(newTemplates)
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  const handleUseTemplate = (template: Template) => {
    // Store template data in session storage for the new product page
    sessionStorage.setItem('product_template', JSON.stringify(template.product_data))
    router.push('/seller/products/new')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/seller/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Templates</h1>
          <p className="text-muted-foreground mt-2">
            Reuse product configurations to save time
          </p>
        </div>
        <Link href="/seller/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Product
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">
              Save product configurations as templates for quick reuse
            </p>
            <Link href="/seller/products">
              <Button variant="outline">Go to Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold truncate">{template.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setTemplateToDelete(index)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium text-foreground">
                      {template.product_data.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium text-foreground">
                      ₹{template.product_data.price}
                    </span>
                  </div>
                  {template.product_data.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="font-medium text-green-600">
                        {template.product_data.discount}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Images:</span>
                    <span className="font-medium text-foreground">
                      {template.product_data.images.length}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </div>

                <Button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
