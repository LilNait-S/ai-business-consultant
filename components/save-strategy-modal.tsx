import React, { useState } from 'react'
import { saveStrategy } from '../services/supabase-service'
import type { DiscoveryData, StrategicPlan } from '../types'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'

interface SaveStrategyModalProps {
  isOpen: boolean
  onClose: () => void
  discoveryData: DiscoveryData
  strategicPlan: StrategicPlan
  onSaved: () => void
}

export function SaveStrategyModal({ 
  isOpen, 
  onClose, 
  discoveryData, 
  strategicPlan, 
  onSaved 
}: SaveStrategyModalProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSuggestedTitle = () => {
    const companyName = discoveryData.companyName || 'Company'
    const industry = discoveryData.industry || 'Business'
    const date = new Date().toLocaleDateString()
    return `${companyName} ${industry} Strategy - ${date}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Por favor ingresa un título para tu estrategia')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await saveStrategy(title.trim(), discoveryData, strategicPlan)
      onSaved()
      onClose()
      // Reset form
      setTitle('')
    } catch (err: any) {
      setError(err.message || 'Error al guardar la estrategia')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Guardar Estrategia</DialogTitle>
          <DialogDescription>
            Guarda tu estrategia para revisarla más tarde
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Estrategia</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa un título descriptivo..."
              required
            />
            <Button
              type="button"
              variant="link"
              onClick={() => setTitle(generateSuggestedTitle())}
              className="h-auto p-0 text-sm"
            >
              Usar título sugerido
            </Button>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">Vista previa de la estrategia:</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Empresa:</strong> {discoveryData.companyName || 'No especificado'}</p>
              <p><strong>Industria:</strong> {discoveryData.industry || 'No especificado'}</p>
              <p><strong>Cronograma:</strong> {discoveryData.timeline}</p>
              <p><strong>Victorias Rápidas:</strong> {strategicPlan.strategy.quickWins.length} iniciativas</p>
              <p><strong>Iniciativas Estratégicas:</strong> {strategicPlan.strategy.strategicInitiatives.length} iniciativas</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Guardando...' : 'Guardar Estrategia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}