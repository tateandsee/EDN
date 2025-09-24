'use client'

import { useEffect, useState } from 'react'

interface ImageProtectionProps {
  children: React.ReactNode
  className?: string
  disableRightClick?: boolean
  disableDrag?: boolean
  disableContextMenu?: boolean
  showWatermark?: boolean
  watermarkText?: string
}

export function ImageProtection({
  children,
  className = "",
  disableRightClick = true,
  disableDrag = true,
  disableContextMenu = true,
  showWatermark = false,
  watermarkText = "EDN Protected"
}: ImageProtectionProps) {
  const [isProtected, setIsProtected] = useState(true)

  useEffect(() => {
    if (!isProtected) return

    // Prevent browser's default image drag behavior
    const preventImageDrag = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Prevent touch and hold on mobile devices
    const preventTouchHold = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Prevent long press on mobile
    let touchTimer: NodeJS.Timeout
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('img')) {
        touchTimer = setTimeout(() => {
          e.preventDefault()
          showTouchProtectionNotification()
        }, 500) // 500ms threshold for long press
      }
    }

    const handleTouchEnd = () => {
      if (touchTimer) {
        clearTimeout(touchTimer)
      }
    }

    // Prevent print screen attempts (limited effectiveness)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized window
        console.log('Page hidden - potential screenshot attempt')
      }
    }

    // Add event listeners
    document.addEventListener('dragstart', preventImageDrag, true)
    document.addEventListener('touchstart', preventTouchHold, true)
    document.addEventListener('touchmove', preventTouchHold, true)
    document.addEventListener('touchend', preventTouchHold, true)
    document.addEventListener('touchstart', handleTouchStart, true)
    document.addEventListener('touchend', handleTouchEnd, true)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // Clean up event listeners
      document.removeEventListener('dragstart', preventImageDrag, true)
      document.removeEventListener('touchstart', preventTouchHold, true)
      document.removeEventListener('touchmove', preventTouchHold, true)
      document.removeEventListener('touchend', preventTouchHold, true)
      document.removeEventListener('touchstart', handleTouchStart, true)
      document.removeEventListener('touchend', handleTouchEnd, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isProtected])

  useEffect(() => {
    if (!isProtected) return

    const handleContextMenu = (e: Event) => {
      if (disableContextMenu) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleDragStart = (e: Event) => {
      if (disableDrag) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common screenshot and download shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'S' || 
         e.key === 'p' || e.key === 'P' ||
         e.key === 'c' || e.key === 'C' ||
         e.key === 'a' || e.key === 'A' ||
         e.key === 'u' || e.key === 'U')
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
      
      // Prevent F12 (developer tools)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault()
        e.stopPropagation()
      }
      
      // Prevent print screen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Prevent copy-paste operations
    const handleCopy = (e: Event) => {
      if (isProtected) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleCut = (e: Event) => {
      if (isProtected) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      if (isProtected) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Add event listeners to the document
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    document.addEventListener('selectstart', handleSelectStart)

    return () => {
      // Clean up event listeners
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('selectstart', handleSelectStart)
    }
  }, [isProtected, disableContextMenu, disableDrag])

  const handleImageRightClick = (e: React.MouseEvent) => {
    if (disableRightClick && isProtected) {
      e.preventDefault()
      e.stopPropagation()
      
      // Show a subtle notification
      showProtectionNotification()
    }
  }

  const handleImageDragStart = (e: React.DragEvent) => {
    if (disableDrag && isProtected) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleImageClick = (e: React.MouseEvent) => {
    if (isProtected) {
      e.preventDefault()
      e.stopPropagation()
      
      // Show protection notification for click attempts
      showClickProtectionNotification()
    }
  }

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    if (isProtected) {
      e.preventDefault()
      e.stopPropagation()
      
      // Prevent double-click to open/save image
      showDoubleClickProtectionNotification()
    }
  }

  const showProtectionNotification = () => {
    // Create a subtle notification instead of alert
    const notification = document.createElement('div')
    notification.textContent = 'EDN AI Model content is protected - downloads disabled'
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 20, 147, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      animation: fadeInOut 3s ease-in-out;
      box-shadow: 0 4px 12px rgba(255, 20, 147, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `
    
    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-10px); }
        20%, 80% { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)
    
    // Remove notification after animation
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, 3000)
  }

  const showClickProtectionNotification = () => {
    // Create a subtle notification for click attempts
    const notification = document.createElement('div')
    notification.textContent = 'EDN Model images are protected - direct interaction disabled'
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 107, 53, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      animation: fadeInOut 2s ease-in-out;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `
    
    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-10px); }
        20%, 80% { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)
    
    // Remove notification after animation
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, 2000)
  }

  const showDoubleClickProtectionNotification = () => {
    // Create a subtle notification for double-click attempts
    const notification = document.createElement('div')
    notification.textContent = 'EDN Model images cannot be opened directly - use marketplace features'
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 20, 147, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      animation: fadeInOut 2.5s ease-in-out;
      box-shadow: 0 4px 12px rgba(255, 20, 147, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `
    
    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-10px); }
        20%, 80% { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)
    
    // Remove notification after animation
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, 2500)
  }

  const showTouchProtectionNotification = () => {
    // Create a subtle notification for touch/long press attempts
    const notification = document.createElement('div')
    notification.textContent = 'EDN Model images are protected - touch interactions disabled'
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(78, 205, 196, 0.95);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      z-index: 10000;
      animation: fadeInOut 2s ease-in-out;
      box-shadow: 0 4px 20px rgba(78, 205, 196, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.3);
      text-align: center;
    `
    
    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)
    
    // Remove notification after animation
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, 2000)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Protected content wrapper */}
      <div
        onContextMenu={handleImageRightClick}
        onDragStart={handleImageDragStart}
        onClick={handleImageClick}
        onDoubleClick={handleImageDoubleClick}
        className="relative"
      >
        {children}
        
        {/* Overlay to prevent interaction */}
        {isProtected && (
          <div
            className="absolute inset-0 bg-transparent cursor-default"
            style={{
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent',
              KhtmlUserSelect: 'none',
              msTouchAction: 'none'
            }}
          />
        )}
      </div>
      
      {/* Watermark overlay */}
      {showWatermark && isProtected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 20, 147, 0.15) 10px,
              rgba(255, 20, 147, 0.15) 20px
            )`,
            backgroundSize: '40px 40px'
          }}
        >
          {/* Repeating watermark text */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-white text-xs font-bold opacity-30 transform -rotate-45 select-none whitespace-nowrap"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  top: `${(i * 10) % 100}%`,
                  left: `${(i * 15) % 100}%`,
                }}
              >
                {watermarkText}
              </div>
            ))}
          </div>
          
          {/* Center watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-white text-sm font-bold opacity-60 transform rotate-45 select-none text-center"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                fontSize: '18px',
                letterSpacing: '3px',
                lineHeight: '1.5'
              }}
            >
              {watermarkText}
              <br />
              <span className="text-xs opacity-80">PROTECTED</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Protection toggle for debugging (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={() => setIsProtected(!isProtected)}
            className="text-xs bg-black/50 text-white px-2 py-1 rounded"
          >
            {isProtected ? '🔒 Protected' : '🔓 Unprotected'}
          </button>
        </div>
      )}
    </div>
  )
}

// Higher-order component for protecting images
export function withImageProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  protectionOptions: Partial<ImageProtectionProps> = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <ImageProtection {...protectionOptions}>
        <WrappedComponent {...props} />
      </ImageProtection>
    )
  }
}

// Protected Image component
export function ProtectedImage({
  src,
  alt,
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <ImageProtection>
      <img
        src={src}
        alt={alt}
        className={className}
        {...props}
        style={{
          ...props.style,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitDraggable: false,
          KhtmlUserDrag: false,
          MozUserDrag: false,
          OUserDrag: false,
          userDrag: false
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
        onDoubleClick={(e) => e.preventDefault()}
      />
    </ImageProtection>
  )
}

// Enhanced AI Model Protection component
export function AIModelProtection({
  children,
  watermarkText = "EDN AI MODEL",
  creatorScreenName,
  className = "",
}: {
  children: React.ReactNode
  watermarkText?: string
  creatorScreenName?: string
  className?: string
}) {
  // Use creator screen name in watermark if provided
  const displayWatermarkText = creatorScreenName ? `© ${creatorScreenName}` : watermarkText
  
  return (
    <ImageProtection
      className={className}
      disableRightClick={true}
      disableDrag={true}
      disableContextMenu={true}
      showWatermark={true}
      watermarkText={displayWatermarkText}
    >
      {children}
      
      {/* Additional AI Model specific protection overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255, 20, 147, 0.03) 10deg, transparent 20deg)',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Protection notice overlay */}
      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-70 pointer-events-none">
        🔒 EDN Protected Content
      </div>
    </ImageProtection>
  )
}