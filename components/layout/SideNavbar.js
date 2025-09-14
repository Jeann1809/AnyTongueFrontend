'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MessageCircle, User, Settings, LogOut } from 'lucide-react'
import { authAPI } from '@/lib/api'

const navigationItems = [
  { name: 'Chats', href: '/', icon: MessageCircle },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings }
]

export default function SideNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect to login even if API call fails
      router.push('/login')
    }
  }

  return (
    <div className={`bg-card border-r border-border shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-20'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
              <span className="text-primary-foreground font-bold text-sm">AT</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="icon"
                  className={`w-full h-12 shadow-md hover:shadow-lg transition-shadow duration-200 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-blue-200 dark:shadow-blue-900/50' 
                      : 'hover:bg-accent shadow-gray-200 dark:shadow-gray-800/50'
                  }`}
                  title={item.name}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-12 hover:bg-destructive hover:text-destructive-foreground shadow-md hover:shadow-lg transition-shadow duration-200 shadow-gray-200 dark:shadow-gray-800/50 hover:shadow-red-200 dark:hover:shadow-red-900/50"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
