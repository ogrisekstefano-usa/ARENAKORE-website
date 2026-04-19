import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { BLOG_POSTS } from '../data/seo-content';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Fitness Blog | Competition, Training & Science | ArenaKore',
    description: 'Fitness tips, challenge guides, AMRAP training and gamification insights. No wellness fluff — just what actually works.',
  });

  useEffect(() => {
    axios.get(`${API}/blog`)
      .then(r => setPosts(r.data.length > 0 ? r.data : BLOG_POSTS.map(p => ({ ...p, read_time: p.readTime, featured_image: p.coverImage }))))
      .catch(() => setPosts(BLOG_POSTS.map(p => ({ ...p, read_time: p.readTime, featured_image: p.coverImage }))))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-black text-white min-h-screen font-inter">
      <InnerNavbar />

      {/* Hero */}
      <section className="pt-28 pb-14 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-ak-cyan inline-block" />
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-cyan">THE ARENA BLOG</span>
          </div>
          <h1 className="font-anton text-5xl md:text-7xl uppercase text-white mb-4">THE ARENA BLOG</h1>
          <p className="font-inter text-base text-white max-w-xl">Competition. Science. Training. No fluff, no wellness marketing. Just what works.</p>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-ak-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <section className="py-8 px-6 sm:px-10 bg-black">
              <div className="max-w-5xl mx-auto">
                <Link to={`/blog/${featured.slug}`} className="group block rounded-[14px] overflow-hidden border border-white/10 hover:border-ak-cyan/40 transition-all" style={{ background: '#0a0a0a' }}>
                  <div className="grid md:grid-cols-2">
                    <div className="h-56 md:h-auto overflow-hidden">
                      <img src={featured.featured_image || featured.coverImage} alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-ak-cyan border border-ak-cyan/30 px-2 py-1 rounded">{featured.category}</span>
                          <span className="font-inter text-xs text-white flex items-center gap-1"><Clock size={12} />{featured.read_time || featured.readTime}</span>
                        </div>
                        <h2 className="font-anton text-2xl md:text-3xl uppercase text-white mb-3 group-hover:text-ak-cyan transition-colors">{featured.title}</h2>
                        <p className="font-inter text-sm text-white leading-relaxed">{featured.excerpt}</p>
                      </div>
                      <div className="mt-6 flex items-center gap-2 font-inter text-sm font-bold text-ak-gold">
                        Read article <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <section className="py-10 px-6 sm:px-10 bg-black">
              <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
                {rest.map((post, i) => (
                  <Link key={post.id || post.slug || i} to={`/blog/${post.slug}`}
                    className="group rounded-[14px] overflow-hidden border border-white/10 hover:border-ak-cyan/40 transition-all flex flex-col" style={{ background: '#0a0a0a' }}>
                    <div className="h-44 overflow-hidden">
                      <img src={post.featured_image || post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-ak-cyan">{post.category}</span>
                        <span className="font-inter text-xs text-white flex items-center gap-1"><Clock size={11} />{post.read_time || post.readTime}</span>
                      </div>
                      <h3 className="font-anton text-xl uppercase text-white mb-2 group-hover:text-ak-cyan transition-colors flex-1">{post.title}</h3>
                      <p className="font-inter text-xs text-white leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2 font-inter text-xs font-bold text-ak-gold mt-auto">
                        Read <ArrowRight size={13} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <section className="py-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-4">STOP READING. START COMPETING.</h2>
          <p className="font-inter text-sm text-white mb-8">Everything you read here applies directly in ArenaKore.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/get-the-app" className="inline-flex items-center gap-3 font-inter font-black uppercase text-sm px-8 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform" style={{ height: '48px' }}>
              Get the App <ArrowRight size={16} />
            </Link>
            <Link to="/gym-challenge-pilot" className="inline-flex items-center gap-3 font-inter font-bold uppercase text-sm px-8 rounded-[14px] border border-ak-gold text-ak-gold hover:bg-ak-gold hover:text-black transition-all" style={{ height: '48px' }}>
              Gym & Coaches Pilot
            </Link>
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
