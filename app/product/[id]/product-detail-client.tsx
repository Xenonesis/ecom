'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Plus, Minus, Upload, MessageSquare, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/product-card'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'

interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  stock: number
  images: string[]
  rating: number
  category: string
  seller_id: string
}

interface Review {
  id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  users: {
    name: string
  }
}

interface Props {
  product: Product
  reviews: Review[]
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, reviews, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const router = useRouter()

  const discountedPrice = product.price - (product.price * product.discount) / 100
  const totalPrice = discountedPrice * quantity

  const addToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      })

      if (response.ok) {
        alert('Added to cart!')
        router.refresh()
      } else if (response.status === 401) {
        router.push('/login?redirect=/product/' + product.id)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const toggleWishlist = async () => {
    try {
      if (isInWishlist) {
        const response = await fetch(`/api/wishlist?product_id=${product.id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setIsInWishlist(false)
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: product.id }),
        })
        if (response.ok) {
          setIsInWishlist(true)
        } else if (response.status === 401) {
          router.push('/login?redirect=/product/' + product.id)
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const submitReview = async () => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      })

      if (response.ok) {
        setNewReview({ rating: 5, comment: '' })
        router.refresh()
      } else if (response.status === 401) {
        router.push('/login?redirect=/product/' + product.id)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border-2">
            <Image
              src={product.images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover"
              priority
            />
            {product.discount > 0 && (
              <Badge className="absolute left-4 top-4 bg-red-500 hover:bg-red-600 text-base px-3 py-1">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-border hover:border-primary'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 25vw, 10vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...new Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">₹{discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-2xl text-muted-foreground line-through">
                  ₹{product.price.toFixed(2)}
                </span>
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  Save {product.discount}%
                </Badge>
              </>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-muted-foreground">Category:</span>
              <Badge variant="outline" className="ml-2">
                {product.category}
              </Badge>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Availability:</span>
              <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="ml-2">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <Label>Quantity:</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              Total: ₹{totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" size="lg" disabled={product.stock === 0} onClick={addToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant={isInWishlist ? 'default' : 'outline'}
              size="lg"
              className="px-4"
              onClick={toggleWishlist}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" size="lg" className="px-4" onClick={shareProduct}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid gap-3 sm:grid-cols-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Reviews, Q&A, and Related Products */}
      <Tabs defaultValue="reviews" className="mt-16">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
          <TabsTrigger value="related">Related Products</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6">
          {/* Add Review Form */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Comment</Label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this product..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Add Photos (Optional)</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm" type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </Button>
                    <span className="text-xs text-muted-foreground">Max 5 images</span>
                  </div>
                </div>
                <Button onClick={submitReview} disabled={!newReview.comment.trim()}>
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.users?.name || 'Anonymous'}</span>
                          <div className="flex items-center gap-1">
                            {[...new Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-muted-foreground">{review.comment}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review!
            </p>
          )}
        </TabsContent>

        <TabsContent value="qa" className="mt-6">
          {/* Ask a Question */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ask a Question
              </h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask a question about this product..."
                  rows={3}
                />
                <Button>
                  Submit Question
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questions & Answers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product Questions</h3>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No questions yet. Be the first to ask!</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="related" className="mt-6">
          {relatedProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No related products found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
