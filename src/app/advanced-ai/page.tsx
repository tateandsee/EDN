'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText, ResponsiveButton, ResponsiveCard } from "@/components/ui/responsive"
import { 
  Brain, 
  Upload, 
  Settings, 
  Play, 
  Pause, 
  Square, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Zap,
  Target,
  Layers,
  Database,
  Cpu,
  CheckCircle,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  Plus,
  Eye
} from "lucide-react"

interface TrainingModel {
  id: string
  name: string
  type: 'image' | 'video' | 'voice' | 'face'
  status: 'training' | 'completed' | 'failed' | 'paused'
  progress: number
  epochs: number
  currentEpoch: number
  accuracy?: number
  loss?: number
  datasetSize: number
  createdAt: string
  estimatedTime: string
  description: string
}

interface TrainingDataset {
  id: string
  name: string
  type: 'image' | 'video' | 'voice' | 'mixed'
  size: number
  fileCount: number
  uploadedAt: string
  status: 'uploading' | 'processing' | 'ready' | 'error'
  description: string
}

const mockTrainingModels: TrainingModel[] = [
  {
    id: '1',
    name: 'Custom Face Model v2',
    type: 'face',
    status: 'training',
    progress: 65,
    epochs: 100,
    currentEpoch: 65,
    accuracy: 94.2,
    loss: 0.085,
    datasetSize: 2500,
    createdAt: '2024-01-15T10:30:00Z',
    estimatedTime: '2h 15m',
    description: 'High-accuracy face cloning model with enhanced features'
  },
  {
    id: '2',
    name: 'Style Transfer Network',
    type: 'image',
    status: 'completed',
    progress: 100,
    epochs: 150,
    currentEpoch: 150,
    accuracy: 96.8,
    loss: 0.042,
    datasetSize: 5000,
    createdAt: '2024-01-10T14:20:00Z',
    estimatedTime: 'Completed',
    description: 'Advanced style transfer for artistic image generation'
  },
  {
    id: '3',
    name: 'Voice Synthesis Model',
    type: 'voice',
    status: 'paused',
    progress: 30,
    epochs: 80,
    currentEpoch: 24,
    accuracy: 87.5,
    loss: 0.125,
    datasetSize: 1500,
    createdAt: '2024-01-12T09:15:00Z',
    estimatedTime: '4h 30m',
    description: 'Multilingual voice synthesis with emotional tones'
  }
]

const mockDatasets: TrainingDataset[] = [
  {
    id: '1',
    name: 'Portrait Collection 2024',
    type: 'image',
    size: 2.5,
    fileCount: 1500,
    uploadedAt: '2024-01-14T16:30:00Z',
    status: 'ready',
    description: 'High-quality portrait images for face training'
  },
  {
    id: '2',
    name: 'Video Training Set',
    type: 'video',
    size: 8.3,
    fileCount: 250,
    uploadedAt: '2024-01-13T11:20:00Z',
    status: 'processing',
    description: 'Diverse video clips for motion and style learning'
  },
  {
    id: '3',
    name: 'Voice Samples Pack',
    type: 'voice',
    size: 1.2,
    fileCount: 800,
    uploadedAt: '2024-01-15T08:45:00Z',
    status: 'ready',
    description: 'Multilingual voice samples with various emotions'
  }
]

export default function AdvancedAIPage() {
  const [activeTab, setActiveTab] = useState('models')
  const [trainingModels, setTrainingModels] = useState<TrainingModel[]>(mockTrainingModels)
  const [datasets, setDatasets] = useState<TrainingDataset[]>(mockDatasets)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [isTraining, setIsTraining] = useState(false)

  const handleModelAction = (modelId: string, action: 'start' | 'pause' | 'stop') => {
    setTrainingModels(prev => prev.map(model => {
      if (model.id === modelId) {
        switch (action) {
          case 'start':
            return { ...model, status: 'training' as const }
          case 'pause':
            return { ...model, status: 'paused' as const }
          case 'stop':
            return { ...model, status: 'failed' as const, progress: 0 }
          default:
            return model
        }
      }
      return model
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'paused': return 'bg-yellow-500'
      case 'ready': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      case 'voice': return FileText
      case 'face': return Target
      default: return Brain
    }
  }

  const formatFileSize = (size: number) => {
    if (size < 1) return `${Math.round(size * 1024)} MB`
    return `${size.toFixed(1)} GB`
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
            Advanced AI Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Train custom AI models, manage datasets, and optimize your content creation with advanced machine learning capabilities
          </p>
        </div>

        {/* Quick Stats */}
        <ResponsiveGrid cols={1} mdCols={4} gap={4}>
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold">{trainingModels.filter(m => m.status === 'training').length}</p>
              </div>
              <Cpu className="h-8 w-8 text-blue-500" />
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold">{trainingModels.length}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Datasets</p>
                <p className="text-2xl font-bold">{datasets.length}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold">
                  {Math.round(trainingModels.reduce((acc, m) => acc + (m.accuracy || 0), 0) / trainingModels.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="models">Training Models</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          {/* Training Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Training Models</h2>
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="h-4 w-4 mr-2" />
                New Model
              </Button>
            </div>

            <ResponsiveGrid cols={1} lgCols={2} gap={6}>
              {trainingModels.map((model) => {
                const TypeIcon = getTypeIcon(model.type)
                return (
                  <Card key={model.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-6 w-6 text-purple-500" />
                          <div>
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                            <CardDescription>{model.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(model.status)}>
                          {model.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{model.progress}%</span>
                        </div>
                        <Progress value={model.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Epoch {model.currentEpoch}/{model.epochs}</span>
                          <span>{model.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Metrics */}
                      {model.accuracy && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span>Accuracy: {model.accuracy}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-blue-500" />
                            <span>Loss: {model.loss?.toFixed(3)}</span>
                          </div>
                        </div>
                      )}

                      {/* Dataset Info */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Database className="h-4 w-4" />
                        <span>{model.datasetSize.toLocaleString()} samples</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>Created {new Date(model.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {model.status === 'training' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleModelAction(model.id, 'pause')}
                            >
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleModelAction(model.id, 'stop')}
                            >
                              <Square className="h-4 w-4 mr-1" />
                              Stop
                            </Button>
                          </>
                        )}
                        {model.status === 'paused' && (
                          <Button 
                            size="sm"
                            onClick={() => handleModelAction(model.id, 'start')}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        )}
                        {model.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </ResponsiveGrid>
          </TabsContent>

          {/* Datasets Tab */}
          <TabsContent value="datasets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Training Datasets</h2>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Dataset
              </Button>
            </div>

            <ResponsiveGrid cols={1} lgCols={3} gap={6}>
              {datasets.map((dataset) => {
                const TypeIcon = getTypeIcon(dataset.type)
                return (
                  <Card key={dataset.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-6 w-6 text-blue-500" />
                          <div>
                            <CardTitle className="text-lg">{dataset.name}</CardTitle>
                            <CardDescription>{dataset.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(dataset.status)}>
                          {dataset.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">{formatFileSize(dataset.size)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Files</p>
                          <p className="font-medium">{dataset.fileCount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Uploaded {new Date(dataset.uploadedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </ResponsiveGrid>
          </TabsContent>

          {/* Create New Tab */}
          <TabsContent value="create" className="space-y-6">
            <h2 className="text-2xl font-bold">Create New Training Model</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Model Configuration</CardTitle>
                  <CardDescription>Configure your custom AI model parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model Name</label>
                    <input 
                      type="text" 
                      placeholder="My Custom Model"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="image">Image Generation</option>
                      <option value="video">Video Generation</option>
                      <option value="voice">Voice Synthesis</option>
                      <option value="face">Face Cloning</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Training Dataset</label>
                    <select className="w-full p-2 border rounded-md">
                      {datasets.filter(d => d.status === 'ready').map(dataset => (
                        <option key={dataset.id} value={dataset.id}>
                          {dataset.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Epochs</label>
                      <input 
                        type="number" 
                        defaultValue="100"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Batch Size</label>
                      <input 
                        type="number" 
                        defaultValue="32"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Optional advanced parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Learning Rate</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      defaultValue="0.001"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Optimizer</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="adam">Adam</option>
                      <option value="sgd">SGD</option>
                      <option value="rmsprop">RMSprop</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loss Function</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="mse">Mean Squared Error</option>
                      <option value="crossentropy">Cross Entropy</option>
                      <option value="huber">Huber Loss</option>
                    </select>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Advanced settings are optional. Default values will be used if not specified.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  )
}