/*
  # Create polls and poll options tables

  1. New Tables
    - `polls`
      - `id` (uuid, primary key)
      - `question` (text)
      - `createdAt` (timestamptz)
    - `poll_options`
      - `id` (uuid, primary key)
      - `pollId` (uuid, foreign key to polls)
      - `optionText` (text)
      - `votes` (integer)
      - `createdAt` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public access
*/

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  "createdAt" timestamptz DEFAULT now()
);

-- Create poll options table
CREATE TABLE IF NOT EXISTS poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "pollId" uuid REFERENCES polls(id) ON DELETE CASCADE,
  "optionText" text NOT NULL,
  votes integer DEFAULT 0,
  "createdAt" timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

-- Create security policies
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