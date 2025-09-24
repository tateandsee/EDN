'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wand2, 
  Settings, 
  Sparkles, 
  Zap, 
  Image as ImageIcon, 
  Video, 
  Music,
  FileText,
  Brain,
  Plus,
  Minus,
  Info
} from 'lucide-react'

const presetOptions = [
  {
    id: 'portrait',
    name: 'Professional Portrait',
    positive: 'Professional headshot, studio lighting, sharp focus, business attire, confident expression',
    negative: 'blurry, noisy, low quality, distorted, amateur, casual clothing'
  },
  {
    id: 'landscape',
    name: 'Beautiful Landscape',
    positive: 'Stunning landscape, golden hour, dramatic lighting, vibrant colors, professional photography',
    negative: 'urban, buildings, people, blurry, overexposed, dull colors'
  },
  {
    id: 'character',
    name: 'Character Design',
    positive: 'Original character design, detailed features, expressive, unique style, high quality art',
    negative: 'generic, copied style, low detail, poorly drawn, inconsistent'
  },
  {
    id: 'product',
    name: 'Product Photography',
    positive: 'Clean product shot, professional lighting, white background, sharp details, commercial quality',
    negative: 'cluttered, poor lighting, blurry, reflections, shadows on product'
  }
]

const loraModels = [
  {
    id: 'default',
    name: 'Expert General Purpose',
    description: 'Versatile model for most use cases',
    trainedOn: '1M+ diverse images',
    strength: 1.0
  },
  {
    id: 'portrait-pro',
    name: 'Portrait Professional',
    description: 'Specialized for portrait and character generation',
    trainedOn: '500K portrait images',
    strength: 1.0
  },
  {
    id: 'landscape-master',
    name: 'Landscape Master',
    description: 'Optimized for scenic and landscape photography',
    trainedOn: '300K landscape images',
    strength: 1.0
  },
  {
    id: 'artistic-vision',
    name: 'Artistic Vision',
    description: 'Creative and artistic style generation',
    trainedOn: '400K artistic works',
    strength: 1.0
  }
]

export default function CreatePage() {
  const [usePreset, setUsePreset] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState('portrait')
  const [positivePrompt, setPositivePrompt] = useState(presetOptions[0].positive)
  const [negativePrompt, setNegativePrompt] = useState(presetOptions[0].negative)
  const [selectedLora, setSelectedLora] = useState('default')
  const [loraStrength, setLoraStrength] = useState([1.0])
  const [contentType, setContentType] = useState('image')
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId)
    const preset = presetOptions.find(p => p.id === presetId)
    if (preset) {
      setPositivePrompt(preset.positive)
      setNegativePrompt(preset.negative)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const currentLora = loraModels.find(l => l.id === selectedLora)

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Wand2 className="h-10 w-10 text-primary" />
          Create Content
        </h1>
        <p className="text-xl text-muted-foreground">
          Generate amazing AI content with our advanced tools. Membership required for content generation.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Creation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Content Type
              </CardTitle>
              <CardDescription>Choose what type of content you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'image', icon: ImageIcon, label: 'Image' },
                  { id: 'video', icon: Video, label: 'Video' },
                  { id: 'music', icon: Music, label: 'Music' },
                  { id: 'text', icon: FileText, label: 'Text' }
                ].map((type) => (
                  <Button
                    key={type.id}
                    variant={contentType === type.id ? 'default' : 'outline'}
                    className="flex flex-col gap-2 h-auto py-4"
                    onClick={() => setContentType(type.id)}
                  >
                    <type.icon className="h-6 w-6" />
                    <span>{type.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preset/Custom Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Prompt Configuration
              </CardTitle>
              <CardDescription>Choose between preset configurations or custom prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="preset-mode"
                  checked={usePreset}
                  onCheckedChange={setUsePreset}
                />
                <Label htmlFor="preset-mode">Use Preset Configuration</Label>
                <div className="ml-auto">
                  <Badge variant={usePreset ? 'default' : 'secondary'}>
                    {usePreset ? 'Preset Mode' : 'Custom Mode'}
                  </Badge>
                </div>
              </div>

              {usePreset ? (
                <div className="space-y-4">
                  <Label>Select a preset configuration:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presetOptions.map((preset) => (
                      <Card 
                        key={preset.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedPreset === preset.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handlePresetChange(preset.id)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{preset.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {preset.positive}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <Info className="h-4 w-4 inline mr-2" />
                    Custom mode allows you to write your own prompts for complete control over the output.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prompts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Positive Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">
                  Positive Prompt
                </CardTitle>
                <CardDescription>
                  Describe what you want to generate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe the content you want to create..."
                  value={positivePrompt}
                  onChange={(e) => setPositivePrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {positivePrompt.length} characters
                </div>
              </CardContent>
            </Card>

            {/* Negative Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Negative Prompt
                </CardTitle>
                <CardDescription>
                  Describe what you want to avoid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe elements to avoid in the generation..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {negativePrompt.length} characters
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* LoRA Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                LoRA Model
              </CardTitle>
              <CardDescription>Choose your AI model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedLora} onValueChange={setSelectedLora}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a LoRA model" />
                </SelectTrigger>
                <SelectContent>
                  {loraModels.map((lora) => (
                    <SelectItem key={lora.id} value={lora.id}>
                      <div>
                        <div className="font-medium">{lora.name}</div>
                        <div className="text-xs text-muted-foreground">{lora.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentLora && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium text-sm">{currentLora.name}</div>
                    <div className="text-xs text-muted-foreground">{currentLora.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Trained on: {currentLora.trainedOn}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Model Strength: {loraStrength[0]}</Label>
                    <Slider
                      value={loraStrength}
                      onValueChange={setLoraStrength}
                      max={2}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtle</span>
                      <span>Balanced</span>
                      <span>Strong</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Fine-tune your generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Quality Level</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft (Fast)</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="high">High Quality</SelectItem>
                        <SelectItem value="ultra">Ultra Quality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Style Strength</Label>
                    <Slider defaultValue={[0.8]} max={1} min={0} step={0.1} className="w-full" />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Seed</Label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                        placeholder="Random"
                      />
                      <Button variant="outline" size="sm">
                        Random
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Steps</Label>
                    <Slider defaultValue={[20]} max={50} min={10} step={1} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Guidance Scale</Label>
                    <Slider defaultValue={[7.5]} max={20} min={1} step={0.5} className="w-full" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !positivePrompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
              
              {!positivePrompt.trim() && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Please enter a positive prompt to generate content
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}