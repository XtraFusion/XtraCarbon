"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Draggable from "react-draggable";
import { Button } from "./ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const desktopToggleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const sections = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/org/dashboard", label: "Organization Dashboard" },
      { href: "/user/dashboard", label: "User Dashboard" },
      { href: "/submit/project/ngo", label: "Submit Project" },
      { href: "/submit/action", label: "Submit Action" },
      { href: "/verifier/dashboard", label: "Verification Dashboard" },
      { href: "/wallet", label: "Wallet" },
      { href: "/login", label: "Login" },
      { href: "/signup", label: "Sign Up" },
    ],
    []
  );

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Handle mobile menu body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Reset icon position when sidebar is opened
  useEffect(() => {
    if (sidebarOpen) setIconPosition({ x: 0, y: 0 });
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] text-gray-900">
      {/* Desktop Sidebar Toggle - Fixed position, draggable only when closed */}
      <Draggable
        nodeRef={desktopToggleRef}
        position={sidebarOpen ? { x: 0, y: 0 } : iconPosition}
        onStart={() => (sidebarOpen ? false : undefined)}
        onStop={(_, data) => {
          if (!sidebarOpen) setIconPosition({ x: data.x, y: data.y });
        }}
        disabled={sidebarOpen}
        key={sidebarOpen ? "sidebar-open" : "sidebar-closed"}
      >
        <div
          ref={desktopToggleRef}
          className="hidden md:block fixed z-50 cursor-move bg-[#F3F4F6]"
          style={{ top: 16, left: 16 }}
        >
          <button
            type="button"
            className={`flex flex-col justify-center items-center w-11 h-11 rounded-lg p-2 bg-[#F3F4F6] hover:bg-gray-100 transition-colors${
              sidebarOpen ? " shadow-lg" : ""
            }`}
            aria-expanded={sidebarOpen}
            aria-label="Toggle sidebar"
            onPointerDown={() => {
              draggingRef.current = false;
            }}
            onPointerMove={() => {
              draggingRef.current = true;
            }}
            onPointerUp={() => {
              if (!draggingRef.current) {
                setSidebarOpen((v) => !v);
              }
              draggingRef.current = false;
            }}
          >
            <span
              className={`block w-7 h-0.5 bg-emerald-600 transition-all duration-300 ${
                sidebarOpen ? "rotate-45 translate-y-0.5" : "mb-1"
              }`}
            ></span>
            <span
              className={`block w-7 h-0.5 bg-emerald-600 transition-all duration-300 ${
                sidebarOpen ? "opacity-0 scale-0" : "mb-1"
              }
              }`}
            ></span>
            <span
              className={`block w-7 h-0.5 bg-emerald-600 transition-all duration-300 ${
                sidebarOpen ? "-rotate-45 -translate-y-0.5" : ""
              }
              }`}
            ></span>
          </button>
        </div>
      </Draggable>

      {/* Mobile Header */}
      <div className="w-full md:hidden border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl p-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Menu</h1>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`flex flex-col justify-center items-center w-8 h-8 rounded-md p-1 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors${
                open ? " shadow-lg" : ""
              }`}
              aria-expanded={open}
              aria-controls="mobile-sidebar"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-emerald-600 transition-all duration-300 ${
                  open ? "rotate-45 translate-y-0.5" : "mb-1"
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-emerald-600 transition-all duration-300 ${
                  open ? "opacity-0 scale-0" : "mb-1"
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-emerald-600 transition-all duration-300 ${
                  open ? "-rotate-45 -translate-y-0.5" : ""
                }
                }`}
              ></span>
            </button>
          </div>
          {/* Mobile Menu Dropdown */}
          {open && (
            <>
              {/* Mobile backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                onClick={() => setOpen(false)}
              />
              <nav
                id="mobile-sidebar"
                className="relative z-30 mt-3 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
              >
                <ul className="grid grid-cols-1 gap-2">
                  {sections.map((s) => {
                    const active =
                      pathname === s.href ||
                      (s.href !== "/" && pathname?.startsWith(s.href));
                    return (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={() => setOpen(false)}
                          className={
                            active
                              ? "block rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm"
                              : "block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                          }
                          aria-current={active ? "page" : undefined}
                        >
                          {s.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <ul>
                  <SignOutButton>Logout</SignOutButton>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>

      {/* Desktop Sidebar - Fixed Position */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-full bg-[#F3F4F6] border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm z-30 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-6 pt-20 w-64">
          <div className="mb-6">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h2>
          </div>
          <nav>
            <ul className="space-y-1">
              {sections.map((section) => {
                const active =
                  pathname === section.href ||
                  (section.href !== "/" && pathname?.startsWith(section.href));
                return (
                  <li key={section.href}>
                    <Link
                      href={section.href}
                      className={
                        active
                          ? "block rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm"
                          : "block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      }
                      aria-current={active ? "page" : undefined}
                    >
                      {section.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul>
                                <SignOutButton>Logout</SignOutButton>

            </ul>
          </nav>
          {/* Status section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
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
        </div>
      </aside>

      {/* Main Content - Full Width */}
      <main
        className={`flex-1 w-full min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
