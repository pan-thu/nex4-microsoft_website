-- Add author fields to news_articles
ALTER TABLE news_articles
  ADD COLUMN IF NOT EXISTS author_name      TEXT,
  ADD COLUMN IF NOT EXISTS author_title     TEXT,
  ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;

-- Add speakers to events (JSONB array: [{name, photo_url}])
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS speakers JSONB NOT NULL DEFAULT '[]';

-- Add cv_url to job_applications
ALTER TABLE job_applications
  ADD COLUMN IF NOT EXISTS cv_url TEXT;
