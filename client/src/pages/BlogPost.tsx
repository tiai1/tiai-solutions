import { useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Section from '@/components/Section';
import { fetchPostBySlug, fetchPosts } from '@/lib/api';
import { trackPageView, trackButtonClick } from '@/lib/analytics';
import type { Post } from '../types';

export default function BlogPost() {
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      trackPageView(`blog-${slug}`);
    }
  }, [slug]);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['/data/posts', slug],
    queryFn: () => fetchPostBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['/data/posts'],
    queryFn: fetchPosts,
  });

  // Get related posts (same category, excluding current)
  const relatedPosts = allPosts
    .filter(p => p.category === post?.category && p.slug !== post?.slug)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="pt-16">
        <Section className="section-padding">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-16">
        <Section className="section-padding">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl font-bold mb-6" data-testid="blog-not-found-title">
                Article Not Found
              </h1>
              <p className="text-muted-foreground mb-8" data-testid="blog-not-found-message">
                The article you're looking for doesn't exist or may have been moved.
              </p>
              <Link href="/blog">
                <Button data-testid="button-back-to-blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </motion.div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Back Navigation */}
      <Section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => trackButtonClick('back-to-blog', 'blog-post')}
              data-testid="button-back-to-blog"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </Section>

      {/* Article Header */}
      <Section className="pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" data-testid="post-category">
                {post.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span data-testid="post-date">{formatDate(post.date)}</span>
              </div>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="post-title">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8" data-testid="post-summary">
              {post.summary}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Article Content */}
      <Section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-slate dark:prose-invert max-w-none"
            data-testid="post-content"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </motion.article>
        </div>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section className="section-padding bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl font-bold mb-8 text-center" data-testid="related-posts-title">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {relatedPost.category}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(relatedPost.date)}
                          </div>
                        </div>
                        <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {relatedPost.summary}
                        </p>
                        
                        <Link href={`/blog/${relatedPost.slug}`}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-between group-hover:bg-primary/10 transition-colors"
                            onClick={() => trackButtonClick('read-related-article', 'blog-post')}
                            data-testid={`button-read-related-${relatedPost.slug}`}
                          >
                            Read Article
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <Section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary/10 via-accent/5 to-purple-500/10 p-12 rounded-2xl"
            data-testid="blog-cta-section"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" data-testid="blog-cta-title">
              Ready to Implement These Ideas?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="blog-cta-subtitle">
              Let's discuss how to apply these automation strategies to your specific business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => trackButtonClick('start-project-from-blog', 'blog-post')}
                  data-testid="button-start-project"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => trackButtonClick('explore-more-articles', 'blog-post')}
                  data-testid="button-explore-articles"
                >
                  Explore More Articles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}