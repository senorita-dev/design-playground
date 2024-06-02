import './App.css'
import { Suspense, useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ServiceContext } from './services/context'
import { services } from './services'
import Home from './pages/Home'
import Design from './pages/Design'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <NotFound /> },
  { path: '/design/:designId', element: <Design />, errorElement: <NotFound /> },
  { path: '/login', element: <Login />, errorElement: <NotFound /> },
])

function App() {
  const { databaseService, userService } = services
  useEffect(() => {
    userService.initialise()
    return () => {
      databaseService.dispose()
      userService.dispose()
    }
  }, [databaseService, userService])
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ServiceContext.Provider value={services}>
        <RouterProvider router={router} />
      </ServiceContext.Provider>
    </Suspense>
  )
}

export default App
