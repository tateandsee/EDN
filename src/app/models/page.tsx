'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, Eye, EyeOff, Star, Zap, Shield } from 'lucide-react'

interface ModelConfig {
  id: string
  name: string
  type: 'photorealistic' | 'artistic' | 'anime' | 'realistic'
  category: 'NSFW' | 'SFW' | 'BOTH'
  positivePrompt: string
  negativePrompt: string
  description: string
  features: string[]
  price: number
  isPremium: boolean
  rating: number
  downloads: number
  optimizedFor: string[]
  triggerWords: string[]
  recommendedSteps: number
  recommendedGuidance: number
}

const modelConfigs: ModelConfig[] = [
  {
    id: 'edn-photorealistic-nsfw-v2',
    name: 'EDN Photorealistic NSFW v2',
    type: 'photorealistic',
    category: 'NSFW',
    positivePrompt: 'masterpiece, best quality, ultra detailed, photorealistic, 8k, professional photography, cinematic lighting, detailed skin texture, natural anatomy, realistic proportions, high resolution, sharp focus, depth of field',
    negativePrompt: 'cartoon, anime, drawing, painting, illustration, 3d, render, blurry, low quality, deformed, ugly, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face',
    description: 'Advanced photorealistic model optimized for NSFW content creation with ultra-detailed skin textures and natural anatomy.',
    features: ['Ultra-detailed skin texture', 'Natural anatomy rendering', 'Cinematic lighting', 'Professional photography quality'],
    price: 29.99,
    isPremium: true,
    rating: 4.9,
    downloads: 15420,
    optimizedFor: ['Portrait', 'Full body', 'Close-up'],
    triggerWords: ['photorealistic', 'ultra detailed', 'high quality', 'realistic skin'],
    recommendedSteps: 30,
    recommendedGuidance: 7.5
  },
  {
    id: 'edn-beauty-portrait-v1',
    name: 'EDN Beauty Portrait v1',
    type: 'photorealistic',
    category: 'NSFW',
    positivePrompt: 'beauty portrait, detailed face, realistic skin, professional photography, studio lighting, high resolution, sharp focus, detailed eyes, natural makeup, flawless skin, photorealistic, 8k, ultra detailed',
    negativePrompt: 'ugly, deformed, blurry, low quality, bad anatomy, disfigured, poorly drawn face, mutation, malformed hands, blurry, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, unnatural skin texture',
    description: 'Specialized for beauty portraits with exceptional skin texture details and professional studio lighting.',
    features: ['Detailed facial features', 'Professional studio lighting', 'Natural skin texture', 'High-resolution output'],
    price: 24.99,
    isPremium: true,
    rating: 4.8,
    downloads: 12350,
    optimizedFor: ['Portrait', 'Close-up', 'Beauty shots'],
    triggerWords: ['beauty portrait', 'detailed face', 'realistic skin', 'studio lighting'],
    recommendedSteps: 25,
    recommendedGuidance: 7.0
  },
  {
    id: 'edn-body-anatomy-v1',
    name: 'EDN Body Anatomy v1',
    type: 'photorealistic',
    category: 'NSFW',
    positivePrompt: 'anatomically correct, realistic body, natural proportions, detailed anatomy, professional photography, high resolution, photorealistic, detailed skin texture, natural lighting, sharp focus, depth of field, ultra detailed',
    negativePrompt: 'unnatural, distorted, unrealistic, bad anatomy, disfigured, poorly drawn, mutation, mutated, extra limb, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, low quality, deformed, ugly, bad proportions',
    description: 'Anatomically accurate body rendering with natural proportions and detailed anatomy.',
    features: ['Anatomically accurate', 'Natural proportions', 'Detailed anatomy', 'Realistic body rendering'],
    price: 34.99,
    isPremium: true,
    rating: 4.7,
    downloads: 9870,
    optimizedFor: ['Full body', 'Anatomy study', 'Figure drawing'],
    triggerWords: ['anatomically correct', 'realistic body', 'natural proportions', 'detailed anatomy'],
    recommendedSteps: 35,
    recommendedGuidance: 8.0
  },
  {
    id: 'edn-photorealistic-sfw-v2',
    name: 'EDN Photorealistic SFW v2',
    type: 'photorealistic',
    category: 'SFW',
    positivePrompt: 'masterpiece, best quality, ultra detailed, photorealistic, 8k, professional photography, natural lighting, detailed textures, realistic, high resolution, sharp focus, depth of field, professional grade',
    negativePrompt: 'cartoon, anime, drawing, painting, illustration, 3d, render, blurry, low quality, deformed, ugly, bad anatomy, disfigured, poorly drawn, watermark, signature, cut off, low contrast, bad art, amateur',
    description: 'Professional photorealistic model for SFW content creation with exceptional detail and quality.',
    features: ['Professional photography quality', 'Natural lighting', 'Detailed textures', 'High-resolution output'],
    price: 19.99,
    isPremium: false,
    rating: 4.6,
    downloads: 8760,
    optimizedFor: ['General photography', 'Portraits', 'Landscapes'],
    triggerWords: ['photorealistic', 'professional photo', 'high resolution', 'detailed textures'],
    recommendedSteps: 30,
    recommendedGuidance: 7.5
  },
  {
    id: 'edn-fashion-model-v1',
    name: 'EDN Fashion Model v1',
    type: 'photorealistic',
    category: 'SFW',
    positivePrompt: 'fashion model, professional photography, high fashion, detailed clothing, studio lighting, high resolution, sharp focus, detailed features, photorealistic, 8k, ultra detailed, fashion photography',
    negativePrompt: 'casual, amateur, low quality, bad anatomy, disfigured, poorly drawn, blurry, watermark, signature, cut off, low contrast, bad lighting, unprofessional, distorted',
    description: 'Specialized for fashion and professional photography with detailed clothing and studio lighting.',
    features: ['Fashion photography', 'Detailed clothing', 'Professional studio lighting', 'High-fashion aesthetics'],
    price: 22.99,
    isPremium: false,
    rating: 4.5,
    downloads: 6540,
    optimizedFor: ['Fashion', 'Professional photography', 'Studio shots'],
    triggerWords: ['fashion model', 'professional photography', 'high fashion', 'studio lighting'],
    recommendedSteps: 28,
    recommendedGuidance: 7.2
  },
  {
    id: 'edn-universal-photoreal-v3',
    name: 'EDN Universal Photoreal v3',
    type: 'photorealistic',
    category: 'BOTH',
    positivePrompt: 'ultra realistic, 4k quality, professional grade, photorealistic, detailed textures, natural lighting, high resolution, sharp focus, depth of field, masterpiece, best quality, ultra detailed, professional photography',
    negativePrompt: 'low quality, amateur, unprofessional, cartoon, anime, drawing, painting, illustration, 3d, render, blurry, deformed, ugly, bad anatomy, watermark, signature, cut off',
    description: 'Universal photorealistic model suitable for both NSFW and SFW content with professional-grade quality.',
    features: ['Universal compatibility', 'Professional-grade quality', 'Versatile applications', 'Consistent results'],
    price: 39.99,
    isPremium: true,
    rating: 4.8,
    downloads: 11200,
    optimizedFor: ['All subjects', 'Mixed content', 'Professional use'],
    triggerWords: ['ultra realistic', '4k quality', 'professional grade', 'versatile'],
    recommendedSteps: 30,
    recommendedGuidance: 7.5
  }
]

export default function ModelsPage() {
  const [showPrompts, setShowPrompts] = useState<Record<string, boolean>>({})
  const [activeCategory, setActiveCategory] = useState<'all' | 'NSFW' | 'SFW' | 'BOTH'>('all')

  const togglePromptVisibility = (modelId: string) => {
    setShowPrompts(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }))
  }

  const filteredModels = activeCategory === 'all' 
    ? modelConfigs 
    : modelConfigs.filter(model => model.category === activeCategory || model.category === 'BOTH')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Models</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Browse our collection of premium AI models for photorealistic content creation
        </p>
        
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Models</TabsTrigger>
            <TabsTrigger value="NSFW">NSFW</TabsTrigger>
            <TabsTrigger value="SFW">SFW</TabsTrigger>
            <TabsTrigger value="BOTH">Universal</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModels.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{model.name}</CardTitle>
                    {model.isPremium && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <Badge variant="outline" className={
                      model.category === 'NSFW' ? 'border-red-200 text-red-700' :
                      model.category === 'SFW' ? 'border-green-200 text-green-700' :
                      'border-purple-200 text-purple-700'
                    }>
                      {model.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {model.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${model.price}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {model.rating} ({model.downloads.toLocaleString()})
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Key Features
                </h4>
                <div className="flex flex-wrap gap-1">
                  {model.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Technical Specs */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Steps:</span>
                    <span className="ml-1 font-medium">{model.recommendedSteps}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Guidance:</span>
                    <span className="ml-1 font-medium">{model.recommendedGuidance}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Optimized for:</span>
                    <span className="ml-1 font-medium">{model.optimizedFor.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* EDN Parent Configuration */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    EDN Parent Configuration
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePromptVisibility(model.id)}
                    className="h-8 px-2"
                  >
                    {showPrompts[model.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Positive Prompt */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Positive Prompt
                    </label>
                    <div className="relative">
                      <div className={`p-3 bg-muted rounded-md text-sm font-mono ${
                        showPrompts[model.id] ? '' : 'blur-sm select-none'
                      }`}>
                        {model.positivePrompt}
                      </div>
                      {!showPrompts[model.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                          <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded">
                            Prompt revealed after purchase
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Negative Prompt */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Negative Prompt
                    </label>
                    <div className="relative">
                      <div className={`p-3 bg-muted rounded-md text-sm font-mono ${
                        showPrompts[model.id] ? '' : 'blur-sm select-none'
                      }`}>
                        {model.negativePrompt}
                      </div>
                      {!showPrompts[model.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                          <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded">
                            Prompt revealed after purchase
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trigger Words */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Trigger Words
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {model.triggerWords.map((word, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  Purchase Model - ${model.price}
                </Button>
                <Button variant="outline">
                  Preview Samples
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No models found in the selected category.</p>
        </div>
      )}
    </div>
  )
}