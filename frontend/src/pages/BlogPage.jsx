import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { BLOG_POSTS } from '../data/seo-content';

export default function BlogPage() {
  useSEO({
    title: 'Fitness Blog | Challenges, Competition & Training | ArenaKore',
    description: 'Fitness tips, challenge guides, AMRAP training and gamification insights from the ArenaKore team.',
  });

  return (
    <div className="bg-black text-white min-h-screen font-inter">
      <InnerNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-ak-cyan inline-block" />
            <span className="font-inter text-xs font-bold tracking-[0.3em] uppercase text-ak-cyan">THE ARENA BLOG</span>
          </div>
          <h1 className="font-anton text-5xl md:text-7xl uppercase text-white mb-4">THE ARENA BLOG</h1>
          <p className="font-inter text-base text-white max-w-xl">
            Competition. Science. Training. No fluff, no wellness marketing. Just what works.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-8 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto">
          <Link to={`/blog/${BLOG_POSTS[0].slug}`} className="group block rounded-[14px] overflow-hidden border border-white/10 hover:border-ak-cyan/40 transition-all" style={{ background: '#0a0a0a' }}>
            <div className="grid md:grid-cols-2">
              <div className="h-56 md:h-auto overflow-hidden">
                <img src={BLOG_POSTS[0].coverImage} alt={BLOG_POSTS[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-ak-cyan border border-ak-cyan/30 px-2 py-1 rounded">{BLOG_POSTS[0].category}</span>
                    <span className="font-inter text-xs text-white flex items-center gap-1"><Clock size={12} />{BLOG_POSTS[0].readTime}</span>
                  </div>
                  <h2 className="font-anton text-2xl md:text-3xl uppercase text-white mb-3 group-hover:text-ak-cyan transition-colors">{BLOG_POSTS[0].title}</h2>
                  <p className="font-inter text-sm text-white leading-relaxed">{BLOG_POSTS[0].excerpt}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 font-inter text-sm font-bold text-ak-gold">
                  Leggi l'articolo <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Grid posts */}
      <section className="py-12 px-6 sm:px-10 bg-black">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          {BLOG_POSTS.slice(1).map((post, i) => (
            <Link key={i} to={`/blog/${post.slug}`}
              className="group rounded-[14px] overflow-hidden border border-white/10 hover:border-ak-cyan/40 transition-all flex flex-col" style={{ background: '#0a0a0a' }}>
              <div className="h-44 overflow-hidden">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-ak-cyan">{post.category}</span>
                  <span className="font-inter text-xs text-white flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                </div>
                <h3 className="font-anton text-xl uppercase text-white mb-2 group-hover:text-ak-cyan transition-colors flex-1">{post.title}</h3>
                <p className="font-inter text-xs text-white leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 font-inter text-xs font-bold text-ak-gold mt-auto">
                  Leggi <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 sm:px-10" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-anton text-3xl md:text-4xl uppercase text-white mb-4">SMETTI DI LEGGERE. INIZIA A COMPETERE.</h2>
          <p className="font-inter text-sm text-white mb-8">Tutto quello che leggi qui ha un'applicazione diretta in ArenaKore.</p>
          <Link to="/fitness-challenge-app"
            className="inline-flex items-center gap-3 font-inter font-black uppercase text-sm px-10 rounded-[14px] bg-ak-gold text-black hover:scale-105 transition-transform"
            style={{ height: '52px' }}>
            Scopri l'App <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
