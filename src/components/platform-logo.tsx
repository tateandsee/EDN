'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ImageWithFallback from '@/components/ui/image-with-fallback'

interface PlatformLogoProps {
  name: string
  isNSFW?: boolean
  mode?: 'nsfw' | 'sfw'
}

// Platform logo URLs - using working URLs or fallback to Wikipedia/brand resources
const platformLogos: Record<string, string> = {
  // NSFW Platforms
  'OnlyFans': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/OnlyFans_logo.svg/1200px-OnlyFans_logo.svg.png',
  'Fansly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fansly_logo.svg/1200px-Fansly_logo.svg.png',
  'JustForFans': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/JustForFans_logo.svg/1200px-JustForFans_logo.svg.png',
  'AdmireMe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/AdmireMe_logo.svg/1200px-AdmireMe_logo.svg.png',
  'FanCentro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/FanCentro_logo.svg/1200px-FanCentro_logo.svg.png',
  'ManyVids': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ManyVids_logo.svg/1200px-ManyVids_logo.svg.png',
  
  // SFW Platforms
  'Instagram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png',
  'TikTok': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png',
  'YouTube': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/YouTube_social_white_square_%282017%29.svg/1200px-YouTube_social_white_square_%282017%29.svg.png',
  'Twitter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1200px-Logo_of_Twitter.svg.png',
  'Patreon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Patreon_logo.svg/1200px-Patreon_logo.svg.png',
  'Twitch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Twitch_logo.svg/1200px-Twitch_logo.svg.png'
}

export default function PlatformLogo({ name, isNSFW = false, mode = 'sfw' }: PlatformLogoProps) {
  const colors = {
    sfw: {
      bg: 'bg-gradient-to-br from-cyan-50 to-orange-50',
      border: 'border-cyan-200',
      text: 'text-cyan-700',
      badge: 'bg-cyan-500',
      cardBg: 'bg-white',
      hover: 'hover:shadow-lg hover:shadow-cyan-200/50',
      nameColor: 'text-gray-800'
    },
    nsfw: {
      bg: 'bg-gradient-to-br from-pink-900 to-purple-900',
      border: 'border-pink-700',
      text: 'text-pink-300',
      badge: 'bg-pink-600',
      cardBg: 'bg-black/20',
      hover: 'hover:shadow-lg hover:shadow-pink-500/30',
      nameColor: 'text-white'
    }
  }

  const colorscheme = colors[mode]
  const logoUrl = platformLogos[name]

  return (
    <Card className={`${colorscheme.bg} ${colorscheme.border} border-2 transition-all duration-300 hover:scale-105 ${colorscheme.hover}`}>
      <CardContent className="p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <ImageWithFallback
              src={logoUrl}
              alt={name}
              width={80}
              height={80}
              className="w-full h-full object-contain p-2"
              fallback={
                <div className={`text-2xl font-bold ${colorscheme.text}`}>
                  {name.charAt(0).toUpperCase()}
                </div>
              }
              showFallbackText={false}
            />
          ) : (
            <div className={`text-2xl font-bold ${colorscheme.text}`}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={`font-semibold ${colorscheme.nameColor} mb-2`}>
          {name}
        </div>
        <Badge className={`${colorscheme.badge} text-white text-xs`}>
          {isNSFW ? 'NSFW' : 'SFW'}
        </Badge>
      </CardContent>
    </Card>
  )
}