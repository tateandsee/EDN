'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

interface Model {
  id: string
  name: string
  age: number
  ethnicity: string
  style: string
  specialty: string
  rating: number
  likes: number
  description: string
  tags: string[]
}

const models: Model[] = [
  {
    id: '1',
    name: 'Sofia Rodriguez',
    age: 24,
    ethnicity: 'Latina',
    style: 'Glamour',
    specialty: 'Fashion & Beauty',
    rating: 4.9,
    likes: 15420,
    description: 'Stunning Latina model with captivating features and elegant presence',
    tags: ['fashion', 'beauty', 'glamour', 'elegant']
  },
  {
    id: '2',
    name: 'Yuki Tanaka',
    age: 25,
    ethnicity: 'East Asian',
    style: 'Kawaii',
    specialty: 'Cute & Playful',
    rating: 4.8,
    likes: 12890,
    description: 'Adorable East Asian model with perfect features and charming personality',
    tags: ['cute', 'playful', 'kawaii', 'sweet']
  },
  {
    id: '3',
    name: 'Amara Okafor',
    age: 23,
    ethnicity: 'African',
    style: 'Exotic',
    specialty: 'High Fashion',
    rating: 4.9,
    likes: 18750,
    description: 'Exquisite African model with striking features and high fashion appeal',
    tags: ['exotic', 'high-fashion', 'striking', 'elegant']
  },
  {
    id: '4',
    name: 'Emma Svensson',
    age: 26,
    ethnicity: 'Scandinavian',
    style: 'Natural',
    specialty: 'Lifestyle & Fitness',
    rating: 4.7,
    likes: 11340,
    description: 'Natural Scandinavian beauty with perfect physique and healthy glow',
    tags: ['natural', 'fitness', 'lifestyle', 'healthy']
  },
  {
    id: '5',
    name: 'Priya Sharma',
    age: 24,
    ethnicity: 'South Asian',
    style: 'Bollywood',
    specialty: 'Traditional & Modern',
    rating: 4.8,
    likes: 14230,
    description: 'Graceful South Asian model blending traditional beauty with modern style',
    tags: ['bollywood', 'traditional', 'modern', 'graceful']
  },
  {
    id: '6',
    name: 'Isabella Rossi',
    age: 25,
    ethnicity: 'Mediterranean',
    style: 'Sensual',
    specialty: 'Artistic Nude',
    rating: 4.9,
    likes: 22100,
    description: 'Passionate Mediterranean model with artistic sensibility and perfect form',
    tags: ['sensual', 'artistic', 'passionate', 'mediterranean']
  },
  {
    id: '7',
    name: 'Zara Johnson',
    age: 23,
    ethnicity: 'Mixed Heritage',
    style: 'Urban',
    specialty: 'Street Fashion',
    rating: 4.6,
    likes: 9870,
    description: 'Trendy mixed-heritage model with urban edge and versatile looks',
    tags: ['urban', 'street-fashion', 'trendy', 'versatile']
  },
  {
    id: '8',
    name: 'Nadia Petrova',
    age: 24,
    ethnicity: 'Slavic',
    style: 'Classic',
    specialty: 'Fine Art',
    rating: 4.8,
    likes: 16540,
    description: 'Classic Slavic beauty with refined features and artistic presence',
    tags: ['classic', 'fine-art', 'refined', 'timeless']
  },
  {
    id: '9',
    name: 'Aisha Al-Fayed',
    age: 25,
    ethnicity: 'Middle Eastern',
    style: 'Mystical',
    specialty: 'Cultural Heritage',
    rating: 4.7,
    likes: 13200,
    description: 'Enchanting Middle Eastern beauty with exotic features and cultural grace',
    tags: ['mystical', 'cultural', 'exotic', 'graceful']
  },
  {
    id: '10',
    name: 'Luna Martinez',
    age: 23,
    ethnicity: 'Latina',
    style: 'Alternative',
    specialty: 'Edgy Fashion',
    rating: 4.5,
    likes: 8900,
    description: 'Bold Latina model with alternative style and edgy fashion sense',
    tags: ['alternative', 'edgy', 'bold', 'fashion']
  },
  {
    id: '11',
    name: 'Mei Lin',
    age: 26,
    ethnicity: 'East Asian',
    style: 'Sophisticated',
    specialty: 'Luxury Fashion',
    rating: 4.9,
    likes: 17800,
    description: 'Elegant East Asian model with sophisticated style and luxury appeal',
    tags: ['sophisticated', 'luxury', 'elegant', 'high-end']
  },
  {
    id: '12',
    name: 'Nia Williams',
    age: 24,
    ethnicity: 'African',
    style: 'Athletic',
    specialty: 'Sports & Fitness',
    rating: 4.8,
    likes: 15600,
    description: 'Powerful African model with athletic build and dynamic presence',
    tags: ['athletic', 'fitness', 'sports', 'powerful']
  },
  {
    id: '13',
    name: 'Freja Andersen',
    age: 25,
    ethnicity: 'Scandinavian',
    style: 'Minimalist',
    specialty: 'Modern Art',
    rating: 4.6,
    likes: 10200,
    description: 'Minimalist Scandinavian beauty with clean lines and modern aesthetic',
    tags: ['minimalist', 'modern', 'clean', 'artistic']
  },
  {
    id: '14',
    name: 'Ananya Patel',
    age: 23,
    ethnicity: 'South Asian',
    style: 'Contemporary',
    specialty: 'Fusion Fashion',
    rating: 4.7,
    likes: 11900,
    description: 'Modern South Asian model blending contemporary and traditional elements',
    tags: ['contemporary', 'fusion', 'modern', 'innovative']
  },
  {
    id: '15',
    name: 'Elena Kostas',
    age: 26,
    ethnicity: 'Mediterranean',
    style: 'Romantic',
    specialty: 'Boudoir',
    rating: 4.8,
    likes: 19500,
    description: 'Romantic Mediterranean model with sensual charm and intimate appeal',
    tags: ['romantic', 'sensual', 'intimate', 'passionate']
  },
  {
    id: '16',
    name: 'Maya Chen',
    age: 24,
    ethnicity: 'Mixed Heritage',
    style: 'Avant-garde',
    specialty: 'High Fashion',
    rating: 4.9,
    likes: 14300,
    description: 'Innovative mixed-heritage model pushing boundaries with avant-garde style',
    tags: ['avant-garde', 'innovative', 'fashion-forward', 'unique']
  },
  {
    id: '17',
    name: 'Olga Volkov',
    age: 25,
    ethnicity: 'Slavic',
    style: 'Dramatic',
    specialty: 'Editorial',
    rating: 4.7,
    likes: 12800,
    description: 'Dramatic Slavic model with striking features and editorial presence',
    tags: ['dramatic', 'editorial', 'striking', 'bold']
  },
  {
    id: '18',
    name: 'Leila Hassan',
    age: 23,
    ethnicity: 'Middle Eastern',
    style: 'Ethereal',
    specialty: 'Fantasy Art',
    rating: 4.8,
    likes: 16100,
    description: 'Ethereal Middle Eastern beauty with otherworldly charm and grace',
    tags: ['ethereal', 'fantasy', 'dreamy', 'magical']
  },
  {
    id: '19',
    name: 'Camila Silva',
    age: 26,
    ethnicity: 'Latina',
    style: 'Tropical',
    specialty: 'Beach & Swimwear',
    rating: 4.6,
    likes: 13400,
    description: 'Vibrant Latina model with tropical vibe and beach-ready physique',
    tags: ['tropical', 'beach', 'vibrant', 'sunny']
  },
  {
    id: '20',
    name: 'Hiroshi Tanaka',
    age: 24,
    ethnicity: 'East Asian',
    style: 'Street',
    specialty: 'Urban Culture',
    rating: 4.5,
    likes: 9800,
    description: 'Cool East Asian model with street style and urban cultural influence',
    tags: ['street', 'urban', 'cool', 'cultural']
  },
  {
    id: '21',
    name: 'Kofi Osei',
    age: 25,
    ethnicity: 'African',
    style: 'Regal',
    specialty: 'Cultural Heritage',
    rating: 4.9,
    likes: 17200,
    description: 'Regal African model with noble presence and cultural significance',
    tags: ['regal', 'cultural', 'noble', 'majestic']
  },
  {
    id: '22',
    name: 'Ingrid Larsson',
    age: 23,
    ethnicity: 'Scandinavian',
    style: 'Nordic',
    specialty: 'Outdoor Adventure',
    rating: 4.7,
    likes: 11500,
    description: 'Nordic Scandinavian model with outdoor spirit and adventurous nature',
    tags: ['nordic', 'outdoor', 'adventure', 'natural']
  },
  {
    id: '23',
    name: 'Raj Singh',
    age: 26,
    ethnicity: 'South Asian',
    style: 'Royal',
    specialty: 'Traditional Couture',
    rating: 4.8,
    likes: 18900,
    description: 'Royal South Asian model with traditional elegance and couture presence',
    tags: ['royal', 'traditional', 'couture', 'elegant']
  }
]

export function MarketplaceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setDirection('right')
    setCurrentIndex((prevIndex) => (prevIndex + 1) % models.length)
  }

  const prevSlide = () => {
    setDirection('left')
    setCurrentIndex((prevIndex) => (prevIndex - 1 + models.length) % models.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left')
    setCurrentIndex(index)
  }

  // Get number of visible models based on screen size
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 3
    
    const width = window.innerWidth
    if (width < 640) return 3      // sm: 3 models
    if (width < 1024) return 4     // md: 4 models  
    return 5                       // lg+: 5 models
  }

  // Get visible models based on current index and screen size
  const getVisibleModels = () => {
    const visibleCount = getVisibleCount()
    const result = []
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % models.length
      result.push({ model: models[index], position: i, visibleCount })
    }
    
    return result
  }

  const visibleModels = getVisibleModels()
  const visibleCount = getVisibleCount()

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Model Marketplace
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Discover stunning AI-generated models from diverse backgrounds, each with unique beauty and perfect features
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Carousel Container */}
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex gap-3 md:gap-4 items-center justify-center">
            {visibleModels.map(({ model, position, visibleCount }, index) => (
              <motion.div
                key={`${model.id}-${currentIndex}`}
                initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: position === Math.floor(visibleCount / 2) ? 1 : 0.85 - (Math.abs(position - Math.floor(visibleCount / 2)) * 0.1)
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => goToSlide((currentIndex + position) % models.length)}
              >
                <div className="relative w-48 h-60 sm:w-52 sm:h-64 md:w-56 md:h-72 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
                  {/* Model Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Model Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 md:p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-bold text-white mb-1 truncate">
                          {model.name}
                        </h3>
                        <p className="text-white/80 text-xs mb-1">
                          {model.age} • {model.ethnicity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold text-xs">
                          {model.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {model.style}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-pink-500/20 text-pink-300 border-pink-500/30">
                        {model.specialty}
                      </Badge>
                    </div>

                    <p className="text-white/90 text-xs mb-2 line-clamp-2">
                      {model.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span className="text-white/80 text-xs">
                          {model.likes.toLocaleString()}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs px-2 py-1"
                      >
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="absolute top-2 left-2 right-2">
                    <div className="flex flex-wrap gap-1">
                      {model.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full backdrop-blur-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {models.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-white/60 hover:text-white text-xs"
          >
            {isAutoPlaying ? 'Pause' : 'Play'} Auto-play
          </Button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
        >
          Explore Full Marketplace
        </Button>
      </div>
    </div>
  )
}