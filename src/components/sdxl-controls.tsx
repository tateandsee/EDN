'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Settings, 
  Zap, 
  Layers, 
  Palette, 
  Image as ImageIcon, 
  Plus, 
  Minus,
  ChevronDown,
  Info,
  Sparkles,
  Cpu
} from 'lucide-react'

interface SDXLControlsProps {
  onConfigChange: (config: SDXLConfig) => void
  onGenerate: (useSDXL: boolean) => void
  isNSFW: boolean
  colors: any
}

interface SDXLConfig {
  model: 'stable-diffusion-xl-pro' | 'stable-diffusion-xl-turbo' | 'stable-diffusion-xl-refiner'
  resolution: string
  steps: number
  guidance: number
  sampler: string
  scheduler: string
  stylePreset?: string
  qualityPreset?: string
  batchSize: number
  loraConfigs: Array<{
    name: string
    weight: number
    triggerWord?: string
    strength: number
  }>
  useCustomPrompt: boolean
  positivePrompt: string
  negativePrompt: string
  unrestrictedNSFW?: boolean
  femaleOnly?: boolean
  ageRange?: string
  contentRestrictions?: {
    noChildren: boolean
    noMen: boolean
    noAnimals: boolean
    noPain: boolean
  }
}

interface SDXLModel {
  id: string
  name: string
  description: string
  maxResolution: string
  recommendedFor: string[]
}

interface LoRAModel {
  id: string
  name: string
  description: string
  triggerWord?: string
  category: string
  recommendedWeight: number
}

export function SDXLControls({ onConfigChange, onGenerate, isNSFW, colors }: SDXLControlsProps) {
  const [config, setConfig] = useState<SDXLConfig>({
    model: 'stable-diffusion-xl-pro',
    resolution: '1024x1024',
    steps: 30,
    guidance: 7.5,
    sampler: 'DPM++ 2M Karras',
    scheduler: 'Karras',
    stylePreset: 'photorealistic',
    qualityPreset: 'high',
    batchSize: 1,
    loraConfigs: [],
    useCustomPrompt: false,
    positivePrompt: '',
    negativePrompt: '',
    unrestrictedNSFW: false,
    femaleOnly: false,
    ageRange: '18-40',
    contentRestrictions: {
      noChildren: true,
      noMen: true,
      noAnimals: true,
      noPain: true
    }
  })

  const [availableModels, setAvailableModels] = useState<SDXLModel[]>([])
  const [availableLoRAs, setAvailableLoRAs] = useState<LoRAModel[]>([])
  const [stylePresets, setStylePresets] = useState<any[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showLoRA, setShowLoRA] = useState(false)

  useEffect(() => {
    // Load SDXL configuration
    loadSDXLConfig()
  }, [])

  const loadSDXLConfig = async () => {
    try {
      const response = await fetch('/api/sdxl/models?type=all')
      const data = await response.json()
      
      if (data.success) {
        setAvailableModels(data.data.models || [])
        setAvailableLoRAs(data.data.loraModels || [])
        setStylePresets(data.data.stylePresets || [])
      }
    } catch (error) {
      console.error('Failed to load SDXL config:', error)
    }
  }

  useEffect(() => {
    onConfigChange(config)
  }, [config, onConfigChange])

  const updateConfig = (updates: Partial<SDXLConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const addLoRA = (lora: LoRAModel) => {
    const newLoRA = {
      name: lora.id,
      weight: lora.recommendedWeight,
      triggerWord: lora.triggerWord,
      strength: 1.0
    }
    
    updateConfig({
      loraConfigs: [...config.loraConfigs, newLoRA]
    })
  }

  const removeLoRA = (index: number) => {
    updateConfig({
      loraConfigs: config.loraConfigs.filter((_, i) => i !== index)
    })
  }

  const updateLoRA = (index: number, updates: any) => {
    const newLoRAs = [...config.loraConfigs]
    newLoRAs[index] = { ...newLoRAs[index], ...updates }
    updateConfig({ loraConfigs: newLoRAs })
  }

  const getModelInfo = (modelId: string) => {
    return availableModels.find(m => m.id === modelId)
  }

  const getResolutionOptions = () => {
    const model = getModelInfo(config.model)
    if (!model) return ['1024x1024']
    
    const baseResolutions = model.maxResolution.split('x')
    const maxWidth = parseInt(baseResolutions[0])
    const maxHeight = parseInt(baseResolutions[1])
    
    return [
      `${maxWidth}x${maxHeight}`,
      `${Math.floor(maxWidth * 0.75)}x${maxHeight}`,
      `${maxWidth}x${Math.floor(maxHeight * 0.75)}`,
      `${Math.floor(maxWidth * 1.5)}x${Math.floor(maxHeight * 0.4)}`,
      `${Math.floor(maxWidth * 0.4)}x${Math.floor(maxHeight * 1.5)}`
    ]
  }

  return (
    <Card className="backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-xl"
          style={{ 
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder
          }}>
      <CardHeader>
        <CardTitle style={{ color: colors.primary }} className="flex items-center">
          <Cpu className="inline mr-2 h-5 w-5" />
          Stable Diffusion XL
          <Badge variant="secondary" className="ml-2">PRO</Badge>
        </CardTitle>
        <CardDescription style={{ color: colors.textSecondary }}>
          Advanced image generation with SDXL models and LoRA support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div>
          <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
            SDXL Model
          </Label>
          <Select value={config.model} onValueChange={(value: any) => updateConfig({ model: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getModelInfo(config.model) && (
            <div className="mt-2 p-2 rounded-md bg-muted/50">
              <p className="text-xs" style={{ color: colors.textLight }}>
                Max Resolution: {getModelInfo(config.model)?.maxResolution}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {getModelInfo(config.model)?.recommendedFor.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resolution */}
        <div>
          <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
            Resolution
          </Label>
          <Select value={config.resolution} onValueChange={(value) => updateConfig({ resolution: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getResolutionOptions().map(res => (
                <SelectItem key={res} value={res}>{res}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style and Quality Presets */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
              Style Preset
            </Label>
            <Select value={config.stylePreset} onValueChange={(value) => updateConfig({ stylePreset: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="digital-art">Digital Art</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
              Quality Preset
            </Label>
            <Select value={config.qualityPreset} onValueChange={(value) => updateConfig({ qualityPreset: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="ultra">Ultra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Settings */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Steps */}
            <div>
              <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                Steps: {config.steps}
              </Label>
              <Slider
                value={[config.steps]}
                onValueChange={([value]) => updateConfig({ steps: value })}
                max={50}
                min={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Guidance */}
            <div>
              <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                Guidance Scale: {config.guidance}
              </Label>
              <Slider
                value={[config.guidance]}
                onValueChange={([value]) => updateConfig({ guidance: value })}
                max={20}
                min={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Sampler */}
            <div>
              <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                Sampler
              </Label>
              <Select value={config.sampler} onValueChange={(value) => updateConfig({ sampler: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DPM++ 2M Karras">DPM++ 2M Karras</SelectItem>
                  <SelectItem value="Euler a">Euler a</SelectItem>
                  <SelectItem value="DDIM">DDIM</SelectItem>
                  <SelectItem value="UniPC">UniPC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scheduler */}
            <div>
              <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                Scheduler
              </Label>
              <Select value={config.scheduler} onValueChange={(value) => updateConfig({ scheduler: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Karras">Karras</SelectItem>
                  <SelectItem value="Exponential">Exponential</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Batch Size */}
            <div>
              <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                Batch Size: {config.batchSize}
              </Label>
              <Slider
                value={[config.batchSize]}
                onValueChange={([value]) => updateConfig({ batchSize: value })}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* LoRA Models */}
        <Collapsible open={showLoRA} onOpenChange={setShowLoRA}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                LoRA Models ({config.loraConfigs.length})
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Available LoRAs */}
            <div>
              <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                Available LoRA Models
              </Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {availableLoRAs.map(lora => (
                  <div key={lora.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{lora.name}</div>
                      <div className="text-xs text-muted-foreground">{lora.description}</div>
                      <Badge variant="outline" className="text-xs mt-1">{lora.category}</Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addLoRA(lora)}
                      disabled={config.loraConfigs.some(l => l.name === lora.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active LoRAs */}
            {config.loraConfigs.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                  Active LoRA Models
                </Label>
                <div className="space-y-2">
                  {config.loraConfigs.map((lora, index) => (
                    <div key={index} className="p-3 border rounded-md bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {availableLoRAs.find(l => l.id === lora.name)?.name || lora.name}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeLoRA(index)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Weight: {lora.weight}</Label>
                          <Slider
                            value={[lora.weight]}
                            onValueChange={([value]) => updateLoRA(index, { weight: value })}
                            max={2}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Strength: {lora.strength}</Label>
                          <Slider
                            value={[lora.strength]}
                            onValueChange={([value]) => updateLoRA(index, { strength: value })}
                            max={2}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      {lora.triggerWord && (
                        <div className="mt-2">
                          <Label className="text-xs">Trigger Word</Label>
                          <Input
                            value={lora.triggerWord}
                            onChange={(e) => updateLoRA(index, { triggerWord: e.target.value })}
                            className="text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Unrestricted NSFW Settings */}
        {isNSFW && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Unrestricted NSFW Mode
                  {config.unrestrictedNSFW && <Badge variant="secondary" className="ml-2">ACTIVE</Badge>}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500">
                <p className="text-sm font-medium text-yellow-700 mb-2">
                  ⚠️ Unrestricted NSFW Mode
                </p>
                <p className="text-xs text-yellow-600">
                  This mode enables unrestricted NSFW generation with specific safety parameters enforced.
                </p>
              </div>

              {/* Enable Unrestricted NSFW */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="unrestricted-nsfw"
                  checked={config.unrestrictedNSFW}
                  onCheckedChange={(checked) => updateConfig({ unrestrictedNSFW: checked })}
                />
                <Label htmlFor="unrestricted-nsfw" style={{ color: colors.primary }}>
                  Enable Unrestricted NSFW Generation
                </Label>
              </div>

              {config.unrestrictedNSFW && (
                <>
                  {/* Parameters Display */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                    <div>
                      <span className="text-sm font-medium" style={{ color: colors.primary }}>Model Type:</span>
                      <span className="ml-2 text-sm" style={{ color: colors.textSecondary }}>Female Only</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: colors.primary }}>Age Range:</span>
                      <span className="ml-2 text-sm" style={{ color: colors.textSecondary }}>18-40 years</span>
                    </div>
                  </div>

                  {/* Content Restrictions */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                      Content Restrictions (Enforced)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 p-2 rounded bg-green-500/10 border border-green-500">
                        <span className="text-xs text-green-700">✓ No Children</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded bg-green-500/10 border border-green-500">
                        <span className="text-xs text-green-700">✓ No Men</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded bg-green-500/10 border border-green-500">
                        <span className="text-xs text-green-700">✓ No Animals</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded bg-green-500/10 border border-green-500">
                        <span className="text-xs text-green-700">✓ No Pain</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500">
                    <p className="text-xs font-medium text-red-700">
                      ⚠️ These restrictions cannot be modified and are strictly enforced.
                    </p>
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Custom Prompts */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="custom-prompt"
              checked={config.useCustomPrompt}
              onCheckedChange={(checked) => updateConfig({ useCustomPrompt: checked })}
            />
            <Label htmlFor="custom-prompt" style={{ color: colors.primary }}>
              Use Custom Prompts
            </Label>
          </div>

          {config.useCustomPrompt && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                  Positive Prompt
                </Label>
                <Textarea
                  value={config.positivePrompt}
                  onChange={(e) => updateConfig({ positivePrompt: e.target.value })}
                  placeholder="Describe what you want to generate..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                  Negative Prompt
                </Label>
                <Textarea
                  value={config.negativePrompt}
                  onChange={(e) => updateConfig({ negativePrompt: e.target.value })}
                  placeholder="What to avoid in the image..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button 
          onClick={() => onGenerate(true)} 
          className="w-full"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.textOnWhite
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate with SDXL
        </Button>

        {/* Info */}
        <div className="p-3 rounded-md bg-muted/50">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: colors.secondary }} />
            <div className="text-xs" style={{ color: colors.textLight }}>
              <p className="font-medium mb-1">SDXL Pro Features:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Higher resolution and quality</li>
                <li>Advanced LoRA support</li>
                <li>Better prompt understanding</li>
                <li>Multiple sampler options</li>
                <li>Batch generation support</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}