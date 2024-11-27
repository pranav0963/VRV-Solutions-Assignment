'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Search } from 'lucide-react'

interface Permission {
  id: number
  name: string
  description: string
}

interface PermissionManagementProps {
  permissions: Permission[]
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>
}

export default function PermissionManagement({ permissions, setPermissions }: PermissionManagementProps) {
  const [newPermission, setNewPermission] = useState({ name: '', description: '' })
  const [animateField, setAnimateField] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Permission; direction: 'asc' | 'desc' } | null>(null)
  const [filterConfig, setFilterConfig] = useState({ name: '' })

  const addPermission = () => {
    if (newPermission.name.trim() === '') return
    setPermissions([...permissions, { ...newPermission, id: permissions.length + 1 }])
    setNewPermission({ name: '', description: '' })
  }

  const deletePermission = (id: number) => {
    setPermissions(permissions.filter(permission => permission.id !== id))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPermission({ ...newPermission, [name]: value })
    setAnimateField(name)
    setTimeout(() => setAnimateField(''), 1000)
  }

  const handleSort = (key: keyof Permission) => {
    setSortConfig(prevConfig => 
      prevConfig && prevConfig.key === key
        ? { ...prevConfig, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    )
  }

  const sortedAndFilteredPermissions = useMemo(() => {
    let filteredPermissions = permissions.filter(permission => 
      permission.name.toLowerCase().includes(filterConfig.name.toLowerCase())
    )

    if (sortConfig) {
      filteredPermissions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filteredPermissions
  }, [permissions, sortConfig, filterConfig])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Permission Management</h2>
      <div className="p-4 border rounded-lg shadow-sm space-y-4 bg-card text-card-foreground">
        <h3 className="text-xl font-semibold">Add New Permission</h3>
        <div>
          <Label htmlFor="permissionName">Permission Name</Label>
          <Input
            id="permissionName"
            name="name"
            type="text"
            placeholder="Permission Name"
            value={newPermission.name}
            onChange={handleInputChange}
            className={`mt-1 ${animateField === 'name' ? 'animate-textPop' : ''}`}
          />
        </div>
        <div>
          <Label htmlFor="permissionDescription">Description</Label>
          <Input
            id="permissionDescription"
            name="description"
            type="text"
            placeholder="Description"
            value={newPermission.description}
            onChange={handleInputChange}
            className={`mt-1 ${animateField === 'description' ? 'animate-textPop' : ''}`}
          />
        </div>
        <Button onClick={addPermission}>Add Permission</Button>
      </div>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input
            placeholder="Filter by name"
            value={filterConfig.name}
            onChange={(e) => setFilterConfig({ ...filterConfig, name: e.target.value })}
            className="w-1/3"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">
                <Button variant="ghost" onClick={() => handleSort('name')}>
                  Permission Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="border p-2 text-left">
                <Button variant="ghost" onClick={() => handleSort('description')}>
                  Description <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredPermissions.map(permission => (
              <tr key={permission.id} className="hover:bg-muted/50 transition-colors">
                <td className="border p-2">{permission.name}</td>
                <td className="border p-2">{permission.description}</td>
                <td className="border p-2">
                  <Button variant="destructive" size="sm" onClick={() => deletePermission(permission.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

