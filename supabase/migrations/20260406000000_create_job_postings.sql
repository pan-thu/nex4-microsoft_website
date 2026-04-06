-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT        NOT NULL,
  slug               TEXT        UNIQUE NOT NULL,
  summary            TEXT,
  description        TEXT,
  hero_image_url     TEXT,
  workplace_type     TEXT        NOT NULL CHECK (workplace_type IN ('Hybrid', 'Office', 'Remote')),
  city               TEXT        NOT NULL DEFAULT '',
  open_to_relocation BOOLEAN     NOT NULL DEFAULT false,
  specialization     TEXT        NOT NULL DEFAULT '',
  skills             TEXT[]      NOT NULL DEFAULT '{}',
  is_hot             BOOLEAN     NOT NULL DEFAULT false,
  status             TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Public can read active job postings
CREATE POLICY "Public can read active job postings"
  ON job_postings FOR SELECT USING (status = 'active');

-- Authenticated can manage all job postings (admin)
CREATE POLICY "Authenticated can manage job postings"
  ON job_postings FOR ALL USING (auth.role() = 'authenticated');
