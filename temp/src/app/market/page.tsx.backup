"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Heart, Share2 } from "lucide-react"

interface Model {
  id: string
  name: string
  description: string
  category: string
  image: string
  author: string
  downloads: number
  likes: number
  tags: string[]
}

const models: Model[] = [
  {
    id: "1",
    name: "Photorealistic Portrait",
    description: "Advanced AI model for generating stunning photorealistic portraits with incredible detail and realism.",
    category: "Portrait",
    image: "/api/placeholder/400/300",
    author: "AI Artist Pro",
    downloads: 15420,
    likes: 892,
    tags: ["photorealistic", "portrait", "high-detail"]
  },
  {
    id: "2",
    name: "Fantasy Landscape",
    description: "Create breathtaking fantasy landscapes with magical elements and ethereal lighting effects.",
    category: "Landscape",
    image: "/api/placeholder/400/300",
    author: "Dream Weaver",
    downloads: 12350,
    likes: 756,
    tags: ["fantasy", "landscape", "magical"]
  },
  {
    id: "3",
    name: "Cyberpunk Character",
    description: "Generate futuristic cyberpunk characters with neon lights and advanced technological elements.",
    category: "Character",
    image: "/api/placeholder/400/300",
    author: "Tech Visionary",
    downloads: 9876,
    likes: 634,
    tags: ["cyberpunk", "character", "futuristic"]
  }
]

export default function MarketPage() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const handleModelClick = (model: Model) => {
    setSelectedModel(model)
  }

  const handleBack = () => {
    setSelectedModel(null)
  }

  if (selectedModel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Market
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedModel.image}
                alt={selectedModel.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{selectedModel.name}</h1>
              <p className="text-muted-foreground mb-4">by {selectedModel.author}</p>
              <Badge variant="secondary" className="mb-4">
                {selectedModel.category}
              </Badge>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{selectedModel.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedModel.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {selectedModel.downloads.toLocaleString()} downloads
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {selectedModel.likes.toLocaleString()} likes
              </span>
            </div>
            
            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Model
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Model Market</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and download cutting-edge AI models for your creative projects
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleModelClick(model)}>
            <CardHeader className="p-0">
              <img
                src={model.image}
                alt={model.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2">{model.name}</CardTitle>
              <CardDescription className="mb-4 line-clamp-2">
                {model.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{model.category}</Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {model.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {model.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}