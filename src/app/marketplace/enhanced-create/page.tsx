'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { enhancedFileUpload, type UploadedFile } from '@/lib/enhanced-file-upload'
import { enhancedContentModeration } from '@/lib/enhanced-content-moderation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Loader2, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Image as ImageIcon, 
  FileText,
  Video,
  Music,
  Trash2,
  Plus,
  Shield,
  Zap,
  Star,
  DollarSign,
  Tag,
  Eye,
  EyeOff
} from 'lucide-react'

interface MarketplaceFormData {
  title: string
  description: string
  type: string
  category: string
  price: string
  currency: string
  tags: string
  isNsfw: boolean
  positivePrompt: string
  negativePrompt: string
  promptConfig: string
}

interface UploadProgress {
  id: string
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'
  speed: number
  estimatedTimeRemaining: number
  error?: string
}

export default function EnhancedMarketplaceCreate() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  
  const [formData, setFormData] = useState<MarketplaceFormData>({
    title: '',
    description: '',
    type: '',
    category: '',
    price: '',
    currency: 'USD',
    tags: '',
    isNsfw: false,
    positivePrompt: '',
    negativePrompt: '',
    promptConfig: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    // Clean up upload progress on unmount
    return () => {
      uploadProgress.forEach(progress => {
        enhancedFileUpload.cancelUpload(progress.id)
      })
    }
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setLoading(true)
      setError(null)

      const options = {
        folder: 'marketplace',
        metadata: {
          purpose: 'marketplace_listing',
          uploadedBy: 'current_user' // Would come from auth context
        },
        onProgress: (progress: UploadProgress) => {
          setUploadProgress(prev => {
            const existing = prev.find(p => p.id === progress.id)
            if (existing) {
              return prev.map(p => p.id === progress.id ? progress : p)
            }
            return [...prev, progress]
          })
        }
      }

      const results = await enhancedFileUpload.uploadMultipleFiles(Array.from(files), options)
      
      setUploadedFiles(prev => [...prev, ...results])
      
      // Clear completed progress items after a delay
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.status !== 'completed'))
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files')
    } finally {
      setLoading(false)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleInputChange = (field: keyof MarketplaceFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }

    if (!formData.type) {
      errors.type = 'Type is required'
    }

    if (!formData.category) {
      errors.category = 'Category is required'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required'
    }

    if (uploadedFiles.length === 0) {
      errors.files = 'At least one file is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Prepare marketplace item data
      const itemData = {
        title: formData.title,
        description: formData.description,
        type: formData.type.toUpperCase(),
        category: formData.category.toUpperCase(),
        price: parseFloat(formData.price),
        currency: formData.currency,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isNsfw: formData.isNsfw,
        images: uploadedFiles.filter(f => f.mimeType.startsWith('image/')).map(f => f.url),
        pdfFile: uploadedFiles.find(f => f.mimeType === 'application/pdf')?.url,
        pdfFileName: uploadedFiles.find(f => f.mimeType === 'application/pdf')?.originalName,
        pdfFileSize: uploadedFiles.find(f => f.mimeType === 'application/pdf')?.fileSize,
        positivePrompt: formData.positivePrompt || undefined,
        negativePrompt: formData.negativePrompt || undefined,
        promptConfig: formData.promptConfig ? JSON.parse(formData.promptConfig) : undefined,
        fullPrompt: [formData.positivePrompt, formData.negativePrompt].filter(Boolean).join(' ')
      }

      // Submit to marketplace API
      const response = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer current_user_token` // Would come from auth context
        },
        body: JSON.stringify(itemData)
      })

      if (!response.ok) {
        throw new Error('Failed to create marketplace item')
      }

      const result = await response.json()
      
      setSuccess('Marketplace item created successfully!')
      
      // Redirect to the item page after a short delay
      setTimeout(() => {
        router.push(`/marketplace/${result.item.id}`)
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create marketplace item')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-8 h-8" />
    if (mimeType.startsWith('video/')) return <Video className="w-8 h-8" />
    if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8" />
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8" />
    return <FileText className="w-8 h-8" />
  }

  const getProgressColor = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading': return 'bg-blue-500'
      case 'processing': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'cancelled': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Marketplace Listing</h1>
        <p className="text-gray-600">List your digital content on the EDN marketplace</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-400 bg-green-400/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Listing</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Files
                </CardTitle>
                <CardDescription>
                  Upload images, videos, PDFs, or other digital content for your marketplace listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Supported formats: Images (JPG, PNG, GIF, WebP), Videos (MP4, MOV, AVI), PDFs
                  </p>
                  <Button type="button" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {validationErrors.files && (
                  <p className="text-sm text-red-600">{validationErrors.files}</p>
                )}

                {/* Upload Progress */}
                {uploadProgress.length > 0 && (
                  <div className="space-y-2">
                    {uploadProgress.map((progress) => (
                      <div key={progress.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {progress.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {progress.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                          {progress.status === 'cancelled' && <X className="w-5 h-5 text-gray-500" />}
                          {(progress.status === 'uploading' || progress.status === 'processing') && (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">{progress.fileName}</span>
                            <span className="text-xs text-gray-500">{progress.progress}%</span>
                          </div>
                          <Progress value={progress.progress} className="h-2" />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {formatFileSize(progress.speed * 1024)}/s
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.ceil(progress.estimatedTimeRemaining)}s remaining
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Uploaded Files</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="relative group">
                          <div className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.mimeType)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.originalName}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {file.thumbnailUrl && (
                              <img
                                src={file.thumbnailUrl}
                                alt="Thumbnail"
                                className="w-full h-20 object-cover rounded"
                              />
                            )}
                            
                            {file.moderationStatus && (
                              <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4" />
                                <Badge variant={
                                  file.moderationStatus === 'approved' ? 'default' :
                                  file.moderationStatus === 'flagged' ? 'destructive' : 'secondary'
                                }>
                                  {file.moderationStatus}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Provide details about your marketplace listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a descriptive title"
                      className={validationErrors.title ? 'border-red-500' : ''}
                    />
                    {validationErrors.title && (
                      <p className="text-sm text-red-600">{validationErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className={validationErrors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digital_art">Digital Art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="ebook">Ebook</SelectItem>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.type && (
                      <p className="text-sm text-red-600">{validationErrors.type}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.category && (
                      <p className="text-sm text-red-600">{validationErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      className={validationErrors.price ? 'border-red-500' : ''}
                    />
                    {validationErrors.price && (
                      <p className="text-sm text-red-600">{validationErrors.price}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your content in detail..."
                    rows={4}
                    className={validationErrors.description ? 'border-red-500' : ''}
                  />
                  {validationErrors.description && (
                    <p className="text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Example: digital, art, creative, high-quality
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="nsfw"
                    checked={formData.isNsfw}
                    onCheckedChange={(checked) => handleInputChange('isNsfw', checked)}
                  />
                  <Label htmlFor="nsfw">This content contains NSFW material</Label>
                </div>
              </CardContent>
            </Card>

            {/* AI Prompt Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI Prompt Configuration
                </CardTitle>
                <CardDescription>
                  Configure AI generation prompts (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="positivePrompt">Positive Prompt</Label>
                  <Textarea
                    id="positivePrompt"
                    value={formData.positivePrompt}
                    onChange={(e) => handleInputChange('positivePrompt', e.target.value)}
                    placeholder="Describe what you want to generate..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="negativePrompt">Negative Prompt</Label>
                  <Textarea
                    id="negativePrompt"
                    value={formData.negativePrompt}
                    onChange={(e) => handleInputChange('negativePrompt', e.target.value)}
                    placeholder="Describe what you want to avoid..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="promptConfig">Advanced Configuration (JSON)</Label>
                  <Textarea
                    id="promptConfig"
                    value={formData.promptConfig}
                    onChange={(e) => handleInputChange('promptConfig', e.target.value)}
                    placeholder='{"model": "stable-diffusion", "steps": 20, "cfg_scale": 7.5}'
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <DollarSign className="w-4 h-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Listing Preview</CardTitle>
              <CardDescription>
                This is how your marketplace listing will appear to buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{formData.title || 'Untitled Listing'}</h2>
                  <p className="text-3xl font-bold text-green-600">${formData.price || '0.00'}</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedFiles.slice(0, 3).map((file) => (
                      <div key={file.id} className="border rounded-lg overflow-hidden">
                        {file.thumbnailUrl ? (
                          <img
                            src={file.thumbnailUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            {getFileIcon(file.mimeType)}
                          </div>
                        )}
                      </div>
                    ))}
                    {uploadedFiles.length > 3 && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600">+{uploadedFiles.length - 3} more</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{formData.description || 'No description provided'}</p>
                </div>

                {formData.tags && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Type: {formData.type || 'Not specified'}</span>
                    <span className="text-sm text-gray-600">Category: {formData.category || 'Not specified'}</span>
                    {formData.isNsfw && (
                      <Badge variant="destructive">NSFW</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}