import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Lab from './pages/Lab'
import BossFight from './pages/BossFight'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lab" element={<Lab />} />
          <Route path="boss" element={<BossFight />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}

