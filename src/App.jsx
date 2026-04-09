import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout   from './layouts/MainLayout'
import AdminLayout  from './layouts/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import Home           from './pages/Home'
import StoryListing   from './pages/StoryListing'
import StoryDetail    from './pages/StoryDetail'
import StoryReader    from './pages/StoryReader'   // standalone — no MainLayout
import BlogListing    from './pages/BlogListing'
import BlogDetail     from './pages/BlogDetail'
import Login          from './pages/Login'
import Signup         from './pages/Signup'
import AdminDashboard from './pages/admin/Dashboard'
import CreatePost     from './pages/admin/CreatePost'
import CreateStory    from './pages/admin/CreateStory'
import ManageContent  from './pages/admin/ManageContent'
import ManageParts    from './pages/admin/ManageParts'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#C9933A', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* ── Public routes (with header + footer) ── */}
        <Route element={<MainLayout />}>
          <Route path="/"            element={<Home />} />
          <Route path="/stories"     element={<StoryListing />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/blogs"       element={<BlogListing />} />
          <Route path="/blogs/:id"   element={<BlogDetail />} />
        </Route>

        {/* ── Story reader — standalone (own toolbar, no site header) ── */}
        <Route
          path="/stories/:id/read/:partId"
          element={<StoryReader />}
        />

        {/* ── Auth pages — no layout ── */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Admin (protected) ── */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"                       element={<AdminDashboard />} />
            <Route path="/admin/create-post"          element={<CreatePost />} />
            <Route path="/admin/create-story"         element={<CreateStory />} />
            <Route path="/admin/manage"               element={<ManageContent />} />
            <Route path="/admin/story/:storyId/parts" element={<ManageParts />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
