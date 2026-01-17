'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  PenTool,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Download,
  Search,
  Calendar,
  User,
  Heart,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Clock,
  Lock,
  Unlock,
  Star,
  Copy,
  Settings,
} from 'lucide-react';

type PostStatus = 'published' | 'draft' | 'scheduled' | 'archived';
type PostCategory = 'news' | 'tutorial' | 'announcement' | 'update' | 'guide' | 'research';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  category: PostCategory;
  author: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  readTime: number;
  featured: boolean;
  tags: string[];
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  fullAccess: boolean;
}

interface BlogStats {
  totalPosts: number;
  published: number;
  drafts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgReadTime: number;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'p1',
    title: 'Introducing VNC Blockchain: The Future of Decentralized Finance',
    slug: 'introducing-vnc-blockchain',
    excerpt: 'Discover how VNC Blockchain is revolutionizing DeFi with 400,000 TPS and ultra-low gas fees.',
    content: '<h1>Welcome to VNC Blockchain</h1><p>Experience the next generation of blockchain technology...</p>',
    status: 'published',
    category: 'announcement',
    author: 'VNC Team',
    publishedAt: '2026-01-10',
    createdAt: '2026-01-08',
    updatedAt: '2026-01-10',
    views: 12450,
    likes: 892,
    comments: 156,
    readTime: 8,
    featured: true,
    tags: ['blockchain', 'defi', 'announcement', 'technology'],
    coverImage: '/blog/vnc-intro.jpg',
    seoTitle: 'VNC Blockchain - Revolutionary DeFi Platform',
    seoDescription: 'Learn about VNC Blockchain, the fastest and most efficient blockchain platform.',
    fullAccess: true,
  },
  {
    id: 'p2',
    title: 'How to Participate in VNC Token Presale: Complete Guide',
    slug: 'vnc-token-presale-guide',
    excerpt: 'Step-by-step tutorial on joining the VNC token presale and maximizing your investment.',
    content: '<h1>Presale Guide</h1><p>Follow these steps to participate...</p>',
    status: 'published',
    category: 'tutorial',
    author: 'Marketing Team',
    publishedAt: '2026-01-12',
    createdAt: '2026-01-11',
    updatedAt: '2026-01-12',
    views: 8730,
    likes: 654,
    comments: 89,
    readTime: 5,
    featured: true,
    tags: ['presale', 'tutorial', 'investment', 'guide'],
    coverImage: '/blog/presale-guide.jpg',
    fullAccess: true,
  },
  {
    id: 'p3',
    title: 'Understanding Smart Contracts on VNC Blockchain',
    slug: 'understanding-smart-contracts',
    excerpt: 'A deep dive into smart contract development and deployment on VNC.',
    content: '<h1>Smart Contracts</h1><p>Learn how to build...</p>',
    status: 'draft',
    category: 'tutorial',
    author: 'Tech Writer',
    createdAt: '2026-01-14',
    updatedAt: '2026-01-15',
    views: 0,
    likes: 0,
    comments: 0,
    readTime: 12,
    featured: false,
    tags: ['smart-contracts', 'development', 'tutorial'],
    fullAccess: false,
  },
  {
    id: 'p4',
    title: 'Monthly Progress Report: January 2026',
    slug: 'monthly-report-january-2026',
    excerpt: 'Our achievements, milestones, and upcoming features for January.',
    content: '<h1>January Report</h1><p>This month we achieved...</p>',
    status: 'published',
    category: 'update',
    author: 'VNC Team',
    publishedAt: '2026-01-15',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
    views: 5420,
    likes: 423,
    comments: 67,
    readTime: 6,
    featured: false,
    tags: ['update', 'report', 'progress'],
    fullAccess: true,
  },
];

const CATEGORIES = ['news', 'tutorial', 'announcement', 'update', 'guide', 'research'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'analytics' | 'settings'>('posts');

  const stats: BlogStats = useMemo(() => {
    const published = posts.filter((p) => p.status === 'published').length;
    const drafts = posts.filter((p) => p.status === 'draft').length;
    const totalViews = posts.reduce((s, p) => s + p.views, 0);
    const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
    const totalComments = posts.reduce((s, p) => s + p.comments, 0);
    const avgReadTime = posts.reduce((s, p) => s + p.readTime, 0) / posts.length;
    return {
      totalPosts: posts.length,
      published,
      drafts,
      totalViews,
      totalLikes,
      totalComments,
      avgReadTime,
    };
  }, [posts]);

  const filtered = useMemo(() => {
    return posts
      .filter((p) => (statusFilter === 'all' ? true : p.status === statusFilter))
      .filter((p) => (categoryFilter === 'all' ? true : p.category === categoryFilter))
      .filter((p) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [posts, query, statusFilter, categoryFilter]);

  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const savePost = (updated: BlogPost) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    setShowEditModal(false);
    alert('Post saved successfully!');
  };

  const toggleFullAccess = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, fullAccess: !p.fullAccess } : p)));
  };

  const _toggleFeatured = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  };

  const duplicatePost = (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      const newPost: BlogPost = {
        ...post,
        id: `p${Date.now()}`,
        title: `${post.title} (Copy)`,
        slug: `${post.slug}-copy`,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        comments: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
      alert('Post duplicated successfully!');
    }
  };

  const deletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const exportPosts = () => {
    const header = ['id', 'title', 'slug', 'status', 'category', 'author', 'views', 'likes', 'comments', 'featured'];
    const rows = posts.map((p) => [
      p.id,
      p.title,
      p.slug,
      p.status,
      p.category,
      p.author,
      p.views,
      p.likes,
      p.comments,
      p.featured,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `\"${String(cell).replace(/\"/g, '\"\"')}\"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog_posts_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <PenTool className="w-8 h-8 text-blue-400" />
            Blog Management
          </h1>
          <p className="text-gray-400">Create, publish, and manage professional blog content</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedPost(null);
              setShowEditModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalPosts}</div>
              <div className="text-sm text-gray-400">Total Posts</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {stats.published} published, {stats.drafts} drafts
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
          <div className="text-xs text-purple-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-pink-500/20">
          <div className="flex items-center justify-between mb-3">
            <Heart className="w-8 h-8 text-pink-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalLikes.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Likes</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">{stats.totalComments} comments</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.avgReadTime.toFixed(0)} min</div>
              <div className="text-sm text-gray-400">Avg Read Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
        {[
          { id: 'posts', label: 'Posts', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'posts' | 'analytics' | 'settings')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search posts"
                  placeholder="Search by title, excerpt, tags, author..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={exportPosts}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.featured && <span title="Featured"><Star className="w-4 h-4 text-yellow-400" /></span>}
                      <h3 className="text-xl font-bold text-white">{post.title}</h3>
                    </div>
                    <p className="text-gray-400 mb-3">{post.excerpt}</p>

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          post.status === 'published'
                            ? 'bg-green-500/20 text-green-300'
                            : post.status === 'draft'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : post.status === 'scheduled'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt || post.createdAt}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min read
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Eye className="w-4 h-4 text-purple-400" />
                        {post.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Heart className="w-4 h-4 text-pink-400" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        {post.comments}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleFullAccess(post.id)}
                      className={`px-3 py-2 rounded text-xs flex items-center gap-1 ${
                        post.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                      title="1000% Access"
                    >
                      {post.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleView(post)}
                      className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicatePost(post.id)}
                      className="p-2 bg-blue-800/20 border border-blue-700 rounded hover:bg-blue-800/30 text-blue-400"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 bg-red-800/20 border border-red-700 rounded hover:bg-red-800/30 text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Top Performing Posts</h3>
            <div className="space-y-3">
              {posts
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((post, i) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl font-bold text-blue-400">#{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white truncate">{post.title}</div>
                        <div className="text-xs text-gray-400">{post.views.toLocaleString()} views</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Engagement Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Average Views</span>
                </div>
                <span className="text-white font-bold">
                  {Math.round(stats.totalViews / stats.totalPosts).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-sm text-gray-300">Average Likes</span>
                </div>
                <span className="text-white font-bold">
                  {Math.round(stats.totalLikes / stats.totalPosts)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Average Comments</span>
                </div>
                <span className="text-white font-bold">
                  {Math.round(stats.totalComments / stats.totalPosts)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Category Distribution</h3>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const count = posts.filter((p) => p.category === cat).length;
                const percentage = (count / posts.length) * 100;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300 capitalize">{cat}</span>
                      <span className="text-sm text-white font-semibold">{count}</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Platform Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Features</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC Blog', features: 'All-in-One', rating: 100 },
                  { name: 'Medium', features: 'Limited', rating: 85 },
                  { name: 'WordPress', features: 'Complex', rating: 88 },
                  { name: 'Ghost', features: 'Basic', rating: 82 },
                ].map((platform) => (
                  <tr key={platform.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{platform.name}</td>
                    <td className="py-2 text-gray-300">{platform.features}</td>
                    <td className="py-2 text-yellow-400">{platform.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Blog Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Blog Title</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="VNC Blockchain Blog"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Blog Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  rows={3}
                  placeholder="Latest news and updates from VNC..."
                />
              </div>
              <button className="px-4 py-2 bg-green-600 rounded text-white">Save Settings</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Default Tags</h3>
            <div className="space-y-2">
              {['blockchain', 'cryptocurrency', 'defi', 'vnc', 'technology'].map((tag) => (
                <div key={tag} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <span className="text-sm text-white">#{tag}</span>
                  <button className="p-1 bg-red-800/20 rounded text-red-400 hover:text-red-300">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button className="w-full px-3 py-2 bg-blue-600 rounded text-white flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPost && (
        <ViewModal post={selectedPost} onClose={() => setShowViewModal(false)} onEdit={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }} />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          post={selectedPost}
          onCancel={() => setShowEditModal(false)}
          onSave={savePost}
        />
      )}
    </div>
  );
}

function ViewModal({ post, onClose, onEdit }: { post: BlogPost; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {post.featured && <Star className="w-5 h-5 text-yellow-400" />}
              <h3 className="text-2xl font-bold text-white">{post.title}</h3>
            </div>
            <div className="text-sm text-gray-400">/{post.slug}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="px-3 py-2 bg-blue-600 rounded text-white">
              Edit
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs text-gray-400">Status</div>
            <div className="text-lg text-white capitalize">{post.status}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Category</div>
            <div className="text-lg text-white capitalize">{post.category}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Author</div>
            <div className="text-lg text-white">{post.author}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Published</div>
            <div className="text-lg text-white">{post.publishedAt || 'Not published'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Views</div>
            <div className="text-lg text-purple-400">{post.views.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Engagement</div>
            <div className="text-lg text-pink-400">{post.likes} likes, {post.comments} comments</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">Excerpt</div>
          <div className="text-sm text-gray-300">{post.excerpt}</div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EditModal({
  post,
  onCancel,
  onSave,
}: {
  post: BlogPost | null;
  onCancel: () => void;
  onSave: (post: BlogPost) => void;
}) {
  const [form, setForm] = useState<BlogPost>(
    post || {
      id: `p${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'draft',
      category: 'news',
      author: 'Admin',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      comments: 0,
      readTime: 5,
      featured: false,
      tags: [],
      fullAccess: true,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{post ? 'Edit Post' : 'Create New Post'}</h3>
          <button onClick={onCancel} className="px-2 py-1 bg-gray-800 rounded text-gray-300">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="Post title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white font-mono"
                placeholder="post-slug"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Author</label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              rows={2}
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white font-mono text-sm"
              rows={10}
              placeholder="<h1>Your content here...</h1>"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PostStatus })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as PostCategory })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Read Time (min)</label>
              <input
                type="number"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Featured</label>
              <button
                onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`px-3 py-2 rounded ${
                  form.featured ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {form.featured ? 'Yes' : 'No'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Full Access (1000%)</label>
              <button
                onClick={() => setForm({ ...form, fullAccess: !form.fullAccess })}
                className={`px-3 py-2 rounded ${
                  form.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
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
            Save Post
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

