import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Heart, MessageCircle, Share2, User } from 'lucide-react';
import blogService from '../../services/blogService';
import { BlogResponse } from '../../types/blog';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(42);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'Great article! Really helped me understand TypeScript better.',
      date: '2024-01-21',
      likes: 5
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'The examples are very clear and practical. Thanks for sharing!',
      date: '2024-01-21',
      likes: 3
    }
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      if (slug) {
        try {
          const blogData = await blogService.getBlogBySlug(slug);
          setPost(blogData);
          setError(null);
        } catch (err) {
          setError('Failed to load blog post');
          console.error('Error fetching blog:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error || "Blog Post Not Found"}
          </h1>
          <p className="text-gray-600 mb-8">
            {error ? "An error occurred while loading the blog post." : "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'Guest User',
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mb-8">
          <Link to="/blogs" className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-12">
          <div className="mb-6">
            <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded-full border border-orange-200">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">{post.title}</h1>
          <div className="flex items-center justify-between text-gray-500 mb-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleLike} className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${liked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500'}`}>
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                <span>{likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
          {post.image && (
            <img src={post.image.url} alt={post.title} className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-lg" />
          )}
        </motion.header>

        {/* Article Content with Prose */}
        <div className=" prose prose-orange max-w-none dark:prose-invert text-black">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Comments Section */}
        <motion.section initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
            <MessageCircle size={24} />
            <span>Comments ({comments.length})</span>
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
              rows={4}
            />
            <button type="submit" className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <motion.div key={comment.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart size={14} />
                    <span>{comment.likes}</span>
                  </button>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default BlogDetail;
