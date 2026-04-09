import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/common/Header'
import Footer  from '../components/common/Footer'

export default function MainLayout() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 page-wrapper">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
