"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Download } from "lucide-react"

interface ShowcaseItem {
  id: string
  title: string
  description: string
  image: string
  author: string
  category: string
  views: number
  likes: number
  tags: string[]
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "1",
    title: "Mystical Forest Portrait",
    description: "A breathtaking portrait featuring ethereal lighting and mystical forest elements.",
    image: "/api/placeholder/400/300",
    author: "Digital Artist",
    category: "Portrait",
    views: 15420,
    likes: 892,
    tags: ["fantasy", "portrait", "nature"]
  },
  {
    id: "2",
    title: "Cyberpunk Cityscape",
    description: "Futuristic cityscape with neon lights and advanced technological architecture.",
    image: "/api/placeholder/400/300",
    author: "Tech Visionary",
    category: "Landscape",
    views: 12350,
    likes: 756,
    tags: ["cyberpunk", "city", "futuristic"]
  },
  {
    id: "3",
    title: "Elegant Fashion Model",
    description: "High-fashion photography with sophisticated styling and professional lighting.",
    image: "/api/placeholder/400/300",
    author: "Fashion Studio",
    category: "Fashion",
    views: 9876,
    likes: 634,
    tags: ["fashion", "portrait", "elegant"]
  },
  {
    id: "4",
    title: "Abstract Composition",
    description: "Modern abstract art with vibrant colors and dynamic geometric shapes.",
    image: "/api/placeholder/400/300",
    author: "Abstract Master",
    category: "Abstract",
    views: 8765,
    likes: 523,
    tags: ["abstract", "modern", "colorful"]
  },
  {
    id: "5",
    title: "Wildlife Photography",
    description: "Stunning wildlife capture with incredible detail and natural lighting.",
    image: "/api/placeholder/400/300",
    author: "Nature Expert",
    category: "Nature",
    views: 7654,
    likes: 445,
    tags: ["wildlife", "nature", "realistic"]
  },
  {
    id: "6",
    title: "Architectural Marvel",
    description: "Modern architecture showcase with clean lines and innovative design.",
    image: "/api/placeholder/400/300",
    author: "Design Studio",
    category: "Architecture",
    views: 6543,
    likes: 367,
    tags: ["architecture", "modern", "design"]
  }
]

export default function ShowcasePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Art Showcase</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore stunning creations from our community of AI artists and creators
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {showcaseItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {item.category}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by {item.author}
                  </p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                {item.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {item.likes.toLocaleString()}
                  </span>
                </div>
                
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More
        </Button>
      </div>
    </div>
  )
}