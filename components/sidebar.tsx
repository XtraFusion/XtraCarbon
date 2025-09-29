"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/org/dashboard", label: "Organization Dashboard" },
      { href: "/buyer/dashboard", label: "User Dashboard" },
      { href: "/submit/project", label: "Submit Project" },
      { href: "/submit/action", label: "Submit Action" },
      { href: "/wallet", label: "Wallet" },
      { href: "/login", label: "Login" },
      { href: "/signup", label: "Sign Up" },
    ],
    [],
  )

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger Button - Always visible */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={cn(
              "block w-5 h-0.5 bg-gray-900 transition-all duration-300 ease-in-out",
              isOpen ? "rotate-45 translate-y-1" : ""
            )}
          />
          <span
            className={cn(
              "block w-5 h-0.5 bg-gray-900 mt-1 transition-all duration-300 ease-in-out",
              isOpen ? "opacity-0" : ""
            )}
          />
          <span
            className={cn(
              "block w-5 h-0.5 bg-gray-900 mt-1 transition-all duration-300 ease-in-out",
              isOpen ? "-rotate-45 -translate-y-1" : ""
            )}
          />
        </div>
      </button>

      {/* Backdrop - Only visible when menu is open */}
      <div
        className={cn(
          "fixed inset-0 bg-black transition-opacity duration-300 z-30",
          isOpen 
            ? "opacity-50 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
        onClick={closeMenu}
        aria-hidden={!isOpen}
      />

      {/* Sidebar - Slides in from left */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#F3F4F6] border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar"
        aria-hidden={!isOpen}
      >
        <nav className="p-4 h-full overflow-y-auto">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-1">
              {links.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active 
                          ? "bg-emerald-600 text-white shadow-sm" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          
          {/* Status Section */}
          <div className="mt-auto pt-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-600">
                Status:{" "}
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium text-amber-800 bg-amber-100 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Pending
                </span>
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}