export abstract class BaseService {
  protected handleError(error: any, context: string): never {
    console.error(`Error in ${context}:`, error)
    
    if (error instanceof Error) {
      throw new Error(`${context}: ${error.message}`)
    }
    
    throw new Error(`${context}: Unknown error occurred`)
  }

  protected async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      this.handleError(error, context)
    }
  }

  protected validateRequired(data: any, requiredFields: string[], context: string): void {
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(
        `${context}: Missing required fields: ${missingFields.join(', ')}`
      )
    }
  }

  protected sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
  }

  protected generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}