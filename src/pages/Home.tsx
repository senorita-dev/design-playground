import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import 'src/css/Home.css'
import { ServiceContext } from 'src/services/context'
import { DesignData } from 'src/services/database/DatabaseManagerService'
import NewDesignButton from 'src/components/NewDesignButton'

function Home() {
  const [designs, setDesigns] = useState<DesignData[]>([])
  const { databaseService } = useContext(ServiceContext)
  useEffect(() => {
    const getDesigns = async () => {
      const fetchedDesigns = await databaseService.getDesigns()
      setDesigns(fetchedDesigns)
    }
    getDesigns()
  }, [])
  return (
    <div>
      <h1>Home</h1>
      <h2>
        Designs <NewDesignButton />
      </h2>
      <ul>
        {designs.map((design, index) => (
          <li key={index}>{design.id}</li>
        ))}
      </ul>
      <ul>
        <li>
          <Link to="/design">Design 1</Link>
        </li>
        <li>Design 2</li>
        <li>Design 3</li>
        <li>Design 4</li>
        <li>Design 5</li>
      </ul>
    </div>
  )
}

export default Home
