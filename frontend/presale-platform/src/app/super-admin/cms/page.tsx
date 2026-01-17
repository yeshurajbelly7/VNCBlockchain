'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Edit,
  Plus,
  Trash2,
  Eye,
  Save,
  Upload,
  Download,
  Search,
  Image,
  Video,
  File,
  Settings,
  Globe,
  User,
  Tag,
  Link,
  Copy,
  Code,
  Type,
  Layout,
  Columns,
  List,
  BarChart3,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Languages,
} from 'lucide-react';

type ContentType = 'page' | 'post' | 'article' | 'media' | 'component';
type ContentStatus = 'published' | 'draft' | 'scheduled' | 'archived';
type MediaType = 'image' | 'video' | 'document' | 'audio';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  language: string;
  tags: string[];
  category: string;
  featured: boolean;
  fullAccess: boolean;
  content?: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
  uploadedBy: string;
  usedIn: number;
}

const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    title: 'Welcome to VNC Blockchain',
    slug: 'welcome-vnc-blockchain',
    type: 'page',
    status: 'published',
    author: 'Admin',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-14',
    publishedAt: '2026-01-10',
    views: 15420,
    language: 'en',
    tags: ['blockchain', 'cryptocurrency', 'welcome'],
    category: 'Landing Pages',
    featured: true,
    fullAccess: true,
    content: '<h1>Welcome to VNC Blockchain</h1><p>Experience the future of decentralized finance...</p>',
    excerpt: 'Discover the power of VNC Blockchain platform',
    seoTitle: 'VNC Blockchain - Next Generation Blockchain Platform',
    seoDescription: 'Join VNC Blockchain, the fastest and most secure blockchain platform with 400,000 TPS.',
  },
  {
    id: 'c2',
    title: 'Token Presale Announcement',
    slug: 'token-presale-announcement',
    type: 'post',
    status: 'published',
    author: 'Marketing Team',
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12',
    publishedAt: '2026-01-12',
    views: 8540,
    language: 'en',
    tags: ['presale', 'token', 'announcement'],
    category: 'News',
    featured: true,
    fullAccess: true,
    excerpt: 'Exclusive early access to VNC token presale',
  },
  {
    id: 'c3',
    title: 'Getting Started Guide',
    slug: 'getting-started-guide',
    type: 'article',
    status: 'draft',
    author: 'Documentation Team',
    createdAt: '2026-01-14',
    updatedAt: '2026-01-15',
    views: 0,
    language: 'en',
    tags: ['guide', 'tutorial', 'documentation'],
    category: 'Documentation',
    featured: false,
    fullAccess: false,
    excerpt: 'Learn how to get started with VNC Blockchain',
  },
];

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    name: 'hero-banner.jpg',
    type: 'image',
    url: '/media/hero-banner.jpg',
    size: '2.4 MB',
    dimensions: '1920x1080',
    uploadedAt: '2026-01-10',
    uploadedBy: 'Admin',
    usedIn: 3,
  },
  {
    id: 'm2',
    name: 'vnc-logo.svg',
    type: 'image',
    url: '/media/vnc-logo.svg',
    size: '45 KB',
    dimensions: '512x512',
    uploadedAt: '2026-01-10',
    uploadedBy: 'Admin',
    usedIn: 15,
  },
  {
    id: 'm3',
    name: 'whitepaper-v1.pdf',
    type: 'document',
    url: '/media/whitepaper-v1.pdf',
    size: '5.8 MB',
    uploadedAt: '2026-01-11',
    uploadedBy: 'Admin',
    usedIn: 1,
  },
];

const CATEGORIES = ['Landing Pages', 'News', 'Documentation', 'Blog', 'Legal', 'Marketing'];
const LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'ru', 'pt'];

export default function CMSPage() {
  const [content, setContent] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [media, _setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'pages' | 'settings'>('content');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [_showMediaModal, setShowMediaModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const stats = useMemo(() => {
    const published = content.filter((c) => c.status === 'published').length;
    const drafts = content.filter((c) => c.status === 'draft').length;
    const scheduled = content.filter((c) => c.status === 'scheduled').length;
    const totalViews = content.reduce((s, c) => s + c.views, 0);
    return { published, drafts, scheduled, totalViews };
  }, [content]);

  const filtered = useMemo(() => {
    return content
      .filter((c) => (statusFilter === 'all' ? true : c.status === statusFilter))
      .filter((c) => (typeFilter === 'all' ? true : c.type === typeFilter))
      .filter((c) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [content, query, statusFilter, typeFilter]);

  const handleView = (item: ContentItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const saveContent = (updated: ContentItem) => {
    setContent((prev) => prev.map((c) => (c.id === updated.id ? { ...updated, updatedAt: new Date().toISOString().split('T')[0] } : c)));
    setShowEditModal(false);
    alert('Content saved successfully!');
  };

  const toggleFullAccess = (id: string) => {
    setContent((prev) => prev.map((c) => (c.id === id ? { ...c, fullAccess: !c.fullAccess } : c)));
  };

  const _toggleFeatured = (id: string) => {
    setContent((prev) => prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c)));
  };

  const duplicateContent = (id: string) => {
    const item = content.find((c) => c.id === id);
    if (item) {
      const newItem: ContentItem = {
        ...item,
        id: `c${Date.now()}`,
        title: `${item.title} (Copy)`,
        slug: `${item.slug}-copy`,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
      };
      setContent((prev) => [newItem, ...prev]);
      alert('Content duplicated successfully!');
    }
  };

  const deleteContent = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContent((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const exportContent = () => {
    const header = ['id', 'title', 'slug', 'type', 'status', 'author', 'views', 'language', 'category', 'featured'];
    const rows = content.map((c) => [c.id, c.title, c.slug, c.type, c.status, c.author, c.views, c.language, c.category, c.featured]);
    const csv = [header, ...rows].map((r) => r.map((cell) => `\"${String(cell).replace(/\"/g, '\"\"')}\"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cms_content_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-400" />
            Content Management System
          </h1>
          <p className="text-gray-400">Professional content & media management platform</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Content
          </button>
          <button
            onClick={() => setShowMediaModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Media
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.published}</div>
              <div className="text-sm text-gray-400">Published</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-3">
            <Edit className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.drafts}</div>
              <div className="text-sm text-gray-400">Drafts</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.scheduled}</div>
              <div className="text-sm text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <Eye className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
        {[
          { id: 'content', label: 'Content', icon: FileText },
          { id: 'media', label: 'Media Library', icon: Image },
          { id: 'pages', label: 'Page Builder', icon: Layout },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'content' | 'pages' | 'media' | 'settings')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search content"
                  placeholder="Search by title, slug, tags, category..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Types</option>
                <option value="page">Page</option>
                <option value="post">Post</option>
                <option value="article">Article</option>
                <option value="component">Component</option>
              </select>
            </div>
            <button
              onClick={exportContent}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-4 py-3">Content</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Views</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3">Access</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-900">
                      <td className="px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-white">{item.title}</div>
                            {item.featured && <span title="Featured"><Tag className="w-3 h-3 text-yellow-400" /></span>}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">/{item.slug}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.type === 'page'
                              ? 'bg-blue-500/20 text-blue-300'
                              : item.type === 'post'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {item.status === 'published' && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {item.status === 'draft' && <Edit className="w-4 h-4 text-yellow-400" />}
                          {item.status === 'scheduled' && <Clock className="w-4 h-4 text-blue-400" />}
                          {item.status === 'archived' && <XCircle className="w-4 h-4 text-gray-400" />}
                          <span
                            className={`text-sm ${
                              item.status === 'published'
                                ? 'text-green-400'
                                : item.status === 'draft'
                                ? 'text-yellow-400'
                                : item.status === 'scheduled'
                                ? 'text-blue-400'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{item.author}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-300">{item.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-purple-400">
                          <Eye className="w-3 h-3" />
                          <span className="text-sm font-semibold">{item.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-300">{item.updatedAt}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFullAccess(item.id)}
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            item.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {item.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(item)}
                            title="View"
                            className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            title="Edit"
                            className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicateContent(item.id)}
                            title="Duplicate"
                            className="p-2 bg-blue-800/20 border border-blue-700 rounded hover:bg-blue-800/30 text-blue-400"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteContent(item.id)}
                            title="Delete"
                            className="p-2 bg-red-800/20 border border-red-700 rounded hover:bg-red-800/30 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Tab */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Media Library</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-center mb-3 h-32 bg-gray-800 rounded">
                    {item.type === 'image' && <Image className="w-12 h-12 text-purple-400" aria-label="Image icon" />}
                    {item.type === 'video' && <Video className="w-12 h-12 text-blue-400" />}
                    {item.type === 'document' && <File className="w-12 h-12 text-green-400" />}
                    {item.type === 'audio' && <File className="w-12 h-12 text-yellow-400" />}
                  </div>
                  <div className="text-sm font-semibold text-white truncate mb-1">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.size}</div>
                  {item.dimensions && <div className="text-xs text-gray-500">{item.dimensions}</div>}
                  <div className="text-xs text-gray-500 mt-2">Used in {item.usedIn} places</div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="flex-1 px-2 py-1 bg-purple-600 rounded text-xs text-white">View</button>
                    <button className="flex-1 px-2 py-1 bg-gray-700 rounded text-xs text-white">Copy URL</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Builder Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Visual Page Builder</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Components Sidebar */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-bold text-white mb-3">Components</h3>
                <div className="space-y-2">
                  {[
                    { icon: Type, label: 'Text Block' },
                    { icon: Image, label: 'Image' },
                    { icon: Columns, label: 'Columns' },
                    { icon: List, label: 'List' },
                    { icon: Link, label: 'Button' },
                    { icon: Video, label: 'Video' },
                    { icon: Code, label: 'Code' },
                    { icon: BarChart3, label: 'Chart' },
                  ].map((comp) => (
                    <button
                      key={comp.label}
                      className="w-full px-3 py-2 bg-gray-800 rounded text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <comp.icon className="w-4 h-4" />
                      {comp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="lg:col-span-3 bg-white rounded-lg p-8 min-h-[600px]">
                <div className="text-center py-20">
                  <Layout className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Drag & Drop Page Builder</h3>
                  <p className="text-gray-600">Start building your page by dragging components from the left sidebar</p>
                  <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">Start Building</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Multilingual Settings
            </h3>
            <div className="space-y-3">
              {LANGUAGES.map((lang) => (
                <div key={lang} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white uppercase">{lang}</span>
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs">Active</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <span className="text-sm text-white">{cat}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 bg-gray-800 rounded text-gray-300 hover:text-white">
                      <Edit className="w-3 h-3" />
                    </button>
                    <button className="p-1 bg-red-800/20 rounded text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full px-3 py-2 bg-purple-600 rounded text-white flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">SEO Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Site Title</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="VNC Blockchain Platform"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Meta Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  rows={3}
                  placeholder="Next generation blockchain platform..."
                />
              </div>
              <button className="px-4 py-2 bg-green-600 rounded text-white">Save SEO Settings</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Platform Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">CMS</th>
                  <th className="pb-2">Speed</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC CMS', speed: 'Ultra Fast', rating: 100 },
                  { name: 'WordPress', speed: 'Medium', rating: 85 },
                  { name: 'Contentful', speed: 'Fast', rating: 90 },
                  { name: 'Strapi', speed: 'Fast', rating: 88 },
                ].map((cms) => (
                  <tr key={cms.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{cms.name}</td>
                    <td className="py-2 text-green-400">{cms.speed}</td>
                    <td className="py-2 text-yellow-400">{cms.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedItem.title}</h3>
                <div className="text-sm text-gray-400">/{selectedItem.slug}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setShowEditModal(true);
                  }}
                  className="px-3 py-2 bg-blue-600 rounded text-white"
                >
                  Edit
                </button>
                <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-700 rounded text-white">
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-400">Type</div>
                <div className="text-lg text-white">{selectedItem.type}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="text-lg text-white">{selectedItem.status}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Author</div>
                <div className="text-lg text-white">{selectedItem.author}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Category</div>
                <div className="text-lg text-white">{selectedItem.category}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Views</div>
                <div className="text-lg text-purple-400">{selectedItem.views.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Language</div>
                <div className="text-lg text-white uppercase">{selectedItem.language}</div>
              </div>
            </div>

            {selectedItem.excerpt && (
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1">Excerpt</div>
                <div className="text-sm text-gray-300">{selectedItem.excerpt}</div>
              </div>
            )}

            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <EditModal item={selectedItem} onCancel={() => setShowEditModal(false)} onSave={saveContent} />
      )}
    </div>
  );
}

function EditModal({
  item,
  onCancel,
  onSave,
}: {
  item: ContentItem | null;
  onCancel: () => void;
  onSave: (item: ContentItem) => void;
}) {
  const [form, setForm] = useState<ContentItem>(
    item || {
      id: `c${Date.now()}`,
      title: '',
      slug: '',
      type: 'page',
      status: 'draft',
      author: 'Admin',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: 0,
      language: 'en',
      tags: [],
      category: 'Landing Pages',
      featured: false,
      fullAccess: true,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{item ? 'Edit Content' : 'Create New Content'}</h3>
          <button onClick={onCancel} className="px-2 py-1 bg-gray-800 rounded text-gray-300">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white font-mono"
                placeholder="url-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as ContentType })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="page">Page</option>
                <option value="post">Post</option>
                <option value="article">Article</option>
                <option value="component">Component</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              rows={2}
              placeholder="Short description..."
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white font-mono text-sm"
              rows={8}
              placeholder="<h1>Your content here...</h1>"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">SEO Title</label>
              <input
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="SEO optimized title"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">SEO Description</label>
              <input
                value={form.seoDescription}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Meta description"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Featured</label>
              <button
                onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`px-3 py-2 rounded ${form.featured ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                {form.featured ? 'Yes' : 'No'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Full Access (1000%)</label>
              <button
                onClick={() => setForm({ ...form, fullAccess: !form.fullAccess })}
                className={`px-3 py-2 rounded ${form.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                {form.fullAccess ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Content
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

