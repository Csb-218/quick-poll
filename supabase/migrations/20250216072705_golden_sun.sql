/*
  # Polling App Schema

  1. New Tables
    - `polls`
      - `id` (uuid, primary key)
      - `question` (text)
      - `created_at` (timestamp)
    - `poll_options`
      - `id` (uuid, primary key)
      - `poll_id` (uuid, foreign key)
      - `option_text` (text)
      - `votes` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read/write access (since we're not using auth)
*/

CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on polls"
  ON polls FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on polls"
  ON polls FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access on poll_options"
  ON poll_options FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on poll_options"
  ON poll_options FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access on poll_options"
  ON poll_options FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);