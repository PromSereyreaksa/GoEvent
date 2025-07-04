"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"
import { createContext, useContext, useState } from "react"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = createContext()

export function SidebarProvider({ defaultOpen = true, className, style, children }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Check if mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggle = React.useCallback(() => {
    setIsOpen((prevOpen) => !prevOpen)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${!isOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [isOpen])

  const close = React.useCallback(() => {
    setIsOpen(false)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=false; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [])

  const open = React.useCallback(() => {
    setIsOpen(true)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=true; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle])

  const state = isOpen ? "expanded" : "collapsed"

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close, open, state, isMobile }}>
      <div
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style,
        }}
        className={`group/sidebar-wrapper flex min-h-svh w-full ${className || ""}`}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const Sidebar = React.forwardRef(
  ({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
    const { isOpen, isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <div className={`fixed inset-0 z-50 ${openMobile ? "block" : "hidden"}`} onClick={() => setOpenMobile(false)}>
          <div
            className="fixed left-0 top-0 h-full w-[--sidebar-width] bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={`duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear ${
            state === "collapsed" && collapsible === "offcanvas" ? "w-0" : ""
          }`}
        />
        <div
          className={`duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex ${
            side === "left"
              ? `left-0 ${state === "collapsed" && collapsible === "offcanvas" ? "left-[calc(var(--sidebar-width)*-1)]" : ""}`
              : `right-0 ${state === "collapsed" && collapsible === "offcanvas" ? "right-[calc(var(--sidebar-width)*-1)]" : ""}`
          } ${className || ""}`}
          {...props}
        >
          <div className="flex h-full w-full flex-col bg-white border-r border-gray-200">{children}</div>
        </div>
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggle } = useSidebar()

  return (
    <button
      ref={ref}
      className={`h-7 w-7 p-1 rounded-md hover:bg-gray-100 transition-colors ${className || ""}`}
      onClick={(event) => {
        onClick?.(event)
        toggle()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <main ref={ref} className={`relative flex min-h-svh flex-1 flex-col bg-gray-50 ${className || ""}`} {...props} />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={`flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2 ${className || ""}`} {...props} />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={`flex flex-col gap-2 p-4 border-b border-gray-200 ${className || ""}`} {...props} />
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={`flex flex-col gap-2 p-4 border-t border-gray-200 ${className || ""}`} {...props} />
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={`flex w-full min-w-0 flex-col gap-1 ${className || ""}`} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={`group/menu-item relative ${className || ""}`} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef(
  ({ asChild = false, isActive = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 ${
          isActive ? "bg-gray-100 font-medium" : ""
        } ${className || ""}`}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
}
