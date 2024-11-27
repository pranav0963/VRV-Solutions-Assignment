'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Search } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' as const })
  const [animateField, setAnimateField] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null)
  const [filterConfig, setFilterConfig] = useState({ name: '', role: 'all', status: 'all' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const addUser = async () => {
    if (newUser.name.trim() === '' || newUser.email.trim() === '' || newUser.role.trim() === '') return
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
      if (!response.ok) {
        throw new Error('Failed to add user')
      }
      const data = await response.json()
      setUsers([...users, data])
      setNewUser({ name: '', email: '', role: '', status: 'Active' })
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
      })
      setUsers(users.filter(user => user.id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const handleInputBlur = (currentField: string, nextField: string) => {
    setAnimateField(nextField)
    setTimeout(() => setAnimateField(''), 1000)
    
    // Focus the next input field
    const nextInput = document.getElementById(nextField) as HTMLInputElement
    if (nextInput) {
      nextInput.focus()
    }
  }

  const handleSort = (key: keyof User) => {
    setSortConfig(prevConfig => 
      prevConfig && prevConfig.key === key
        ? { ...prevConfig, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    )
  }

  const sortedAndFilteredUsers = useMemo(() => {
    let filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(filterConfig.name.toLowerCase()) &&
      (filterConfig.role === 'all' || user.role === filterConfig.role) &&
      (filterConfig.status === 'all' || user.status === filterConfig.status)
    )

    if (sortConfig) {
      filteredUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filteredUsers
  }, [users, sortConfig, filterConfig])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <div className="p-4 border rounded-lg shadow-sm space-y-4 bg-card text-card-foreground">
        <h3 className="text-xl font-semibold">Add New User</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="userName">Name</Label>
            <Input
              id="userName"
              name="name"
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('userName', 'userEmail')}
              className={`mt-1 ${animateField === 'name' ? 'animate-textPop' : ''}`}
            />
          </div>
          <div>
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              name="email"
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('userEmail', 'userRole')}
              className={`mt-1 ${animateField === 'email' ? 'animate-textPop' : ''}`}
            />
          </div>
          <div>
            <Label htmlFor="userRole">Role</Label>
            <Input
              id="userRole"
              name="role"
              type="text"
              placeholder="Role"
              value={newUser.role}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('userRole', 'userStatus')}
              className={`mt-1 ${animateField === 'role' ? 'animate-textPop' : ''}`}
            />
          </div>
          <div>
            <Label htmlFor="userStatus">Status</Label>
            <Select
              value={newUser.status}
              onValueChange={(value: 'Active' | 'Inactive') => setNewUser({ ...newUser, status: value })}
            >
              <SelectTrigger id="userStatus">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={addUser}>Add User</Button>
      </div>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input
            placeholder="Filter by name"
            value={filterConfig.name}
            onChange={(e) => setFilterConfig({ ...filterConfig, name: e.target.value })}
            className="w-1/3"
          />
          <Select
            value={filterConfig.role}
            onValueChange={(value) => setFilterConfig({ ...filterConfig, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterConfig.status}
            onValueChange={(value) => setFilterConfig({ ...filterConfig, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">
                <Button variant="ghost" onClick={() => handleSort('name')}>
                  Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="border p-2 text-left">
                <Button variant="ghost" onClick={() => handleSort('email')}>
                  Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="border p-2 text-left">
                <Button variant="ghost" onClick={() => handleSort('role')}>
                  Role <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="border p-2 text-left">
                <Button variant="ghost" onClick={() => handleSort('status')}>
                  Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.status}</td>
                <td className="border p-2">
                  <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
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

