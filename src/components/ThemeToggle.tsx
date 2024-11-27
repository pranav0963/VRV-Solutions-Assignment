'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

