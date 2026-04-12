import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiBookOpen, HiPencil, HiPlus } from 'react-icons/hi'
import { Card, Col, Row, Statistic, Spin } from 'antd'
import { BookOutlined, EditOutlined, UserOutlined, HeartOutlined, EyeOutlined } from '@ant-design/icons'
import { useLanguage } from '../../context/LanguageContext'
import { storyService } from '../../services/storyService'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { lang, t } = useLanguage()
  const [stories, setStories] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      storyService.getStories({ limit: 5 }), // Fetch latest 5 stories
      api.get('/admin/analytics').then(res => res.data?.data || res.data)
    ])
      .then(([s, analyticsData]) => {
        setStories(s.data ?? s)
        setStats(analyticsData)
      })
      .catch((err) => {
        console.error("Dashboard error:", err)
        toast.error('Failed to load dashboard data.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink-700 dark:text-ink-50 hindi-text">
          {t('dashboard')}
        </h1>
        <p className="text-ink-400 dark:text-ink-300 mt-1 hindi-text">
          {lang === 'hi' ? 'आपकी सामग्री का सारांश' : 'Overview of your content'}
        </p>
      </div>

      {/* Stats using Ant Design */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={12} sm={12} md={8} lg={4}>
            <Card bordered={false} className="shadow-card dark:bg-ink-800">
              <Statistic 
                title={<span className="hindi-text text-ink-500 dark:text-ink-300">{lang === 'hi' ? 'कुल उपयोगकर्ता' : 'Users'}</span>} 
                value={stats?.users || 0} 
                prefix={<UserOutlined className="text-blue-500" />} 
                valueStyle={{ color: '#1f2937' }} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={8} lg={5}>
            <Card bordered={false} className="shadow-card dark:bg-ink-800">
              <Statistic 
                title={<span className="hindi-text text-ink-500 dark:text-ink-300">{lang === 'hi' ? 'कहानियाँ' : 'Stories'}</span>} 
                value={stats?.stories || 0} 
                prefix={<BookOutlined className="text-indigo-500" />} 
                valueStyle={{ color: '#1f2937' }} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={8} lg={5}>
            <Card bordered={false} className="shadow-card dark:bg-ink-800">
              <Statistic 
                title={<span className="hindi-text text-ink-500 dark:text-ink-300">{lang === 'hi' ? 'ब्लॉग' : 'Blogs'}</span>} 
                value={stats?.blogs || 0} 
                prefix={<EditOutlined className="text-purple-500" />} 
                valueStyle={{ color: '#1f2937' }} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={12} lg={5}>
            <Card bordered={false} className="shadow-card dark:bg-ink-800">
              <Statistic 
                title={<span className="hindi-text text-ink-500 dark:text-ink-300">{lang === 'hi' ? 'कुल पाठक' : 'Total Views'}</span>} 
                value={stats?.totalViews || 0} 
                prefix={<EyeOutlined className="text-green-500" />} 
                valueStyle={{ color: '#1f2937' }} 
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={12} lg={5}>
            <Card bordered={false} className="shadow-card dark:bg-ink-800">
              <Statistic 
                title={<span className="hindi-text text-ink-500 dark:text-ink-300">{lang === 'hi' ? 'कुल पसंद' : 'Total Likes'}</span>} 
                value={stats?.totalLikes || 0} 
                prefix={<HeartOutlined className="text-red-500" />} 
                valueStyle={{ color: '#1f2937' }} 
              />
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/create-story"
          className="flex items-center gap-4 bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <HiBookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">{t('createStory')}</p>
            <p className="text-sm text-ink-400 dark:text-ink-300 hindi-text">
              {lang === 'hi' ? 'नई कहानी या भाग जोड़ें' : 'Add a new story or part'}
            </p>
          </div>
          <HiPlus className="ml-auto w-5 h-5 text-ink-300" />
        </Link>

        <Link
          to="/admin/create-post"
          className="flex items-center gap-4 bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <HiPencil className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">{t('createPost')}</p>
            <p className="text-sm text-ink-400 dark:text-ink-300 hindi-text">
              {lang === 'hi' ? 'नया ब्लॉग पोस्ट लिखें' : 'Write a new blog post'}
            </p>
          </div>
          <HiPlus className="ml-auto w-5 h-5 text-ink-300" />
        </Link>
      </div>

      {/* Stories table */}
      <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-card overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-cream-200 dark:border-ink-600 flex items-center justify-between">
          <h2 className="font-semibold text-ink-700 dark:text-ink-50 hindi-text">
            {lang === 'hi' ? 'हाल की कहानियाँ' : 'Recent Stories'}
          </h2>
          <Link to="/admin/manage" className="text-sm text-gold-600 dark:text-gold-400 hindi-text">
            {t('manageContent')} →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-ink-400 dark:text-ink-400 border-b border-cream-100 dark:border-ink-700">
                <th className="text-left px-6 py-3 hindi-text">{t('title')}</th>
                <th className="text-left px-6 py-3 hindi-text">{lang === 'hi' ? 'भाग' : 'Parts'}</th>
                <th className="text-left px-6 py-3 hindi-text">{lang === 'hi' ? 'पाठक' : 'Views'}</th>
                <th className="text-left px-6 py-3 hindi-text">{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-ink-300 hindi-text"><Spin /></td></tr>
              ) : stories.map(s => (
                <tr key={s.id || s._id} className="border-b border-cream-100 dark:border-ink-700 hover:bg-cream-50 dark:hover:bg-ink-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink-700 dark:text-ink-50 hindi-text">
                      {lang === 'hi' ? (s.titleHi || s.title) : (s.titleEn || s.title)}
                    </p>
                    <p className="text-xs text-ink-400 dark:text-ink-400 hindi-text">{s.author?.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-500 dark:text-ink-300">{s.totalParts || 0}</td>
                  <td className="px-6 py-4 text-sm text-ink-500 dark:text-ink-300">{s.viewsCount || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`tag text-xs hindi-text ${s.status === 'completed' ? 'bg-green-100 text-green-700' : 'tag-gold'}`}>
                      {s.status === 'completed' ? (lang === 'hi' ? 'पूर्ण' : 'Complete') : (lang === 'hi' ? 'जारी' : 'Published')}
                    </span>
                  </td>
                </tr>
              ))}
              {stories.length === 0 && !loading && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-ink-300 hindi-text">No stories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
