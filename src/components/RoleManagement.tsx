'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Key, Eye, Edit, Trash, Star } from 'lucide-react'

interface Role {
  id: number
  name: string
  permissions: string[]
  icon: string
}

interface Permission {
  id: number
  name: string
  description: string
}

interface RoleManagementProps {
  permissions: Permission[]
}

const iconOptions = [
  { value: 'user', label: 'User', icon: User },
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'key', label: 'Key', icon: Key },
  { value: 'eye', label: 'Eye', icon: Eye },
  { value: 'star', label: 'Star', icon: Star },
]

export default function RoleManagement({ permissions }: RoleManagementProps) {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Admin', permissions: ['Read', 'Write', 'Delete'], icon: 'shield' },
    { id: 2, name: 'User', permissions: ['Read'], icon: 'user' },
  ])
  const [newRole, setNewRole] = useState({ name: '', permissions: [], icon: 'user' })
  const [animateField, setAnimateField] = useState('')

  const addRole = () => {
    if (newRole.name.trim() === '') return
    setRoles([...roles, { ...newRole, id: roles.length + 1 }])
    setNewRole({ name: '', permissions: [], icon: 'user' })
  }

  const deleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id))
  }

  const handlePermissionChange = (permissionName: string) => {
    setNewRole(prevRole => {
      const updatedPermissions = prevRole.permissions.includes(permissionName)
        ? prevRole.permissions.filter(p => p !== permissionName)
        : [...prevRole.permissions, permissionName]
      return { ...prevRole, permissions: updatedPermissions }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRole({ ...newRole, name: e.target.value })
    setAnimateField('name')
    setTimeout(() => setAnimateField(''), 1000)
  }

  const IconComponent = iconOptions.find(icon => icon.value === newRole.icon)?.icon || User

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Role Management</h2>
      <div className="p-4 border rounded-lg shadow-sm space-y-4 bg-card text-card-foreground">
        <h3 className="text-xl font-semibold">Add New Role</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              type="text"
              placeholder="Role Name"
              value={newRole.name}
              onChange={handleInputChange}
              className={`mt-1 ${animateField === 'name' ? 'animate-textPop' : ''}`}
            />
          </div>
          <div>
            <Label htmlFor="roleIcon">Icon</Label>
            <Select value={newRole.icon} onValueChange={(value) => setNewRole({ ...newRole, icon: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <option.icon className="mr-2 h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-2">Permissions</h4>
          <div className="grid grid-cols-2 gap-4">
            {permissions.map(permission => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={newRole.permissions.includes(permission.name)}
                  onCheckedChange={() => handlePermissionChange(permission.name)}
                />
                <Label
                  htmlFor={`permission-${permission.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {permission.name}
                  <span className="block text-xs text-muted-foreground">{permission.description}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={addRole}>Add Role</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Icon</th>
              <th className="border p-2 text-left">Role Name</th>
              <th className="border p-2 text-left">Permissions</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => {
              const RoleIcon = iconOptions.find(icon => icon.value === role.icon)?.icon || User
              return (
                <tr key={role.id} className="hover:bg-muted/50 transition-colors">
                  <td className="border p-2">
                    <RoleIcon className="h-5 w-5" />
                  </td>
                  <td className="border p-2">{role.name}</td>
                  <td className="border p-2">{role.permissions.join(', ')}</td>
                  <td className="border p-2">
                    <Button variant="destructive" size="sm" onClick={() => deleteRole(role.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

