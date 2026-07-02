import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PublicPageLayout, { AdUnit } from "../../components/common/PublicPageLayout";
import { getPostBySlug, blogPosts } from "./blogPosts";

// Renders markdown-like content (headings, paragraphs, bold)
function renderContent(content) {
  const lines = content.trim().split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-[22px] font-semibold text-on-background tracking-tight mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-[17px] font-semibold text-on-background tracking-tight mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      // Collect consecutive list items
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-2 my-4 text-[15px] text-on-surface-variant leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          ))}
        </ul>
      );
      continue;
    } else if (line === "") {
      // skip blank lines (spacing handled by margins)
    } else {
      // Regular paragraph — handle **bold**
      const html = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
      elements.push(
        <p key={i} className="text-[15px] text-on-surface-variant leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    i++;
  }

  return elements;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const otherPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <PublicPageLayout>
      <Helmet>
        <title>{post.title} | DistillAI Blog</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.distillai.tech/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.description,
          "datePublished": post.date,
          "author": { "@type": "Organization", "name": "DistillAI", "url": "https://www.distillai.tech/about" },
          "publisher": { "@type": "Organization", "name": "DistillAI", "url": "https://www.distillai.tech" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.distillai.tech/blog/${post.slug}` }
        })}</script>
      </Helmet>

      <div className="max-w-[720px] mx-auto px-6 py-[60px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-on-surface-variant mb-8">
          <Link to="/blog" className="hover:text-on-background transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-on-background truncate max-w-[300px]">{post.title}</span>
        </div>

        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-primary border border-primary/30 bg-primary/5 rounded px-2 py-1">
            {post.category}
          </span>
          <span className="font-mono text-[12px] text-on-surface-variant">{post.date}</span>
          <span className="font-mono text-[12px] text-on-surface-variant">· {post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-[clamp(26px,4vw,38px)] font-semibold tracking-tight leading-[1.2] text-on-background mb-4">
          {post.title}
        </h1>

        {/* Description / lead */}
        <p className="text-[17px] text-on-surface-variant leading-relaxed mb-8 border-l-2 border-primary/40 pl-4 italic">
          {post.description}
        </p>

        {/* Author byline */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[13px] font-semibold text-primary">D</span>
          </div>
          <div>
            <Link to="/about" className="text-[13px] font-medium text-on-background hover:text-primary transition-colors">
              {post.author || "DistillAI Team"}
            </Link>
            <div className="text-[12px] text-on-surface-variant">{post.date} · {post.readTime}</div>
          </div>
        </div>

        <hr className="border-outline-variant mb-8" />

        {/* Article body with mid-article ad */}
        <article className="prose-custom">
          {renderContent(post.content)}
        </article>

        {/* Mid-article ad unit */}
        <AdUnit slot="auto" />

        <hr className="border-outline-variant mt-12 mb-10" />

        {/* CTA */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-8 text-center mb-12">
          <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-primary mb-3">Try it for free</div>
          <h2 className="text-[22px] font-semibold tracking-tight text-on-background mb-2">Put these ideas into practice</h2>
          <p className="text-[14px] text-on-surface-variant mb-6 max-w-[420px] mx-auto leading-relaxed">
            DistillAI turns your syllabus into a spaced-repetition study plan in minutes. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-[14px] text-on-primary transition-colors hover:opacity-80"
          >
            Start learning free
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        {/* More articles */}
        {otherPosts.length > 0 && (
          <div>
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-5">More articles</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherPosts.map(p => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group p-5 border border-outline-variant rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-primary">{p.category}</span>
                  <h3 className="text-[14px] font-semibold text-on-background mt-1 leading-snug group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <span className="font-mono text-[11px] text-on-surface-variant mt-2 block">{p.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}
