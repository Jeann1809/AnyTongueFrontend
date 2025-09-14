'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MessageCircle, User, LogOut } from 'lucide-react'
import { authAPI } from '@/lib/api'

const navigationItems = [
  { name: 'Chats', href: '/', icon: MessageCircle },
  { name: 'Profile', href: '/profile', icon: User }
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
    <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r-2 border-slate-200/50 dark:border-slate-700/50 shadow-modern-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-20'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-slate-200/30 dark:border-slate-700/30">
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center shadow-modern hover-lift">
              <span className="text-white font-bold text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>AT</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-3">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <div key={item.name} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="icon"
                    className={`w-full h-14 rounded-xl transition-all duration-300 hover-lift ${
                      isActive 
                        ? 'gradient-primary text-white shadow-modern' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-modern'
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-6 h-6" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-200/30 dark:border-slate-700/30">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-14 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover-lift"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
