import './App.css'
import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ServiceContext } from './services/context'
import { services } from './services'
import Home from './pages/Home'
import Design from './pages/Design'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <NotFound /> },
  { path: '/design', element: <Design />, errorElement: <NotFound /> },
])

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ServiceContext.Provider value={services}>
        <RouterProvider router={router} />
      </ServiceContext.Provider>
    </Suspense>
  )
}

export default App
