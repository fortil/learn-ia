import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Mapa from './pages/Mapa'
import EntrenamientoVsInferencia from './pages/EntrenamientoVsInferencia'
import Ejemplos from './pages/Ejemplos'
import Mitos from './pages/Mitos'
import Quiz from './pages/Quiz'
import Fomo from './pages/Fomo'
import PageStub from './pages/PageStub'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="mapa" element={<Mapa />} />
        <Route path="entrenamiento-vs-inferencia" element={<EntrenamientoVsInferencia />} />
        <Route path="ejemplos" element={<Ejemplos />} />
        <Route path="mitos" element={<Mitos />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="fomo" element={<Fomo />} />
        <Route path="*" element={<PageStub title="Ups, esta parada no existe" sticker="Error 404" stickerColor="coral" />} />
      </Route>
    </Routes>
    </>
  )
}
