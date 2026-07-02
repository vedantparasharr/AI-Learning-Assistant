import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PublicPageLayout from "../../components/common/PublicPageLayout";
import { blogPosts } from "./blogPosts";

export default function BlogIndexPage() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Blog — Study Science & Learning Techniques | DistillAI</title>
        <meta name="description" content="Science-backed articles on spaced repetition, active recall, exam preparation, and how to study effectively. Learn the research behind DistillAI." />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-6 py-[80px]">
        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Blog</div>
          <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight leading-[1.15] text-on-background mb-3">
            Study smarter. Understand why.
          </h1>
          <p className="text-[16px] text-on-surface-variant max-w-[540px] leading-relaxed">
            Articles on the science of memory, effective study techniques, and how to prepare for exams — all grounded in cognitive research.
          </p>
        </div>

        <hr className="border-t border-outline-variant mb-12" />

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group p-7 border border-outline-variant rounded-2xl bg-surface hover:bg-surface-container-low transition-colors flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-primary border border-primary/30 bg-primary/5 rounded px-2 py-1">
                  {post.category}
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">{post.readTime}</span>
              </div>

              <h2 className="text-[16px] font-semibold text-on-background leading-snug tracking-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-[13px] text-on-surface-variant leading-relaxed line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-[12px] text-on-surface-variant font-mono">{post.date}</span>
                <span className="text-[13px] text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PublicPageLayout>
  );
}
