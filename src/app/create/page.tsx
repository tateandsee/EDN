'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Sparkles, 
  Download, 
  Zap, 
  Crown, 
  Star, 
  Users, 
  TrendingUp,
  Palette,
  Camera,
  Video,
  Mic,
  Eye,
  Wand2,
  Loader2,
  Layers,
  Copy,
  Settings,
  Save,
  FolderOpen,
  Trash2,
  Clock,
<<<<<<< HEAD
  Shield
} from 'lucide-react'
=======
  Shield,
  Cpu,
  Upload
} from 'lucide-react'
import { SDXLControls } from '@/components/sdxl-controls'
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

export default function CreatePage() {
  const { isNSFW } = useNSFW()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const [positivePrompt, setPositivePrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  
  // Content moderation states
  const [moderationResult, setModerationResult] = useState<any>(null)
  const [isModerating, setIsModerating] = useState(false)
  const [showModerationWarning, setShowModerationWarning] = useState(false)
  
  // Queue system states
  const [queueJobId, setQueueJobId] = useState<string | null>(null)
  const [queueStatus, setQueueStatus] = useState<any>(null)
  const [showQueueStatus, setShowQueueStatus] = useState(false)
  const [queueProgress, setQueueProgress] = useState(0)
  
  // Video generation states
  const [generateVideo, setGenerateVideo] = useState(false)
  const [videoStyle, setVideoStyle] = useState('cinematic')
  const [videoDuration, setVideoDuration] = useState(5)
  const [videoTransition, setVideoTransition] = useState('smooth')
  
  // Bulk creation states
  const [bulkCreation, setBulkCreation] = useState(false)
  const [bulkQuantity, setBulkQuantity] = useState(3)
  const [bulkVariations, setBulkVariations] = useState({
    poses: true,
    outfits: true,
    locations: true
  })
  const [generatedContents, setGeneratedContents] = useState<string[]>([])
  
  // Saved prompts and models
  const [savedPrompts, setSavedPrompts] = useState([
    { id: 1, name: 'Beach Portrait', positive: 'Beautiful woman on tropical beach', negative: 'blurry, low quality', tags: ['portrait', 'beach'] },
    { id: 2, name: 'Cyberpunk Style', positive: 'Futuristic cyberpunk aesthetic with neon lights', negative: 'natural lighting, organic', tags: ['cyberpunk', 'futuristic'] }
  ])
  const [savedModels, setSavedModels] = useState([
    { id: 1, name: 'Summer Look', settings: { hair: 'neon pink ombre', skin: 'smooth', clothing: 'bikini', pose: 'dynamic', background: 'tropical beach' }, thumbnail: 'model1.jpg' },
    { id: 2, name: 'Gothic Style', settings: { hair: 'jet black', skin: 'porcelain', clothing: 'gothic dress', pose: 'elegant stance', background: 'urban rooftop' }, thumbnail: 'model2.jpg' }
  ])
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  const [showSaveModel, setShowSaveModel] = useState(false)
  const [newPromptName, setNewPromptName] = useState('')
  const [newModelName, setNewModelName] = useState('')
  
  const [settings, setSettings] = useState({
    hair: 'neon pink ombre',
    skin: 'smooth',
    clothing: 'bikini',
    pose: 'dynamic',
    background: 'tropical beach',
    lighting: 'cinematic',
    style: 'photorealistic',
    faceCloning: false,
    voiceIntegration: false,
    virtualTryOn: false
  })

<<<<<<< HEAD
=======
  // SDXL state
  const [useSDXL, setUseSDXL] = useState(false)
  const [sdxlConfig, setSDXLConfig] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('appearance')

  // LoRA Training state
  const [faceImages, setFaceImages] = useState<File[]>([])
  const [bodyImages, setBodyImages] = useState<File[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [trainingStatus, setTrainingStatus] = useState('')
  const [trainedLoRA, setTrainedLoRA] = useState<string | null>(null)
  const [showTrainingSection, setShowTrainingSection] = useState(false)

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  const nsfwColors = {
    primary: '#FF1493', // deep hot pink
    secondary: '#00CED1', // dark turquoise
    accent: '#FF1744', // vibrant red
    bg: 'from-pink-900 via-purple-900 via-red-900 to-black',
    particle: '#FF69B4',
    cardBg: 'rgba(30, 0, 30, 0.85)',
    cardBorder: 'rgba(255, 20, 147, 0.5)',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textLight: '#B0B0B0',
    textOnWhite: '#FFFFFF',
    glow: 'rgba(255, 20, 147, 0.6)',
    buttonHover: 'rgba(255, 23, 68, 0.8)'
  }

  const sfwColors = {
    primary: '#FF6B35', // vibrant coral orange
    secondary: '#4ECDC4', // bright turquoise
    accent: '#FFE66D', // golden yellow
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    particle: '#FF6B35',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(78, 205, 196, 0.4)',
    textPrimary: '#1A202C', // dark gray
    textSecondary: '#2D3748', // medium gray
    textLight: '#4A5568', // light gray
    textOnWhite: '#2D3748', // text on white backgrounds
    glow: 'rgba(255, 107, 53, 0.4)',
    buttonHover: 'rgba(78, 205, 196, 0.8)'
  }

  const colors = isNSFW ? nsfwColors : sfwColors

  const hairOptions = [
    'neon pink ombre',
    'braided',
    'silver bob',
    'galaxy blue fade',
    'fiery red',
    'platinum blonde',
    'jet black',
    'rainbow highlights'
  ]

  const skinOptions = [
    'tattooed',
    'freckled',
    'smooth',
    'cybernetic glow',
    'sun-kissed',
    'porcelain',
    'golden',
    'mystical shimmer'
  ]

  const clothingOptions = [
    'latex',
    'athleisure',
    'gothic dress',
    'futuristic armor',
    'bikini',
    'lingerie',
    'casual wear',
    'evening gown',
    'cyberpunk outfit'
  ]

  const poseOptions = [
    'suggestive',
    'dynamic',
    'casual',
    'cinematic spin',
    'high-fashion runway',
    'action pose',
    'elegant stance',
    'playful gesture'
  ]

  const backgroundOptions = [
    'cyberpunk city',
    'bohemian meadow',
    'neon club',
    'starry cosmos',
    'tropical beach',
    'urban rooftop',
    'enchanted forest',
    'futuristic laboratory'
  ]

  // Bulk creation variations
  const bulkPoseOptions = [
    'suggestive', 'dynamic', 'casual', 'cinematic spin', 
    'high-fashion runway', 'action pose', 'elegant stance', 'playful gesture'
  ]

  const bulkOutfitOptions = [
    'latex', 'athleisure', 'gothic dress', 'futuristic armor',
    'bikini', 'lingerie', 'casual wear', 'evening gown', 'cyberpunk outfit'
  ]

  const bulkLocationOptions = [
    'cyberpunk city', 'bohemian meadow', 'neon club', 'starry cosmos',
    'tropical beach', 'urban rooftop', 'enchanted forest', 'futuristic laboratory'
  ]

  const platforms = [
    { name: 'OnlyFans', type: 'NSFW' },
    { name: 'Fansly', type: 'NSFW' },
    { name: 'JustForFans', type: 'NSFW' },
    { name: 'ManyVids', type: 'NSFW' },
    { name: 'Fanvue', type: 'NSFW' },
    { name: 'LoyalFans', type: 'NSFW' },
    { name: 'My.Club', type: 'NSFW' },
    { name: 'iFans', type: 'NSFW' },
    { name: 'FanTime', type: 'NSFW' },
    { name: 'Patreon', type: 'SFW' },
    { name: 'Instagram', type: 'SFW' },
    { name: 'TikTok', type: 'SFW' },
    { name: 'Ko-fi', type: 'SFW' },
    { name: 'AdmireMe.VIP', type: 'SFW' }
  ]

  // Video generation options
  const videoStyles = [
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-quality with dramatic transitions' },
    { id: 'slow_motion', name: 'Slow Motion', description: 'Smooth, elegant slow-motion effects' },
    { id: 'dynamic', name: 'Dynamic', description: 'Fast-paced with energetic transitions' },
    { id: 'artistic', name: 'Artistic', description: 'Creative effects with smooth blends' }
  ]

  const videoDurations = [
    { value: 3, label: '3 seconds' },
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 15, label: '15 seconds' }
  ]

  const videoTransitions = [
    { id: 'smooth', name: 'Smooth', optimized: true },
    { id: 'fade', name: 'Fade', optimized: true },
    { id: 'slide', name: 'Slide', optimized: false },
    { id: 'zoom', name: 'Zoom', optimized: false }
  ]

  // Queue status checking
  const checkQueueStatus = async (jobId: string) => {
    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getJobStatus',
          jobId
        })
      })

      const result = await response.json()
      if (result.success) {
        setQueueStatus(result.job)
        setQueueProgress(result.job.progress)
        
        // If job is completed, update the generated content
        if (result.job.status === 'completed') {
          if (result.job.type === 'video') {
            setGeneratedVideo(result.job.result)
          } else {
            setGeneratedContent(result.job.result)
          }
          setIsGenerating(false)
          setShowQueueStatus(false)
        } else if (result.job.status === 'failed') {
          setIsGenerating(false)
          setShowQueueStatus(false)
          console.error('Queue job failed:', result.job.error)
        }
        
        // Continue checking if job is still processing
        if (result.job.status === 'processing') {
          setTimeout(() => checkQueueStatus(jobId), 2000)
        }
      }
    } catch (error) {
      console.error('Failed to check queue status:', error)
    }
  }

  const handleGenerate = async () => {
<<<<<<< HEAD
=======
    // If using SDXL, use SDXL generation
    if (useSDXL && sdxlConfig) {
      await handleSDXLGenerate()
      return
    }

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    // First, moderate the content if using custom prompts
    if (useCustomPrompt && (positivePrompt || negativePrompt)) {
      setIsModerating(true)
      try {
        const response = await fetch('/api/moderate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'text',
            content: `${positivePrompt} ${negativePrompt}`,
            config: {
              strictness: isNSFW ? 'high' : 'medium',
              enableEdgeCaseDetection: true
            }
          })
        })

        const moderationData = await response.json()
        setModerationResult(moderationData)

        // Show warning if content is flagged as NSFW when not in NSFW mode
        if (moderationData.isNSFW && !isNSFW) {
          setShowModerationWarning(true)
          setIsModerating(false)
          return
        }

        // Show warning if content has edge cases
        if (moderationData.edgeCases.length > 0) {
          console.log('Content moderation edge cases:', moderationData.edgeCases)
        }
      } catch (error) {
        console.error('Content moderation failed:', error)
        // Continue with generation but log the error
      } finally {
        setIsModerating(false)
      }
    }

    // Use queue system for video generation or bulk creation
    if (generateVideo || bulkCreation) {
      setIsGenerating(true)
      setShowQueueStatus(true)
      setProgress(0)
      setQueueProgress(0)
      
      try {
        const response = await fetch('/api/queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'addJob',
            type: generateVideo ? 'video' : 'image',
            priority: bulkCreation ? 'high' : 'medium',
            data: {
              prompt: positivePrompt || 'Default prompt',
              settings,
              videoStyle: generateVideo ? videoStyle : undefined,
              videoDuration: generateVideo ? videoDuration : undefined,
              videoTransition: generateVideo ? videoTransition : undefined,
              isNSFW,
              bulkCreation,
              bulkQuantity: bulkCreation ? bulkQuantity : undefined
            }
          })
        })

        const result = await response.json()
        if (result.success) {
          setQueueJobId(result.jobId)
          // Start checking queue status
          checkQueueStatus(result.jobId)
        } else {
          setIsGenerating(false)
          setShowQueueStatus(false)
          console.error('Failed to add job to queue:', result.error)
        }
      } catch (error) {
        console.error('Queue submission failed:', error)
        setIsGenerating(false)
        setShowQueueStatus(false)
      }
    } else {
      // Direct generation for simple image generation
      setIsGenerating(true)
      setProgress(0)
      setGeneratedContent(null)
      setGeneratedVideo(null)
      setGeneratedContents([])
      
      // Calculate generation time based on content type and NSFW mode
      const baseTime = generateVideo ? 6000 : 4000 // Optimized base times
      const nsfwMultiplier = isNSFW && generateVideo ? 1.1 : 1.0 // Reduced NSFW penalty
      const transitionOptimization = isNSFW && generateVideo ? 0.9 : 1.0 // Transition optimization
      const totalTime = baseTime * nsfwMultiplier * transitionOptimization
      
      // Simulate generation progress with optimized steps for NSFW video
      const steps = generateVideo ? 6 : 4 // Reduced steps for faster processing
      const stepTime = totalTime / steps
      
      let currentStep = 0
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / steps)
          currentStep++
          
          if (newProgress >= 100) {
            clearInterval(interval)
            setIsGenerating(false)
            
            if (bulkCreation) {
              // Generate multiple content items for bulk creation
              const contents = []
              for (let i = 0; i < bulkQuantity; i++) {
                if (generateVideo) {
                  contents.push(`generated-video-${i + 1}.mp4`)
                } else {
                  contents.push(`generated-image-${i + 1}`)
                }
              }
              setGeneratedContents(contents)
            } else {
              // Single content generation
              if (generateVideo) {
                setGeneratedVideo(`generated-video-${Date.now()}.mp4`)
              } else {
                setGeneratedContent('generated-image-url')
              }
            }
            return 100
          }
          
          // Enhanced smooth transitions for NSFW video generation
          if (isNSFW && generateVideo) {
            // Optimized transition handling for NSFW content
            if (currentStep === 2) {
              // Early transition optimization
              setProgress(prev => Math.min(prev + 8, 45))
            } else if (currentStep === 4) {
              // Mid-generation smoothing
              setProgress(prev => Math.min(prev + 6, 75))
            }
          }
          
          return newProgress
        })
      }, stepTime)
    }
  }

<<<<<<< HEAD
=======
  const handleSDXLGenerate = async () => {
    if (!sdxlConfig) return

    setIsGenerating(true)
    setProgress(0)
    setGeneratedContent(null)
    setGeneratedVideo(null)
    setGeneratedContents([])

    try {
      const response = await fetch('/api/sdxl/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sdxlConfig,
          isNSFW
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Simulate progress for SDXL generation
        const totalTime = result.processingTime || 5000
        const steps = 8
        const stepTime = totalTime / steps
        
        let currentStep = 0
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + (100 / steps)
            currentStep++
            
            if (newProgress >= 100) {
              clearInterval(interval)
              setIsGenerating(false)
              
              // Handle generated images
              if (result.images && result.images.length > 0) {
                if (result.images.length === 1) {
                  setGeneratedContent(result.images[0].url)
                } else {
                  setGeneratedContents(result.images.map((img: any) => img.url))
                }
              }
              
              return 100
            }
            
            return newProgress
          })
        }, stepTime)
      } else {
        setIsGenerating(false)
        console.error('SDXL generation failed:', result.error)
      }
    } catch (error) {
      setIsGenerating(false)
      console.error('SDXL generation error:', error)
    }
  }

  const handleSDXLConfigChange = (config: any) => {
    setSDXLConfig(config)
  }

  const handleSDXLGenerateRequest = (useSDXLMode: boolean) => {
    setUseSDXL(useSDXLMode)
    if (useSDXLMode) {
      handleSDXLGenerate()
    }
  }

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  const handleSavePrompt = () => {
    if (newPromptName.trim() && (positivePrompt.trim() || negativePrompt.trim())) {
      const newPrompt = {
        id: savedPrompts.length + 1,
        name: newPromptName,
        positive: positivePrompt,
        negative: negativePrompt,
        tags: ['custom']
      }
      setSavedPrompts([...savedPrompts, newPrompt])
      setNewPromptName('')
      setShowSavePrompt(false)
    }
  }

  const handleSaveModel = () => {
    if (newModelName.trim()) {
      const newModel = {
        id: savedModels.length + 1,
        name: newModelName,
        settings: { ...settings },
        thumbnail: `model${savedModels.length + 1}.jpg`
      }
      setSavedModels([...savedModels, newModel])
      setNewModelName('')
      setShowSaveModel(false)
    }
  }

  const loadPrompt = (prompt: any) => {
    setPositivePrompt(prompt.positive)
    setNegativePrompt(prompt.negative)
    setUseCustomPrompt(true)
  }

  const loadModel = (model: any) => {
    setSettings(model.settings)
  }

  const deletePrompt = (id: number) => {
    setSavedPrompts(savedPrompts.filter(p => p.id !== id))
  }

  const deleteModel = (id: number) => {
    setSavedModels(savedModels.filter(m => m.id !== id))
  }

<<<<<<< HEAD
=======
  // LoRA Training Functions
  const handleFaceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (faceImages.length + files.length <= 5) {
      setFaceImages([...faceImages, ...files])
    } else {
      alert('Maximum 5 face images allowed')
    }
  }

  const handleBodyImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (bodyImages.length + files.length <= 5) {
      setBodyImages([...bodyImages, ...files])
    } else {
      alert('Maximum 5 body images allowed')
    }
  }

  const removeFaceImage = (index: number) => {
    setFaceImages(faceImages.filter((_, i) => i !== index))
  }

  const removeBodyImage = (index: number) => {
    setBodyImages(bodyImages.filter((_, i) => i !== index))
  }

  const startTraining = async () => {
    if (faceImages.length < 5 || bodyImages.length < 5) {
      alert('Please upload 5 face images and 5 body images')
      return
    }

    setIsTraining(true)
    setTrainingProgress(0)
    setTrainingStatus('Initializing training...')

    try {
      const formData = new FormData()
      faceImages.forEach((file, index) => {
        formData.append(`faceImage${index}`, file)
      })
      bodyImages.forEach((file, index) => {
        formData.append(`bodyImage${index}`, file)
      })
      formData.append('targetAccuracy', '95')
      formData.append('modelType', 'female')
      formData.append('ageRange', '18-40')
      formData.append('restrictions', JSON.stringify({
        noChildren: true,
        noMen: true,
        noAnimals: true,
        noPain: true
      }))

      const response = await fetch('/api/sdxl/lora/train', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        // Simulate training progress
        const trainingSteps = 10
        const stepTime = 1000 // 1 second per step
        
        for (let step = 1; step <= trainingSteps; step++) {
          await new Promise(resolve => setTimeout(resolve, stepTime))
          setTrainingProgress((step / trainingSteps) * 100)
          setTrainingStatus(`Training step ${step}/${trainingSteps}...`)
        }

        setTrainingStatus('Training completed!')
        setTrainedLoRA(result.loraId)
        
        // Add the trained LoRA to SDXL config if available
        if (sdxlConfig) {
          const newLoRA = {
            name: result.loraId,
            weight: 1.0,
            triggerWord: 'trained_model',
            strength: 1.0
          }
          setSDXLConfig({
            ...sdxlConfig,
            loraConfigs: [...(sdxlConfig.loraConfigs || []), newLoRA]
          })
        }
      } else {
        setTrainingStatus('Training failed: ' + result.error)
      }
    } catch (error) {
      console.error('Training failed:', error)
      setTrainingStatus('Training failed: ' + error.message)
    } finally {
      setIsTraining(false)
    }
  }

  const resetTraining = () => {
    setFaceImages([])
    setBodyImages([])
    setTrainingProgress(0)
    setTrainingStatus('')
    setTrainedLoRA(null)
  }

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} relative overflow-hidden transition-all duration-1000`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <img 
          src={isNSFW ? "/hero-create-nsfw.jpg" : "/hero-create-sfw.jpg"} 
          alt="AI Content Creation Studio" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text create ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Create Desire with EDN' : 'Create Magic with EDN'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Create stunning 4K images and videos with our advanced LoRA model
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced animated background effects */}
      <div className="absolute inset-0 overflow-hidden" style={{ top: '320px' }}>
        {/* Dynamic particles */}
        {[...Array(isNSFW ? 40 : 30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              backgroundColor: colors.particle || colors.primary,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px ${colors.glow || colors.primary}`,
            }}
            animate={{
              y: [0, -(Math.random() * 200 + 100), 0],
              x: [0, (Math.random() * 200 - 100), 0],
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, Math.random() * 1.5 + 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Floating geometric shapes */}
        {[...Array(isNSFW ? 8 : 5)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              border: `2px solid ${colors.secondary}`,
              borderRadius: Math.random() > 0.5 ? '50%' : '10%',
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Light rays effect */}
        {isNSFW && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`ray-${i}`}
                className="absolute origin-bottom"
                style={{
                  left: `${(i * 20) + 10}%`,
                  bottom: '0',
                  width: '2px',
                  height: '100%',
                  background: `linear-gradient(to top, ${colors.primary}40, transparent)`,
                  transform: `rotate(${(i * 15) - 45}deg)`,
                }}
                animate={{
                  opacity: [0.1, 0.4, 0.1],
                  height: ['80%', '120%', '80%'],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 px-6 py-8" style={{ paddingTop: '0' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.primary }}>
              AI Content Creation Studio
            </h1>
            <p className="text-xl" style={{ color: colors.secondary }}>
              Create stunning 4K images and videos with our advanced LoRA model
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls Panel */}
            <div className="lg:col-span-1">
              <Card className="backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-xl"
                  style={{ 
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder
                  }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>
                    <Wand2 className="inline mr-2 h-5 w-5" />
                    Creation Controls
                  </CardTitle>
                  <CardDescription style={{ color: colors.textSecondary }}>
                    Customize your AI-generated content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="appearance" className="w-full">
<<<<<<< HEAD
                    <TabsList className="grid w-full grid-cols-7">
=======
                    <TabsList className="grid w-full grid-cols-9">
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
                      <TabsTrigger value="appearance">Appearance</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
<<<<<<< HEAD
=======
                      <TabsTrigger value="sdxl">SDXL</TabsTrigger>
                      <TabsTrigger value="training">LoRA Train</TabsTrigger>
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
                      <TabsTrigger value="prompts">Prompts</TabsTrigger>
                      <TabsTrigger value="bulk">Bulk</TabsTrigger>
                      <TabsTrigger value="saved">Saved</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="appearance" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Hair Style
                        </label>
                        <Select value={settings.hair} onValueChange={(value) => setSettings({...settings, hair: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hairOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Skin Type
                        </label>
                        <Select value={settings.skin} onValueChange={(value) => setSettings({...settings, skin: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skinOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Clothing
                        </label>
                        <Select value={settings.clothing} onValueChange={(value) => setSettings({...settings, clothing: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {clothingOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Pose
                        </label>
                        <Select value={settings.pose} onValueChange={(value) => setSettings({...settings, pose: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {poseOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Background
                        </label>
                        <Select value={settings.background} onValueChange={(value) => setSettings({...settings, background: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {backgroundOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Lighting Intensity
                        </label>
                        <Slider
                          value={[70]}
                          onValueChange={(value) => console.log(value)}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Style Strength
                        </label>
                        <Slider
                          value={[85]}
                          onValueChange={(value) => console.log(value)}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                          Detail Level
                        </label>
                        <Slider
                          value={[90]}
                          onValueChange={(value) => console.log(value)}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: colors.primary }}>Face Cloning</span>
                        <Button
                          size="sm"
                          variant={settings.faceCloning ? "default" : "outline"}
                          onClick={() => setSettings({...settings, faceCloning: !settings.faceCloning})}
                          style={{ 
                            backgroundColor: settings.faceCloning ? colors.primary : 'transparent',
                            borderColor: colors.primary,
                            color: settings.faceCloning ? 'white' : colors.primary
                          }}
                        >
                          {settings.faceCloning ? 'Enabled' : 'Enable'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: colors.primary }}>Voice Integration</span>
                        <Button
                          size="sm"
                          variant={settings.voiceIntegration ? "default" : "outline"}
                          onClick={() => setSettings({...settings, voiceIntegration: !settings.voiceIntegration})}
                          style={{ 
                            backgroundColor: settings.voiceIntegration ? colors.primary : 'transparent',
                            borderColor: colors.primary,
                            color: settings.voiceIntegration ? 'white' : colors.primary
                          }}
                        >
                          {settings.voiceIntegration ? 'Enabled' : 'Enable'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: colors.primary }}>Virtual Try-On</span>
                        <Button
                          size="sm"
                          variant={settings.virtualTryOn ? "default" : "outline"}
                          onClick={() => setSettings({...settings, virtualTryOn: !settings.virtualTryOn})}
                          style={{ 
                            backgroundColor: settings.virtualTryOn ? colors.primary : 'transparent',
                            borderColor: colors.primary,
                            color: settings.virtualTryOn ? 'white' : colors.primary
                          }}
                        >
                          {settings.virtualTryOn ? 'Enabled' : 'Enable'}
                        </Button>
                      </div>
                    </TabsContent>

<<<<<<< HEAD
=======
                    <TabsContent value="sdxl" className="space-y-4">
                      <SDXLControls
                        onConfigChange={handleSDXLConfigChange}
                        onGenerate={handleSDXLGenerateRequest}
                        isNSFW={isNSFW}
                        colors={colors}
                      />
                    </TabsContent>

                    <TabsContent value="training" className="space-y-4">
                      <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                        <CardHeader>
                          <CardTitle style={{ color: colors.primary }} className="flex items-center">
                            <Cpu className="inline mr-2 h-5 w-5" />
                            LoRA Training Studio
                          </CardTitle>
                          <CardDescription style={{ color: colors.textSecondary }}>
                            Train a custom LoRA model with your images (5 face + 5 body images, 95% accuracy)
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Training Parameters Display */}
                          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                            <div>
                              <span className="text-sm font-medium" style={{ color: colors.primary }}>Model Type:</span>
                              <span className="ml-2 text-sm" style={{ color: colors.textSecondary }}>Female Only</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium" style={{ color: colors.primary }}>Age Range:</span>
                              <span className="ml-2 text-sm" style={{ color: colors.textSecondary }}>18-40 years</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium" style={{ color: colors.primary }}>Target Accuracy:</span>
                              <span className="ml-2 text-sm" style={{ color: colors.textSecondary }}>95%</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium" style={{ color: colors.primary }}>Restrictions:</span>
                              <span className="ml-2 text-sm" style={{ color: colors.textSecondary }}>No children, men, animals, or pain</span>
                            </div>
                          </div>

                          {/* Face Images Upload */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Face Images ({faceImages.length}/5)
                            </Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFaceImageUpload}
                                disabled={isTraining || faceImages.length >= 5}
                                className="hidden"
                                id="face-upload"
                              />
                              <label htmlFor="face-upload" className="cursor-pointer">
                                <Upload className="mx-auto h-8 w-8 mb-2" style={{ color: colors.primary }} />
                                <p className="text-sm" style={{ color: colors.textSecondary }}>
                                  {faceImages.length < 5 ? 'Click to upload face images' : 'Maximum face images uploaded'}
                                </p>
                              </label>
                            </div>
                            {faceImages.length > 0 && (
                              <div className="grid grid-cols-5 gap-2 mt-4">
                                {faceImages.map((file, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Face ${index + 1}`}
                                      className="w-full h-20 object-cover rounded"
                                    />
                                    <button
                                      onClick={() => removeFaceImage(index)}
                                      disabled={isTraining}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Body Images Upload */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Body Images ({bodyImages.length}/5)
                            </Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleBodyImageUpload}
                                disabled={isTraining || bodyImages.length >= 5}
                                className="hidden"
                                id="body-upload"
                              />
                              <label htmlFor="body-upload" className="cursor-pointer">
                                <Upload className="mx-auto h-8 w-8 mb-2" style={{ color: colors.primary }} />
                                <p className="text-sm" style={{ color: colors.textSecondary }}>
                                  {bodyImages.length < 5 ? 'Click to upload body images' : 'Maximum body images uploaded'}
                                </p>
                              </label>
                            </div>
                            {bodyImages.length > 0 && (
                              <div className="grid grid-cols-5 gap-2 mt-4">
                                {bodyImages.map((file, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Body ${index + 1}`}
                                      className="w-full h-20 object-cover rounded"
                                    />
                                    <button
                                      onClick={() => removeBodyImage(index)}
                                      disabled={isTraining}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Training Progress */}
                          {isTraining && (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                                  Training Progress
                                </Label>
                                <Progress value={trainingProgress} className="w-full" />
                                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                                  {trainingStatus}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Training Result */}
                          {trainedLoRA && (
                            <div className="p-4 rounded-lg bg-green-500/20 border border-green-500">
                              <p className="text-sm font-medium text-green-700">
                                ✓ LoRA model trained successfully! Model ID: {trainedLoRA}
                              </p>
                              <p className="text-sm text-green-600 mt-1">
                                Your custom LoRA has been added to the SDXL configuration.
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-4">
                            <Button
                              onClick={startTraining}
                              disabled={isTraining || faceImages.length < 5 || bodyImages.length < 5}
                              className="flex-1"
                              style={{ 
                                backgroundColor: colors.primary,
                                color: colors.textOnWhite 
                              }}
                            >
                              {isTraining ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Training...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Start Training
                                </>
                              )}
                            </Button>
                            
                            <Button
                              onClick={resetTraining}
                              variant="outline"
                              disabled={isTraining}
                              style={{ 
                                borderColor: colors.primary,
                                color: colors.primary 
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Reset
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
                    <TabsContent value="video" className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          id="generate-video"
                          checked={generateVideo}
                          onCheckedChange={setGenerateVideo}
                        />
                        <Label htmlFor="generate-video" style={{ color: colors.primary }}>
                          Generate Video from Image
                        </Label>
                      </div>

                      {generateVideo && (
                        <>
                          <div>
                            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Video Style
                            </Label>
                            <Select value={videoStyle} onValueChange={setVideoStyle}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {videoStyles.map(style => (
                                  <SelectItem key={style.id} value={style.id}>
                                    {style.name} - {style.description}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Duration
                            </Label>
                            <Select value={videoDuration.toString()} onValueChange={(value) => setVideoDuration(parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {videoDurations.map(duration => (
                                  <SelectItem key={duration.value} value={duration.value.toString()}>
                                    {duration.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Transition Style
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {videoTransitions.map(transition => (
                                <Button
                                  key={transition.id}
                                  variant={videoTransition === transition.id ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setVideoTransition(transition.id)}
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: videoTransition === transition.id ? colors.primary : 'transparent',
                                    borderColor: colors.primary,
                                    color: videoTransition === transition.id ? 'white' : colors.primary
                                  }}
                                >
                                  {transition.name}
                                  {transition.optimized && isNSFW && (
                                    <Badge className="ml-1 bg-green-500 text-white text-xs">
                                      Optimized
                                    </Badge>
                                  )}
                                </Button>
                              ))}
                            </div>
                            {isNSFW && videoTransition === 'smooth' && (
                              <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                                Smooth transitions optimized for NSFW content with enhanced rendering
                              </p>
                            )}
                          </div>

                          {isNSFW && (
                            <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, border: `1px solid ${colors.primary}` }}>
                              <p className="text-sm" style={{ color: colors.primary }}>
                                <Video className="inline w-4 h-4 mr-1" />
                                NSFW Video Optimization: Enhanced transitions and rendering for smooth video generation
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="prompts" className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          id="custom-prompt"
                          checked={useCustomPrompt}
                          onCheckedChange={setUseCustomPrompt}
                        />
                        <Label htmlFor="custom-prompt" style={{ color: colors.primary }}>
                          Use Custom Prompts
                        </Label>
                      </div>

                      {useCustomPrompt && (
                        <>
                          <div>
                            <Label htmlFor="positive-prompt" className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Positive Prompt
                            </Label>
                            <Textarea
                              id="positive-prompt"
                              placeholder="Describe what you want to generate..."
                              value={positivePrompt}
                              onChange={(e) => setPositivePrompt(e.target.value)}
                              className="w-full min-h-[100px] resize-none"
                              style={{ 
                                backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                                borderColor: colors.cardBorder,
                                color: colors.textPrimary
                              }}
                            />
                          </div>

                          <div>
                            <Label htmlFor="negative-prompt" className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Negative Prompt
                            </Label>
                            <Textarea
                              id="negative-prompt"
                              placeholder="Describe what you want to avoid..."
                              value={negativePrompt}
                              onChange={(e) => setNegativePrompt(e.target.value)}
                              className="w-full min-h-[80px] resize-none"
                              style={{ 
                                backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                                borderColor: colors.cardBorder,
                                color: colors.textPrimary
                              }}
                            />
                          </div>

                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            <p>💡 Tip: Be specific in your positive prompt for better results.</p>
                            <p>🚫 Use negative prompts to exclude unwanted elements.</p>
                          </div>
                        </>
                      )}

                      {!useCustomPrompt && (
                        <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                          <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Enable custom prompts to have full control over your AI generation</p>
                        </div>
                      )}

                    </TabsContent>

                    <TabsContent value="bulk" className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          id="bulk-creation"
                          checked={bulkCreation}
                          onCheckedChange={setBulkCreation}
                        />
                        <Label htmlFor="bulk-creation" style={{ color: colors.primary }}>
                          Enable Bulk Creation
                        </Label>
                      </div>

                      {bulkCreation && (
                        <>
                          <div>
                            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Number of Versions (Max 8)
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Slider
                                value={[bulkQuantity]}
                                onValueChange={(value) => setBulkQuantity(value[0])}
                                max={8}
                                min={1}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-sm font-medium w-8 text-center" style={{ color: colors.primary }}>
                                {bulkQuantity}
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Variations to Include
                            </Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="vary-poses"
                                  checked={bulkVariations.poses}
                                  onCheckedChange={(checked) => 
                                    setBulkVariations(prev => ({ ...prev, poses: checked }))
                                  }
                                />
                                <Label htmlFor="vary-poses" style={{ color: colors.textSecondary }}>
                                  Different Poses
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="vary-outfits"
                                  checked={bulkVariations.outfits}
                                  onCheckedChange={(checked) => 
                                    setBulkVariations(prev => ({ ...prev, outfits: checked }))
                                  }
                                />
                                <Label htmlFor="vary-outfits" style={{ color: colors.textSecondary }}>
                                  Different Outfits
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="vary-locations"
                                  checked={bulkVariations.locations}
                                  onCheckedChange={(checked) => 
                                    setBulkVariations(prev => ({ ...prev, locations: checked }))
                                  }
                                />
                                <Label htmlFor="vary-locations" style={{ color: colors.textSecondary }}>
                                  Different Locations
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            <p>📊 Bulk creation generates multiple variations at once.</p>
                            <p>🎯 Each version will have different combinations of selected variations.</p>
                            <p>⚡ Processing time increases with quantity and variations.</p>
                          </div>
                        </>
                      )}

                      {!bulkCreation && (
                        <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                          <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Enable bulk creation to generate multiple versions at once</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="saved" className="space-y-4">
                      <div className="flex space-x-2 mb-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowSavePrompt(true)}
                          className="flex items-center gap-2"
                          style={{ 
                            borderColor: colors.primary,
                            color: colors.primary
                          }}
                        >
                          <Save className="h-4 w-4" />
                          Save Prompt
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowSaveModel(true)}
                          className="flex items-center gap-2"
                          style={{ 
                            borderColor: colors.primary,
                            color: colors.primary
                          }}
                        >
                          <Save className="h-4 w-4" />
                          Save Model
                        </Button>
                      </div>

                      {/* Save Prompt Dialog */}
                      {showSavePrompt && (
                        <Card className="p-4" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                          <div className="space-y-3">
                            <div>
                              <Label style={{ color: colors.primary }}>Prompt Name</Label>
                              <input
                                type="text"
                                value={newPromptName}
                                onChange={(e) => setNewPromptName(e.target.value)}
                                className="w-full px-3 py-2 rounded border mt-1"
                                style={{ 
                                  backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                                  borderColor: colors.cardBorder,
                                  color: colors.textPrimary
                                }}
                                placeholder="Enter prompt name..."
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSavePrompt} style={{ backgroundColor: colors.primary, color: 'white' }}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setShowSavePrompt(false)} style={{ borderColor: colors.primary, color: colors.primary }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Save Model Dialog */}
                      {showSaveModel && (
                        <Card className="p-4" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                          <div className="space-y-3">
                            <div>
                              <Label style={{ color: colors.primary }}>Model Name</Label>
                              <input
                                type="text"
                                value={newModelName}
                                onChange={(e) => setNewModelName(e.target.value)}
                                className="w-full px-3 py-2 rounded border mt-1"
                                style={{ 
                                  backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                                  borderColor: colors.cardBorder,
                                  color: colors.textPrimary
                                }}
                                placeholder="Enter model name..."
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSaveModel} style={{ backgroundColor: colors.primary, color: 'white' }}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setShowSaveModel(false)} style={{ borderColor: colors.primary, color: colors.primary }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Saved Prompts Section */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                          <FolderOpen className="h-4 w-4" />
                          Saved Prompts
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {savedPrompts.map(prompt => (
                            <Card key={prompt.id} className="p-3" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium" style={{ color: colors.primary }}>{prompt.name}</span>
                                    <div className="flex gap-1">
                                      {prompt.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs" style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                                    {prompt.positive}
                                  </p>
                                  {prompt.negative && (
                                    <p className="text-xs" style={{ color: colors.textLight }}>
                                      Avoid: {prompt.negative}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => loadPrompt(prompt)} style={{ color: colors.primary }}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => deletePrompt(prompt.id)} style={{ color: '#ef4444' }}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Saved Models Section */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                          <FolderOpen className="h-4 w-4" />
                          Saved Models
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {savedModels.map(model => (
                            <Card key={model.id} className="p-3" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                    <Palette className="h-4 w-4" style={{ color: colors.textSecondary }} />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium block" style={{ color: colors.primary }}>{model.name}</span>
                                    <div className="flex gap-1 mt-1">
                                      <Badge variant="secondary" className="text-xs" style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                                        {model.settings.hair}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs" style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                                        {model.settings.clothing}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => loadModel(model)} style={{ color: colors.primary }}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => deleteModel(model.id)} style={{ color: '#ef4444' }}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Content Moderation Warning */}
                  {showModerationWarning && (
                    <div className="p-4 rounded-lg border-2 mb-4" style={{ 
                      backgroundColor: '#FEF2F2', 
                      borderColor: '#EF4444',
                      color: '#991B1B'
                    }}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">Content Moderation Warning</h4>
                          <p className="text-sm mb-3">
                            Your content has been flagged as potentially NSFW, but you're currently in SFW mode. 
                            To generate this content, please switch to NSFW mode or modify your prompt.
                          </p>
                          {moderationResult && (
                            <div className="text-xs space-y-1 mb-3">
                              <p><strong>Confidence:</strong> {(moderationResult.confidence * 100).toFixed(1)}%</p>
                              <p><strong>Categories:</strong> Explicit: {(moderationResult.categories.explicit * 100).toFixed(1)}%, Suggestive: {(moderationResult.categories.suggestive * 100).toFixed(1)}%</p>
                              {moderationResult.edgeCases.length > 0 && (
                                <p><strong>Edge Cases:</strong> {moderationResult.edgeCases.join(', ')}</p>
                              )}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setShowModerationWarning(false)}
                              variant="outline"
                              className="text-xs"
                            >
                              Modify Prompt
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                // Switch to NSFW mode and continue
                                // This would require accessing the NSFW context setter
                                setShowModerationWarning(false)
                              }}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white"
                            >
                              Switch to NSFW Mode
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Moderation Status */}
                  {isModerating && (
                    <div className="p-3 rounded-lg border mb-4" style={{ 
                      backgroundColor: '#EFF6FF', 
                      borderColor: '#3B82F6',
                      color: '#1E40AF'
                    }}>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Moderating content...</span>
                      </div>
                    </div>
                  )}

                  {/* Moderation Results (for educational purposes) */}
                  {moderationResult && !showModerationWarning && (
                    <div className="p-3 rounded-lg border mb-4" style={{ 
                      backgroundColor: '#F0FDF4', 
                      borderColor: '#22C55E',
                      color: '#166534'
                    }}>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Content moderation completed</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <p><strong>Status:</strong> {moderationResult.isNSFW ? 'NSFW' : 'SFW'}</p>
                        <p><strong>Confidence:</strong> {(moderationResult.confidence * 100).toFixed(1)}%</p>
                        {moderationResult.edgeCases.length > 0 && (
                          <p><strong>Context:</strong> {moderationResult.edgeCases.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Queue Status */}
                  {showQueueStatus && (
                    <div className="p-4 rounded-lg border-2 mb-4" style={{ 
                      backgroundColor: '#EFF6FF', 
                      borderColor: '#3B82F6',
                      color: '#1E40AF'
                    }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">Processing in Queue</h4>
                          <p className="text-sm opacity-90">
                            Your {generateVideo ? 'video' : 'content'} is being processed in our queue system.
                            {queueJobId && <span className="block text-xs mt-1">Job ID: {queueJobId}</span>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Queue Progress</span>
                            <span>{queueProgress.toFixed(0)}%</span>
                          </div>
                          <Progress value={queueProgress} className="w-full" />
                        </div>
                        
                        {queueStatus && (
                          <div className="text-xs space-y-1">
                            <p><strong>Status:</strong> {queueStatus.status}</p>
                            <p><strong>Priority:</strong> {queueStatus.priority}</p>
                            <p><strong>Type:</strong> {queueStatus.type}</p>
                            {queueStatus.startedAt && (
                              <p><strong>Started:</strong> {new Date(queueStatus.startedAt).toLocaleTimeString()}</p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setShowQueueStatus(false)}
                            variant="outline"
                            className="text-xs"
                          >
                            Hide Status
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              // This would open a detailed queue status modal
                              console.log('Show detailed queue status for job:', queueJobId)
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || isModerating}
                    className="w-full"
                    style={{ backgroundColor: '#FFD700', color: '#000' }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {bulkCreation ? `Generating ${bulkQuantity} versions...` : 
                         generateVideo ? 'Generating Video...' : 'Generating...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {bulkCreation ? `Generate ${bulkQuantity} Versions` : 
                         generateVideo ? 'Generate Video' : 'Generate Content'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <Card className="backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-xl"
                  style={{ 
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder
                  }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>
                    <Eye className="inline mr-2 h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <CardDescription style={{ color: colors.textSecondary }}>
                    Real-time AI-powered preview with WebSocket streaming
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span style={{ color: colors.primary }}>Generation Progress</span>
                        <span style={{ color: colors.primary }}>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

                  <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
                    {(generatedContent || generatedVideo) ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                      >
                        <div className="text-center" style={{ color: colors.textPrimary }}>
                          {generatedVideo ? (
                            <>
                              <Video className="h-16 w-16 mx-auto mb-4" />
                              <p className="text-lg font-semibold">Generated Video</p>
                              <p className="text-sm opacity-80">{videoDuration}s • {videoStyle}</p>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-16 w-16 mx-auto mb-4" />
                              <p className="text-lg font-semibold">Generated Content</p>
                              <p className="text-sm opacity-80">4K • 4096×4096px</p>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center" style={{ color: colors.textLight }}>
                        <Camera className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-lg">Preview will appear here</p>
                        <p className="text-sm">Adjust settings and click Generate</p>
                      </div>
                    )}
                  </div>

                  {/* Display generated content */}
                  {(generatedContent || generatedVideo || generatedContents.length > 0) && (
                    <div>
                      {/* 48-Hour Download Notice */}
                      <Card className="backdrop-blur-sm border-2 mb-6"
                        style={{ 
                          backgroundColor: isNSFW ? 'rgba(255, 20, 147, 0.1)' : 'rgba(255, 107, 53, 0.1)',
                          borderColor: isNSFW ? colors.accent : colors.primary
                        }}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: isNSFW ? colors.accent : colors.primary }}>
                                <Download className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2" style={{ color: colors.primary }}>
                                ⏰ 48-Hour Download Window
                              </h4>
                              <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                                Your generated AI model is available for download for the next 48 hours. 
                                After this period, the file will be automatically deleted to save storage space.
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  48 hours remaining
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Users className="w-3 h-3 mr-1" />
                                  Private access
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Secure download
                                </Badge>
                              </div>
                              <p className="text-xs" style={{ color: colors.textLight }}>
                                💡 You'll receive notifications at 24 hours, 12 hours, and 3 hours before expiration.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                        {bulkCreation ? `Generated ${generatedContents.length} Versions` : 
                         generatedVideo ? 'Generated Video' : 'Generated Content'}
                      </h3>
                      
                      {bulkCreation ? (
                        // Bulk creation display - show grid of generated items
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {generatedContents.map((content, index) => (
                              <Card key={index} className="backdrop-blur-sm border-2"
                                style={{ 
                                  backgroundColor: colors.cardBg,
                                  borderColor: colors.cardBorder
                                }}>
                                <CardContent className="p-4">
                                  <div className="aspect-square bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg mb-3 flex items-center justify-center">
                                    <Camera className="h-8 w-8" style={{ color: colors.textSecondary }} />
                                  </div>
                                  <p className="text-sm font-medium mb-2" style={{ color: colors.primary }}>
                                    Version {index + 1}
                                  </p>
                                  <div className="space-y-1">
                                    {bulkVariations.poses && (
                                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                                        Pose: {bulkPoseOptions[index % bulkPoseOptions.length]}
                                      </p>
                                    )}
                                    {bulkVariations.outfits && (
                                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                                        Outfit: {bulkOutfitOptions[index % bulkOutfitOptions.length]}
                                      </p>
                                    )}
                                    {bulkVariations.locations && (
                                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                                        Location: {bulkLocationOptions[index % bulkLocationOptions.length]}
                                      </p>
                                    )}
                                  </div>
                                  <Button size="sm" className="w-full mt-3" style={{ backgroundColor: colors.primary, color: 'white' }}>
                                    <Download className="mr-1 h-3 w-3" />
                                    Download
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          
                          {/* Bulk download options */}
                          <div className="mt-6">
                            <h4 className="text-md font-medium mb-3" style={{ color: colors.primary }}>
                              Bulk Download Options
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {platforms.map(platform => (
                                <Button
                                  key={platform.name}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  style={{ 
                                    borderColor: platform.type === 'NSFW' ? colors.primary : colors.secondary,
                                    color: platform.type === 'NSFW' ? colors.primary : colors.secondary
                                  }}
                                >
                                  <Download className="mr-1 h-3 w-3" />
                                  {platform.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Single content display
                        <div className="space-y-4">
                          <div className={`aspect-square rounded-lg flex items-center justify-center ${generatedVideo ? 'bg-gradient-to-br from-red-500 to-pink-500' : 'bg-gradient-to-br from-gray-300 to-gray-400'}`}>
                            {generatedVideo ? (
                              <Video className="h-16 w-16" style={{ color: colors.textSecondary }} />
                            ) : (
                              <Camera className="h-16 w-16" style={{ color: colors.textSecondary }} />
                            )}
                          </div>
                          
                          {generatedVideo && (
                            <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, border: `1px solid ${colors.primary}` }}>
                              <p className="text-sm" style={{ color: colors.primary }}>
                                <Video className="inline w-4 h-4 mr-1" />
                                Video: {videoDuration}s • {videoStyle} • {videoTransition} transitions
                              </p>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="text-md font-medium mb-3" style={{ color: colors.primary }}>
                              Download for Platforms
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {platforms.map(platform => (
                                <Button
                                  key={platform.name}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  style={{ 
                                    borderColor: platform.type === 'NSFW' ? colors.primary : colors.secondary,
                                    color: platform.type === 'NSFW' ? colors.primary : colors.secondary
                                  }}
                                >
                                  <Download className="mr-1 h-3 w-3" />
                                  {platform.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}