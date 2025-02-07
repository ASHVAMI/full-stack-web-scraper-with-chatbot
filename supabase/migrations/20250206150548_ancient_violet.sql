/*
  # Create tables for web scraper chatbot

  1. New Tables
    - `scraped_content`
      - `id` (uuid, primary key)
      - `url` (text, unique)
      - `content` (text)
      - `created_at` (timestamp)
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `url` (text)
      - `created_at` (timestamp)
    - `messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `role` (text)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create scraped_content table
CREATE TABLE IF NOT EXISTS scraped_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scraped_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to scraped content"
  ON scraped_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to scraped content"
  ON scraped_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow read access to chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow read access to messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);