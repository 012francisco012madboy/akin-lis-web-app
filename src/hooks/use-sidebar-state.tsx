"use client"

import { useState, useEffect, useCallback } from 'react'

interface SidebarState {
  expandedMenu: string | null
  selectedItem: string
  selectedSubItem: string | null
}

const SIDEBAR_STATE_KEY = 'akin-sidebar-state'

export function useSidebarState() {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    expandedMenu: null,
    selectedItem: "",
    selectedSubItem: null
  })

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY)
      if (saved) {
        const parsedState = JSON.parse(saved) as SidebarState
        setSidebarState(parsedState)
      }
    } catch (error) {
      console.warn('Failed to load sidebar state from localStorage:', error)
    }
  }, [])

  // Save state to localStorage whenever it changes
  const updateSidebarState = useCallback((newState: Partial<SidebarState>) => {
    setSidebarState(prevState => {
      const updatedState = { ...prevState, ...newState }
      
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(updatedState))
      } catch (error) {
        console.warn('Failed to save sidebar state to localStorage:', error)
      }
      
      return updatedState
    })
  }, [])

  const clearSidebarState = useCallback(() => {
    const clearedState: SidebarState = {
      expandedMenu: null,
      selectedItem: "",
      selectedSubItem: null
    }
    setSidebarState(clearedState)
    
    try {
      localStorage.removeItem(SIDEBAR_STATE_KEY)
    } catch (error) {
      console.warn('Failed to clear sidebar state from localStorage:', error)
    }
  }, [])

  return {
    sidebarState,
    updateSidebarState,
    clearSidebarState,
    expandedMenu: sidebarState.expandedMenu,
    selectedItem: sidebarState.selectedItem,
    selectedSubItem: sidebarState.selectedSubItem
  }
}
