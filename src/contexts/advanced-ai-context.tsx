'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

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

interface AdvancedAIState {
  models: TrainingModel[]
  datasets: TrainingDataset[]
  loading: boolean
  error: string | null
  stats: {
    totalModels: number
    activeModels: number
    totalDatasets: number
    readyDatasets: number
    avgAccuracy: number
  }
}

type AdvancedAIAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MODELS'; payload: TrainingModel[] }
  | { type: 'SET_DATASETS'; payload: TrainingDataset[] }
  | { type: 'SET_STATS'; payload: AdvancedAIState['stats'] }
  | { type: 'ADD_MODEL'; payload: TrainingModel }
  | { type: 'UPDATE_MODEL'; payload: { id: string; updates: Partial<TrainingModel> } }
  | { type: 'REMOVE_MODEL'; payload: string }
  | { type: 'ADD_DATASET'; payload: TrainingDataset }
  | { type: 'UPDATE_DATASET'; payload: { id: string; updates: Partial<TrainingDataset> } }
  | { type: 'REMOVE_DATASET'; payload: string }

const initialState: AdvancedAIState = {
  models: [],
  datasets: [],
  loading: false,
  error: null,
  stats: {
    totalModels: 0,
    activeModels: 0,
    totalDatasets: 0,
    readyDatasets: 0,
    avgAccuracy: 0
  }
}

function advancedAIReducer(state: AdvancedAIState, action: AdvancedAIAction): AdvancedAIState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_MODELS':
      return { ...state, models: action.payload }

    case 'SET_DATASETS':
      return { ...state, datasets: action.payload }

    case 'SET_STATS':
      return { ...state, stats: action.payload }

    case 'ADD_MODEL':
      return { ...state, models: [...state.models, action.payload] }

    case 'UPDATE_MODEL':
      return {
        ...state,
        models: state.models.map(model =>
          model.id === action.payload.id
            ? { ...model, ...action.payload.updates }
            : model
        )
      }

    case 'REMOVE_MODEL':
      return {
        ...state,
        models: state.models.filter(model => model.id !== action.payload)
      }

    case 'ADD_DATASET':
      return { ...state, datasets: [...state.datasets, action.payload] }

    case 'UPDATE_DATASET':
      return {
        ...state,
        datasets: state.datasets.map(dataset =>
          dataset.id === action.payload.id
            ? { ...dataset, ...action.payload.updates }
            : dataset
        )
      }

    case 'REMOVE_DATASET':
      return {
        ...state,
        datasets: state.datasets.filter(dataset => dataset.id !== action.payload)
      }

    default:
      return state
  }
}

interface AdvancedAIContextType {
  state: AdvancedAIState
  fetchModels: () => Promise<void>
  fetchDatasets: () => Promise<void>
  fetchStats: () => Promise<void>
  createModel: (data: any) => Promise<void>
  uploadDataset: (data: any) => Promise<void>
  controlModel: (modelId: string, action: string) => Promise<void>
  updateModel: (modelId: string, updates: Partial<TrainingModel>) => Promise<void>
  deleteModel: (modelId: string) => Promise<void>
  deleteDataset: (datasetId: string) => Promise<void>
  exportModel: (modelId: string, format: string) => Promise<void>
}

const AdvancedAIContext = createContext<AdvancedAIContextType | undefined>(undefined)

export function AdvancedAIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(advancedAIReducer, initialState)

  const fetchModels = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai?type=models')
      if (!response.ok) throw new Error('Failed to fetch models')
      
      const data = await response.json()
      dispatch({ type: 'SET_MODELS', payload: data.models })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchDatasets = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai?type=datasets')
      if (!response.ok) throw new Error('Failed to fetch datasets')
      
      const data = await response.json()
      dispatch({ type: 'SET_DATASETS', payload: data.datasets })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchStats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai?type=stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      dispatch({ type: 'SET_STATS', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createModel = async (data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_model', data })
      })
      
      if (!response.ok) throw new Error('Failed to create model')
      
      const result = await response.json()
      dispatch({ type: 'ADD_MODEL', payload: result.model })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const uploadDataset = async (data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upload_dataset', data })
      })
      
      if (!response.ok) throw new Error('Failed to upload dataset')
      
      const result = await response.json()
      dispatch({ type: 'ADD_DATASET', payload: result.dataset })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const controlModel = async (modelId: string, action: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'control_model', data: { modelId, controlAction: action } })
      })
      
      if (!response.ok) throw new Error('Failed to control model')
      
      // Update model status based on action
      let status: TrainingModel['status'] = 'training'
      if (action === 'pause') status = 'paused'
      if (action === 'stop') status = 'failed'
      
      dispatch({ type: 'UPDATE_MODEL', payload: { id: modelId, updates: { status } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateModel = async (modelId: string, updates: Partial<TrainingModel>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId, updates })
      })
      
      if (!response.ok) throw new Error('Failed to update model')
      
      dispatch({ type: 'UPDATE_MODEL', payload: { id: modelId, updates } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deleteModel = async (modelId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/advanced-ai?type=model&id=${modelId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete model')
      
      dispatch({ type: 'REMOVE_MODEL', payload: modelId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deleteDataset = async (datasetId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/advanced-ai?type=dataset&id=${datasetId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete dataset')
      
      dispatch({ type: 'REMOVE_DATASET', payload: datasetId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const exportModel = async (modelId: string, format: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/advanced-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export_model', data: { exportModelId: modelId, exportFormat: format } })
      })
      
      if (!response.ok) throw new Error('Failed to export model')
      
      const result = await response.json()
      // Handle download URL or trigger download
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank')
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    // Initial data fetch
    fetchStats()
  }, [])

  const value: AdvancedAIContextType = {
    state,
    fetchModels,
    fetchDatasets,
    fetchStats,
    createModel,
    uploadDataset,
    controlModel,
    updateModel,
    deleteModel,
    deleteDataset,
    exportModel
  }

  return (
    <AdvancedAIContext.Provider value={value}>
      {children}
    </AdvancedAIContext.Provider>
  )
}

export function useAdvancedAI() {
  const context = useContext(AdvancedAIContext)
  if (context === undefined) {
    throw new Error('useAdvancedAI must be used within an AdvancedAIProvider')
  }
  return context
}