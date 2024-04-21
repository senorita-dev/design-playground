import './App.css'
import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
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
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
