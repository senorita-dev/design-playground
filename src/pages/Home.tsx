import { Link } from "react-router-dom"
import "src/css/Home.css"

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <h2>Designs</h2>
      <ul>
        <li><Link to="/design">Design 1</Link></li>
        <li>Design 2</li>
        <li>Design 3</li>
        <li>Design 4</li>
        <li>Design 5</li>
      </ul>
    </div>
  )
}

export default Home
