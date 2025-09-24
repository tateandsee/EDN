/**
 * Video Generation Queue System
 * Handles high concurrent video generation requests with proper queuing and resource management
 */

export interface QueueJob {
  id: string
  type: 'video' | 'image'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  userId?: string
  data: {
    prompt?: string
    settings?: any
    videoStyle?: string
    videoDuration?: number
    videoTransition?: string
    isNSFW?: boolean
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  progress: number
  result?: string
  error?: string
  retryCount: number
  maxRetries: number
}

export interface QueueConfig {
  maxConcurrentJobs: number
  maxQueueSize: number
  retryDelayMs: number
  maxRetries: number
  enablePriority: boolean
  enableFairShare: boolean
  processingTimeoutMs: number
  enableDynamicScaling: boolean
  scaleUpThreshold: number
  scaleDownThreshold: number
  maxScaleUpJobs: number
  resourceMonitoring: boolean
  healthCheckIntervalMs: number
}

export interface QueueStats {
  totalJobs: number
  pendingJobs: number
  processingJobs: number
  completedJobs: number
  failedJobs: number
  averageWaitTimeMs: number
  averageProcessingTimeMs: number
  queueUtilization: number
  currentScaleLevel: number
  isScaling: boolean
  lastScaleTime?: Date
  resourceUsage: {
    cpu: number
    memory: number
    network: number
  }
}

class VideoGenerationQueue {
  private queue: QueueJob[] = []
  private processing: Set<string> = new Set()
  private config: QueueConfig
  private isProcessing: boolean = false
  private stats: QueueStats = {
    totalJobs: 0,
    pendingJobs: 0,
    processingJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    averageWaitTimeMs: 0,
    averageProcessingTimeMs: 0,
    queueUtilization: 0,
    currentScaleLevel: 1,
    isScaling: false,
    resourceUsage: {
      cpu: 0,
      memory: 0,
      network: 0
    }
  }
  private currentMaxConcurrentJobs: number
  private healthCheckInterval?: NodeJS.Timeout
  private scaleLevel: number = 1

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = {
      maxConcurrentJobs: 3,
      maxQueueSize: 100,
      retryDelayMs: 5000,
      maxRetries: 3,
      enablePriority: true,
      enableFairShare: true,
      processingTimeoutMs: 300000, // 5 minutes
      enableDynamicScaling: true,
      scaleUpThreshold: 0.8,
      scaleDownThreshold: 0.3,
      maxScaleUpJobs: 10,
      resourceMonitoring: true,
      healthCheckIntervalMs: 30000,
      ...config
    }
    
    this.currentMaxConcurrentJobs = this.config.maxConcurrentJobs
    
    // Start health monitoring if enabled
    if (this.config.resourceMonitoring) {
      this.startHealthMonitoring()
    }
  }

  /**
   * Add a new job to the queue
   */
  async addJob(jobData: Omit<QueueJob, 'id' | 'status' | 'createdAt' | 'progress' | 'retryCount' | 'maxRetries'>): Promise<string> {
    const job: QueueJob = {
      id: this.generateJobId(),
      status: 'pending',
      createdAt: new Date(),
      progress: 0,
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      ...jobData
    }

    // Check queue capacity
    if (this.queue.length >= this.config.maxQueueSize) {
      throw new Error('Queue is full. Please try again later.')
    }

    // Add to queue with priority ordering
    if (this.config.enablePriority) {
      this.insertWithPriority(job)
    } else {
      this.queue.push(job)
    }

    this.updateStats()
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue()
    }

    console.log(`Job ${job.id} added to queue. Priority: ${job.priority}`)
    return job.id
  }

  /**
   * Insert job with priority ordering
   */
  private insertWithPriority(job: QueueJob): void {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    const jobPriority = priorityOrder[job.priority]

    let insertIndex = this.queue.length
    for (let i = 0; i < this.queue.length; i++) {
      const existingPriority = priorityOrder[this.queue[i].priority]
      if (jobPriority < existingPriority) {
        insertIndex = i
        break
      }
    }

    this.queue.splice(insertIndex, 0, job)
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing) return

    this.isProcessing = true
    console.log('Queue processing started')

    while (this.queue.length > 0 && this.processing.size < this.currentMaxConcurrentJobs) {
      const job = this.queue.shift()
      if (!job) break

      this.processing.add(job.id)
      job.status = 'processing'
      job.startedAt = new Date()
      
      this.updateStats()

      // Process job without blocking the queue
      this.processJob(job).catch(error => {
        console.error(`Job ${job.id} failed:`, error)
      })
    }

    // If no more jobs to process, stop processing
    if (this.queue.length === 0 && this.processing.size === 0) {
      this.isProcessing = false
      console.log('Queue processing completed')
    } else {
      // Continue processing after a short delay
      setTimeout(() => this.processQueue(), 1000)
    }
  }

  /**
   * Process individual job
   */
  private async processJob(job: QueueJob): Promise<void> {
    const startTime = Date.now()
    
    try {
      console.log(`Processing job ${job.id}...`)
      
      // Simulate video/image generation with progress updates
      const totalSteps = job.type === 'video' ? 8 : 5
      // Optimized processing times for NSFW content
      const baseStepTime = job.type === 'video' ? 1500 : 800
      const nsfwOptimization = job.data?.isNSFW ? 0.8 : 1.0
      const stepTime = baseStepTime * nsfwOptimization

      for (let step = 1; step <= totalSteps; step++) {
        // Check if job should be cancelled (not implemented in this version)
        if (job.status === 'failed') break

        // Update progress
        job.progress = (step / totalSteps) * 100
        
        // Enhanced transition handling for NSFW video
        if (job.type === 'video' && job.data?.isNSFW) {
          if (step === 3) {
            // Early transition boost for NSFW videos
            job.progress = Math.min(job.progress + 10, 50)
          } else if (step === 6) {
            // Mid-transition smoothing
            job.progress = Math.min(job.progress + 8, 85)
          }
        }
        
        // Simulate processing time with optimization
        await new Promise(resolve => setTimeout(resolve, stepTime))
        
        // Simulate occasional failures for testing
        if (Math.random() < 0.03 && step === totalSteps - 1) {
          throw new Error('Simulated processing error')
        }
      }

      // Job completed successfully
      job.status = 'completed'
      job.completedAt = new Date()
      job.progress = 100
      job.result = job.type === 'video' 
        ? `generated-video-${job.id}.mp4` 
        : `generated-image-${job.id}.jpg`

      console.log(`Job ${job.id} completed successfully`)

    } catch (error) {
      console.error(`Job ${job.id} failed:`, error)
      
      job.retryCount++
      
      if (job.retryCount < job.maxRetries) {
        // Retry the job
        console.log(`Retrying job ${job.id} (attempt ${job.retryCount + 1})`)
        job.status = 'pending'
        job.progress = 0
        
        // Add back to queue with delay
        setTimeout(() => {
          this.queue.push(job)
          this.updateStats()
          if (!this.isProcessing) {
            this.processQueue()
          }
        }, this.config.retryDelayMs)
      } else {
        // Max retries reached, mark as failed
        job.status = 'failed'
        job.error = error instanceof Error ? error.message : 'Unknown error'
        job.completedAt = new Date()
        
        console.log(`Job ${job.id} failed permanently: ${job.error}`)
      }
    } finally {
      this.processing.delete(job.id)
      this.updateStats()
      
      // Update processing time stats
      const processingTime = Date.now() - startTime
      this.stats.averageProcessingTimeMs = 
        (this.stats.averageProcessingTimeMs * (this.stats.completedJobs + this.stats.failedJobs - 1) + processingTime) / 
        (this.stats.completedJobs + this.stats.failedJobs)
    }
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): QueueJob | null {
    // Check processing jobs first
    for (const jobId of this.processing) {
      const job = this.findJobById(jobId)
      if (job) return job
    }

    // Check queue
    return this.findJobById(jobId)
  }

  /**
   * Find job by ID
   */
  private findJobById(jobId: string): QueueJob | null {
    const job = this.queue.find(job => job.id === jobId)
    return job || null
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId: string): boolean {
    const jobIndex = this.queue.findIndex(job => job.id === jobId)
    if (jobIndex !== -1) {
      const job = this.queue[jobIndex]
      job.status = 'failed'
      job.error = 'Cancelled by user'
      job.completedAt = new Date()
      
      this.queue.splice(jobIndex, 1)
      this.updateStats()
      
      console.log(`Job ${jobId} cancelled`)
      return true
    }
    
    return false
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    return { ...this.stats }
  }

  /**
   * Start health monitoring and dynamic scaling
   */
  private startHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
    
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck()
    }, this.config.healthCheckIntervalMs)
    
    console.log('Health monitoring started for queue system')
  }

  /**
   * Perform health check and dynamic scaling
   */
  private async performHealthCheck(): Promise<void> {
    try {
      // Simulate resource usage monitoring
      const resourceUsage = await this.monitorResourceUsage()
      this.stats.resourceUsage = resourceUsage
      
      // Check if scaling is needed
      if (this.config.enableDynamicScaling) {
        await this.checkScalingNeeds()
      }
      
      // Clean up old jobs
      this.cleanupOldJobs()
      
    } catch (error) {
      console.error('Health check failed:', error)
    }
  }

  /**
   * Monitor resource usage (simulated)
   */
  private async monitorResourceUsage(): Promise<{ cpu: number; memory: number; network: number }> {
    // Simulate resource monitoring based on current load
    const processingLoad = this.processing.size / this.currentMaxConcurrentJobs
    const queuePressure = this.queue.length / this.config.maxQueueSize
    
    return {
      cpu: Math.min(processingLoad * 0.8 + queuePressure * 0.2 + Math.random() * 0.1, 1.0),
      memory: Math.min(processingLoad * 0.6 + queuePressure * 0.3 + Math.random() * 0.1, 1.0),
      network: Math.min(processingLoad * 0.4 + queuePressure * 0.4 + Math.random() * 0.2, 1.0)
    }
  }

  /**
   * Check if scaling is needed
   */
  private async checkScalingNeeds(): Promise<void> {
    const utilization = this.stats.queueUtilization
    const resourcePressure = (
      this.stats.resourceUsage.cpu + 
      this.stats.resourceUsage.memory + 
      this.stats.resourceUsage.network
    ) / 3

    // Scale up if needed
    if (utilization > this.config.scaleUpThreshold && 
        resourcePressure > 0.7 && 
        this.currentMaxConcurrentJobs < this.config.maxScaleUpJobs &&
        !this.stats.isScaling) {
      
      await this.scaleUp()
    }
    
    // Scale down if needed
    else if (utilization < this.config.scaleDownThreshold && 
             resourcePressure < 0.3 && 
             this.currentMaxConcurrentJobs > this.config.maxConcurrentJobs &&
             !this.stats.isScaling) {
      
      await this.scaleDown()
    }
  }

  /**
   * Scale up the queue processing capacity
   */
  private async scaleUp(): Promise<void> {
    this.stats.isScaling = true
    const oldScale = this.currentMaxConcurrentJobs
    this.currentMaxConcurrentJobs = Math.min(
      this.currentMaxConcurrentJobs + 2,
      this.config.maxScaleUpJobs
    )
    this.scaleLevel++
    this.stats.currentScaleLevel = this.scaleLevel
    this.stats.lastScaleTime = new Date()
    
    console.log(`Queue scaled up: ${oldScale} -> ${this.currentMaxConcurrentJobs} jobs`)
    
    // Restart processing if not already running
    if (!this.isProcessing) {
      this.processQueue()
    }
    
    // Simulate scaling delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.stats.isScaling = false
  }

  /**
   * Scale down the queue processing capacity
   */
  private async scaleDown(): Promise<void> {
    this.stats.isScaling = true
    const oldScale = this.currentMaxConcurrentJobs
    this.currentMaxConcurrentJobs = Math.max(
      this.currentMaxConcurrentJobs - 1,
      this.config.maxConcurrentJobs
    )
    this.scaleLevel = Math.max(1, this.scaleLevel - 1)
    this.stats.currentScaleLevel = this.scaleLevel
    this.stats.lastScaleTime = new Date()
    
    console.log(`Queue scaled down: ${oldScale} -> ${this.currentMaxConcurrentJobs} jobs`)
    
    // Simulate scaling delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.stats.isScaling = false
  }

  /**
   * Clean up old completed and failed jobs
   */
  private cleanupOldJobs(): void {
    const cutoffTime = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    
    // This would typically involve persistent storage cleanup
    // For in-memory queue, we just log the action
    const completedCount = this.stats.completedJobs
    const failedCount = this.stats.failedJobs
    
    if (completedCount > 100 || failedCount > 50) {
      console.log(`Queue cleanup: ${completedCount} completed, ${failedCount} failed jobs processed`)
    }
  }

  /**
   * Stop health monitoring
   */
  private stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = undefined
      console.log('Health monitoring stopped')
    }
  }

  /**
   * Update queue statistics
   */
  private updateStats(): void {
    this.stats.totalJobs = this.stats.completedJobs + this.stats.failedJobs + this.queue.length + this.processing.size
    this.stats.pendingJobs = this.queue.length
    this.stats.processingJobs = this.processing.size
    this.stats.queueUtilization = this.stats.totalJobs / this.config.maxQueueSize

    // Calculate average wait time for pending jobs
    const now = Date.now()
    const totalWaitTime = this.queue.reduce((sum, job) => {
      return sum + (now - job.createdAt.getTime())
    }, 0)
    
    this.stats.averageWaitTimeMs = this.queue.length > 0 ? totalWaitTime / this.queue.length : 0
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<QueueConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('Queue configuration updated:', this.config)
  }

  /**
   * Get current configuration
   */
  getConfig(): QueueConfig {
    return { ...this.config }
  }

  /**
   * Clear completed and failed jobs older than specified hours
   */
  cleanup(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)
    
    // This would typically involve persistent storage cleanup
    // For in-memory queue, we just log the action
    console.log(`Queue cleanup: removing jobs older than ${maxAgeHours} hours`)
  }

  /**
   * Get all jobs (for debugging/admin purposes)
   */
  getAllJobs(): QueueJob[] {
    return [...this.queue]
  }

  /**
   * Get processing jobs
   */
  getProcessingJobs(): QueueJob[] {
    return Array.from(this.processing).map(id => this.findJobById(id)).filter(Boolean) as QueueJob[]
  }
}

// Export singleton instance with enhanced configuration for high concurrency
export const videoQueue = new VideoGenerationQueue({
  maxConcurrentJobs: 5, // Increased from 3 to handle more concurrent jobs
  maxQueueSize: 100, // Increased queue size
  retryDelayMs: 2000, // Reduced retry delay for faster recovery
  maxRetries: 3,
  enablePriority: true,
  enableFairShare: true,
  processingTimeoutMs: 240000, // Reduced from 5 minutes to 4 minutes for faster turnover
  enableDynamicScaling: true,
  scaleUpThreshold: 0.8,
  scaleDownThreshold: 0.3,
  maxScaleUpJobs: 15,
  resourceMonitoring: true,
  healthCheckIntervalMs: 30000
})

// Export types and utilities
export { VideoGenerationQueue }
export type { QueueJob, QueueConfig, QueueStats }