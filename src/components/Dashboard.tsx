'use client'

import { useState, useEffect } from 'react'
import UserManagement from './UserManagement'
import RoleManagement from './RoleManagement'
import PermissionManagement from './PermissionManagement'
import ThemeToggle from './ThemeToggle'
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [permissions, setPermissions] = useState([])
  const [fontSize, setFontSize] = useState('text-base')
  const [fontFamily, setFontFamily] = useState('font-sans')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Simulated API call to fetch permissions
    setTimeout(() => {
      setPermissions([
        { id: 1, name: 'Read', description: 'Allows reading data' },
        { id: 2, name: 'Write', description: 'Allows writing data' },
        { id: 3, name: 'Delete', description: 'Allows deleting data' },
        { id: 4, name: 'Approve', description: 'Allows approving actions' },
      ])
    }, 1000)
  }, [])

  useEffect(() => {
    document.body.className = `${theme} ${fontSize} ${fontFamily}`
  }, [theme, fontSize, fontFamily])

  return (
    <div className="container mx-auto p-4 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">RBAC Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="p-2 border rounded bg-background text-foreground"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Medium</option>
            <option value="text-lg">Large</option>
          </select>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="p-2 border rounded bg-background text-foreground"
          >
            <option value="font-sans">Sans-serif</option>
            <option value="font-serif">Serif</option>
            <option value="font-mono">Monospace</option>
          </select>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
      <div className="flex mb-4 space-x-2">
        {['users', 'roles', 'permissions'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
            className={`transition-all duration-300 ease-in-out ${
              activeTab === tab ? 'animate-highlight' : ''
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'roles' && <RoleManagement permissions={permissions} />}
      {activeTab === 'permissions' && <PermissionManagement permissions={permissions} setPermissions={setPermissions} />}
    </div>
  )
}

