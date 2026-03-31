-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  slug             TEXT        UNIQUE NOT NULL,
  excerpt          TEXT,
  content          TEXT,
  hero_image_url   TEXT,
  category         TEXT        NOT NULL CHECK (category IN (
    'workplace-productivity','workplace-security','workplace-ai',
    'workplace-automation','workplace-backup','cloud-migration'
  )),
  tags             TEXT[]      NOT NULL DEFAULT '{}',
  author_name      TEXT        NOT NULL,
  author_title     TEXT,
  author_avatar_url TEXT,
  reading_time     INTEGER,
  published_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  slug             TEXT        UNIQUE NOT NULL,
  excerpt          TEXT,
  content          TEXT,
  hero_image_url   TEXT,
  category         TEXT        NOT NULL CHECK (category IN (
    'company','partnership','product','industry','awards'
  )),
  reading_time     INTEGER,
  published_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read blog posts"    ON blog_posts   FOR SELECT USING (true);
CREATE POLICY "Public can read news articles" ON news_articles FOR SELECT USING (true);

-- Authenticated write access (admin)
CREATE POLICY "Authenticated can manage blog posts"    ON blog_posts   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage news articles" ON news_articles FOR ALL USING (auth.role() = 'authenticated');
