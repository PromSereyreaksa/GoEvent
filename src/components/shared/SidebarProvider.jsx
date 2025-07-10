"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

const SidebarContext = createContext()

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export function SidebarProvider({ 
  defaultOpen = true, 
  children, 
  className, 
  style 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Check if mobile and handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsMobileOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      } else if (event.key === "Escape") {
        closeMobileSidebar()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const toggle = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen)
    } else {
      const newOpen = !isOpen
      setIsOpen(newOpen)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${newOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }, [isOpen, isMobile, isMobileOpen])

  const toggleCollapse = useCallback(() => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }, [isCollapsed, isMobile])

  const open = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(true)
    } else {
      setIsOpen(true)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=true; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }, [isMobile])

  const close = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(false)
    } else {
      setIsOpen(false)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=false; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }, [isMobile])

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  const value = {
    isOpen: isMobile ? isMobileOpen : isOpen,
    isCollapsed: isMobile ? false : isCollapsed,
    isMobile,
    isMobileOpen,
    toggle,
    toggleCollapse,
    open,
    close,
    closeMobileSidebar,
  }

  return (
    <SidebarContext.Provider value={value}>
      <div className={className} style={style}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export { SidebarContext }