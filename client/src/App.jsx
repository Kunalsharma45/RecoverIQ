import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.jsx'
import RoutesIndex from './routes/index.jsx'

const queryClient = new QueryClient()

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RoutesIndex />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App