import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, ArrowRight } from 'lucide-react';
import { InnerNavbar, InnerFooter, useSEO } from '../components/SharedLayout';
import { BLOG_POSTS } from '../data/seo-content';

function renderMarkdown(text) {
  const lines = text.trim().split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="font-anton text-2xl md:text-3xl uppercase text-white mt-10 mb-4">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="font-anton text-xl uppercase text-ak-cyan mt-8 mb-3">{line.slice(4)}</h3>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} className="font-inter text-sm font-bold text-white mb-3">{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex items-start gap-3 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ak-cyan mt-2 flex-shrink-0 inline-block" />
          <span className="font-inter text-sm text-white">{line.slice(2)}</span>
        </div>
      );
    } else if (line.startsWith('| ') && line.includes('|')) {
      // Table
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].includes('---')) rows.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto mb-6 rounded-[14px] border border-white/10">
          <table className="w-full">
            {rows.map((row, ri) => {
              const cells = row.split('|').filter(Boolean).map(c => c.trim());
              return ri === 0
                ? <thead key={ri}><tr>{cells.map((c, ci) => <th key={ci} className="px-4 py-3 text-left font-inter text-xs font-bold uppercase text-ak-cyan border-b border-white/10 bg-black/50">{c}</th>)}</tr></thead>
                : <tbody key={ri}><tr>{cells.map((c, ci) => <td key={ci} className="px-4 py-3 font-inter text-sm text-white border-b border-white/5">{c}</td>)}</tr></tbody>;
            })}
          </table>
        </div>
      );
      continue;
    } else if (line.trim() === '') {
      // empty
    } else {
      // Parse inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const content = parts.map((part, pi) =>
        pi % 2 === 1 ? <strong key={pi} className="text-white font-bold">{part}</strong> : part
      );
      elements.push(<p key={i} className="font-inter text-sm md:text-base text-white leading-relaxed mb-4">{content}</p>);
    }
    i++;
  }
  return elements;
}

export default function BlogArticlePage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useSEO({
    title: post ? post.seo_title : 'Blog | ArenaKore',
    description: post ? post.meta_description : '',
  });

  if (!post) return <Navigate to="/blog" replace />;

  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="bg-black text-white min-h-screen font-inter">
      <InnerNavbar />

      {/* Hero */}
      <section className="pt-24 pb-0 relative">
        <div className="h-[45vh] relative overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%)' }} />
        </div>
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8">
          <Link to="/blog" className="inline-flex items-center gap-2 font-inter text-xs font-semibold text-ak-cyan mb-6 hover:underline">
            <ArrowLeft size={14} /> Blog
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-ak-cyan border border-ak-cyan/30 px-2 py-1 rounded">{post.category}</span>
            <span className="font-inter text-xs text-white flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
            <span className="font-inter text-xs text-white">{post.date}</span>
          </div>
          <h1 className="font-anton text-3xl md:text-5xl uppercase text-white leading-tight">{post.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 sm:px-10 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-[14px] border border-ak-cyan/20 mb-10" style={{ background: 'rgba(0,255,255,0.03)' }}>
            <p className="font-inter text-base text-white italic">{post.excerpt}</p>
          </div>
          <article className="prose-custom">
            {renderMarkdown(post.content)}
          </article>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 px-6 sm:px-10 border-t border-white/8" style={{ background: '#050505' }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="font-anton text-2xl uppercase text-white mb-8">ALTRI ARTICOLI</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((p, i) => (
              <Link key={i} to={`/blog/${p.slug}`}
                className="group flex gap-4 p-5 rounded-[14px] border border-white/10 hover:border-ak-cyan/40 transition-all" style={{ background: '#0a0a0a' }}>
                <img src={p.coverImage} alt={p.title} className="w-20 h-20 object-cover rounded-[10px] flex-shrink-0" />
                <div>
                  <div className="font-inter text-[10px] font-bold uppercase text-ak-cyan mb-1">{p.category}</div>
                  <div className="font-anton text-base uppercase text-white group-hover:text-ak-cyan transition-colors">{p.title}</div>
                  <div className="font-inter text-xs text-white mt-1 flex items-center gap-1"><Clock size={11} />{p.readTime}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InnerFooter />
    </div>
  );
}
