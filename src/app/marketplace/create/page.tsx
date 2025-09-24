'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Tag,
  DollarSign,
  Shield,
  Eye,
  Wand2,
  Save,
  X,
  Plus,
  Info,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react'
import Link from 'next/link'

interface FormData {
  title: string
  description: string
  type: string
  category: string
  price: string
  currency: string
  isNsfw: boolean
  tags: string[]
  customName: string
  style: string
  specialFeatures: string
  useCustomTitle: boolean
  
  // Prompt-related fields
  positivePrompt: string
  negativePrompt: string
  
  // File uploads
  images: File[]
  thumbnail: File | null
  pdfFile: File | null
}

const marketplaceTypes = [
  { value: 'AI_MODEL', label: 'AI Model' },
  { value: 'MENTORSHIP', label: 'Mentorship' },
  { value: 'TEMPLATE', label: 'Template' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'DIGITAL_GOOD', label: 'Digital Good' }
]

const marketplaceCategories = [
  { value: 'SFW', label: 'SFW Content' },
  { value: 'NSFW', label: 'NSFW Content' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'PROMPTS', label: 'Prompts' }
]

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' }
]

export default function CreateMarketplaceItemPage() {
  const { isNSFW } = useNSFW()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'AI_MODEL',
    category: isNSFW ? 'NSFW' : 'SFW',
    price: '25',
    currency: 'USD',
    isNsfw: isNSFW,
    tags: [],
    customName: '',
    style: '',
    specialFeatures: '',
    useCustomTitle: false,
    positivePrompt: '',
    negativePrompt: '',
    images: [],
    thumbnail: null,
    pdfFile: null
  })

  const colors = isNSFW ? {
    primary: '#FF1493',
    secondary: '#00CED1',
    accent: '#FF1744',
    bg: 'from-pink-900 via-purple-900 to-red-900',
    cardBg: 'rgba(30, 0, 30, 0.85)',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
  } : {
    primary: '#FF6B35',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#1A202C',
    textSecondary: '#2D3748',
  }

  // Handle form field changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }))
    }
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, pdfFile: file }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to create marketplace items')
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      
      // Basic fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('currency', formData.currency)
      formDataToSend.append('isNsfw', formData.isNsfw.toString())
      formDataToSend.append('tags', formData.tags.join(','))
      
      // Prompt-related fields
      formDataToSend.append('positivePrompt', formData.positivePrompt)
      formDataToSend.append('negativePrompt', formData.negativePrompt)
      
      // Files
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail)
      }
      
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image)
      })
      
      if (formData.pdfFile) {
        formDataToSend.append('pdfFile', formData.pdfFile)
      }

      const response = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
        },
        body: formDataToSend
      })

      if (response.ok) {
        const item = await response.json()
        alert('Marketplace item created successfully!')
        // Reset form or redirect
        window.location.href = `/marketplace/${item.id}`
      } else {
        const error = await response.json()
        alert(`Failed to create item: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating marketplace item:', error)
      alert('Failed to create marketplace item')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md" style={{ backgroundColor: colors.cardBg }}>
          <CardHeader>
            <CardTitle className="text-center" style={{ color: colors.textPrimary }}>
              Sign In Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4" style={{ color: colors.textSecondary }}>
              Please sign in to create marketplace items
            </p>
            <Link href="/auth/signin">
              <Button 
                className="w-full" 
                style={{ backgroundColor: colors.primary }}
              >
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-4" style={{ background: colors.bg }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Package className="h-8 w-8 mr-3" style={{ color: colors.primary }} />
            <h1 className="text-4xl font-bold" style={{ color: colors.textPrimary }}>
              Create Marketplace Item
            </h1>
          </div>
          <p className="text-lg" style={{ color: colors.textSecondary }}>
            The marketplace has been cleared. Be the first to list your AI models, prompts, or digital goods!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card style={{ backgroundColor: colors.cardBg }}>
              <CardHeader>
                <CardTitle style={{ color: colors.textPrimary }}>
                  Item Details
                </CardTitle>
                <CardDescription style={{ color: colors.textSecondary }}>
                  Configure your marketplace listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label style={{ color: colors.textSecondary }}>Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {marketplaceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label style={{ color: colors.textSecondary }}>Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {marketplaceCategories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label style={{ color: colors.textSecondary }}>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter item title"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}
                    />
                  </div>

                  <div>
                    <Label style={{ color: colors.textSecondary }}>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your item..."
                      rows={4}
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label style={{ color: colors.textSecondary }}>Price</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: colors.textSecondary }}>Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(currency => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label style={{ color: colors.textSecondary }}>Positive Prompt</Label>
                    <Textarea
                      value={formData.positivePrompt}
                      onChange={(e) => handleInputChange('positivePrompt', e.target.value)}
                      placeholder="Enter positive AI generation prompt..."
                      rows={3}
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}
                    />
                  </div>

                  <div>
                    <Label style={{ color: colors.textSecondary }}>Negative Prompt</Label>
                    <Textarea
                      value={formData.negativePrompt}
                      onChange={(e) => handleInputChange('negativePrompt', e.target.value)}
                      placeholder="Enter negative AI generation prompt..."
                      rows={3}
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}
                    />
                  </div>

                  <div>
                    <Label style={{ color: colors.textSecondary }}>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.textPrimary }}
                      />
                      <Button type="button" onClick={handleTagAdd} style={{ backgroundColor: colors.primary }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleTagRemove(tag)}>
                          {tag} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isNsfw}
                      onCheckedChange={(checked) => handleInputChange('isNsfw', checked)}
                    />
                    <Label style={{ color: colors.textSecondary }}>
                      NSFW Content
                    </Label>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Listing
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => window.location.href = '/marketplace'}
                      style={{ borderColor: colors.primary, color: colors.primary }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card style={{ backgroundColor: colors.cardBg }}>
              <CardHeader>
                <CardTitle style={{ color: colors.textPrimary }}>
                  <Info className="mr-2 h-5 w-5" />
                  Fresh Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <h4 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Marketplace Cleared
                    </h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      All previous listings have been removed. You're creating the first fresh listing in the new marketplace!
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <h4 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Best Practices
                    </h4>
                    <ul className="text-sm space-y-1" style={{ color: colors.textSecondary }}>
                      <li>• Use clear, descriptive titles</li>
                      <li>• Provide detailed descriptions</li>
                      <li>• Set competitive prices</li>
                      <li>• Add relevant tags for discoverability</li>
                      <li>• Include high-quality images</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <h4 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      What You Can Sell
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <Badge variant="outline" className="mb-1" style={{ borderColor: colors.primary, color: colors.primary }}>
                          AI Models
                        </Badge>
                        <p style={{ color: colors.textSecondary }}>Trained AI models</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1" style={{ borderColor: colors.primary, color: colors.primary }}>
                          Prompts
                        </Badge>
                        <p style={{ color: colors.textSecondary }}>AI generation prompts</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1" style={{ borderColor: colors.primary, color: colors.primary }}>
                          Templates
                        </Badge>
                        <p style={{ color: colors.textSecondary }}>Ready-to-use templates</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1" style={{ borderColor: colors.primary, color: colors.primary }}>
                          Digital Goods
                        </Badge>
                        <p style={{ color: colors.textSecondary }}>Digital products</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}