import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(cors())
app.use(express.json())

let users = []
let roles = []
let permissions = []

// User routes
app.get('/api/users', (req, res) => {
  res.json(users)
})

app.post('/api/users', (req, res) => {
  const { name, email, role, status } = req.body
  if (!name || !email || !role || !status) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  const newUser = { id: uuidv4(), name, email, role, status }
  users.push(newUser)
  res.status(201).json(newUser)
})

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id
  const userIndex = users.findIndex(user => user.id === userId)
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' })
  }
  users.splice(userIndex, 1)
  res.status(204).send()
})

// Role routes
app.get('/api/roles', (req, res) => {
  res.json(roles)
})

app.post('/api/roles', (req, res) => {
  const newRole = { id: uuidv4(), ...req.body }
  roles.push(newRole)
  res.status(201).json(newRole)
})

app.delete('/api/roles/:id', (req, res) => {
  roles = roles.filter(role => role.id !== req.params.id)
  res.status(204).send()
})

// Permission routes
app.get('/api/permissions', (req, res) => {
  res.json(permissions)
})

app.post('/api/permissions', (req, res) => {
  const newPermission = { id: uuidv4(), ...req.body }
  permissions.push(newPermission)
  res.status(201).json(newPermission)
})

app.delete('/api/permissions/:id', (req, res) => {
  permissions = permissions.filter(permission => permission.id !== req.params.id)
  res.status(204).send()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

