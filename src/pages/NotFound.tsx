import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

function NotFound() {
  const error = useRouteError()
  console.error(error)
  if (!isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>Sorry, the page you were looking for could not be found.</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText}</i>
      </p>
    </div>
  )
}

export default NotFound
