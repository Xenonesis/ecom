'use client'

import { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, Camera, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

interface Review {
  id: string
  userName: string
  rating: number
  title: string
  comment: string
  images: string[]
  helpful: number
  date: Date
  verified: boolean
}

interface ProductReviewsProps {
  productId: string
  averageRating: number
  totalReviews: number
  reviews: Review[]
}

export function ProductReviews({ productId, averageRating, totalReviews, reviews }: ProductReviewsProps) {
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [filter, setFilter] = useState<number | null>(null)

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  const filteredReviews = filter ? reviews.filter(r => r.rating === filter) : reviews

  const handleSubmitReview = () => {
    // Submit review logic here
    console.log({ rating, reviewTitle, reviewText, selectedImages })
    setShowWriteReview(false)
    setRating(0)
    setReviewTitle('')
    setReviewText('')
    setSelectedImages([])
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
                <div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {totalReviews} reviews
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowWriteReview(true)} className="mt-4">
                <MessageSquare className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setFilter(filter === stars ? null : stars)}
                  className={`flex items-center gap-2 w-full hover:bg-muted p-2 rounded transition-colors ${
                    filter === stars ? 'bg-muted' : ''
                  }`}
                >
                  <span className="text-sm font-medium w-8">{stars}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Progress 
                    value={(ratingDistribution[stars as keyof typeof ratingDistribution] / totalReviews) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {ratingDistribution[stars as keyof typeof ratingDistribution]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {review.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
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
                        <span className="text-sm text-muted-foreground">
                          {review.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-muted-foreground mb-4">{review.comment}</p>

                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((image, index) => (
                      <div key={index} className="relative h-20 w-20 rounded overflow-hidden">
                        <Image
                          src={image}
                          alt={`Review image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {filter ? `No ${filter}-star reviews yet` : 'No reviews yet'}
              </p>
              {filter && (
                <Button variant="link" onClick={() => setFilter(null)}>
                  Show all reviews
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Write Review Dialog */}
      <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Rating *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review *
              </label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={5}
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Add Photos (Optional)
              </label>
              <Button variant="outline" type="button">
                <Camera className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Help others by adding photos of your purchase
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowWriteReview(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitReview}
                disabled={!rating || !reviewTitle || !reviewText}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
