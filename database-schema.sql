-- ================================================
-- SCHEMA SETUP FOR STRATEGYGPT SUPABASE DATABASE
-- ================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- STRATEGIES TABLE
-- ================================================

-- Create strategies table to store user strategic plans
CREATE TABLE strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  discovery_data JSONB NOT NULL,
  strategic_plan JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_strategies_user_id ON strategies(user_id);
CREATE INDEX idx_strategies_created_at ON strategies(created_at DESC);
CREATE INDEX idx_strategies_title ON strategies USING GIN (to_tsvector('english', title));

-- ✅ ÍNDICES CORREGIDOS - Usando B-tree en lugar de GIN para campos TEXT
CREATE INDEX idx_strategies_company_name ON strategies ((discovery_data->>'companyName'));
CREATE INDEX idx_strategies_industry ON strategies ((discovery_data->>'industry'));

-- Alternativamente, si quieres búsqueda de texto completo, usa:
-- CREATE INDEX idx_strategies_company_name_fts ON strategies USING GIN (to_tsvector('english', discovery_data->>'companyName'));
-- CREATE INDEX idx_strategies_industry_fts ON strategies USING GIN (to_tsvector('english', discovery_data->>'industry'));

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on strategies table
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own strategies
CREATE POLICY "Users can only access their own strategies" ON strategies
  FOR ALL USING (auth.uid() = user_id);

-- Policy: Users can insert their own strategies
CREATE POLICY "Users can insert their own strategies" ON strategies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own strategies
CREATE POLICY "Users can update their own strategies" ON strategies
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own strategies
CREATE POLICY "Users can delete their own strategies" ON strategies
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- TRIGGERS
-- ================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on strategies table
CREATE TRIGGER update_strategies_updated_at 
    BEFORE UPDATE ON strategies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- HELPFUL FUNCTIONS
-- ================================================

-- Function to search strategies by text
CREATE OR REPLACE FUNCTION search_user_strategies(
  search_query TEXT,
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  discovery_data JSONB,
  strategic_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.user_id, s.title, s.discovery_data, s.strategic_plan, s.created_at, s.updated_at
  FROM strategies s
  WHERE s.user_id = user_uuid
    AND (
      s.title ILIKE '%' || search_query || '%' OR
      s.discovery_data->>'companyName' ILIKE '%' || search_query || '%' OR
      s.discovery_data->>'industry' ILIKE '%' || search_query || '%' OR
      to_tsvector('english', s.title) @@ plainto_tsquery('english', search_query)
    )
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
  total_strategies INTEGER;
  strategies_this_month INTEGER;
  top_industries JSON;
BEGIN
  -- Get total strategies
  SELECT COUNT(*) INTO total_strategies
  FROM strategies
  WHERE user_id = user_uuid;
  
  -- Get strategies this month
  SELECT COUNT(*) INTO strategies_this_month
  FROM strategies
  WHERE user_id = user_uuid
    AND created_at >= DATE_TRUNC('month', NOW());
  
  -- Get top industries
  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'industry', industry,
      'count', count
    )
  ) INTO top_industries
  FROM (
    SELECT 
      discovery_data->>'industry' AS industry,
      COUNT(*) AS count
    FROM strategies
    WHERE user_id = user_uuid
      AND discovery_data->>'industry' IS NOT NULL
      AND discovery_data->>'industry' != ''
    GROUP BY discovery_data->>'industry'
    ORDER BY COUNT(*) DESC
    LIMIT 5
  ) AS industry_counts;
  
  RETURN JSON_BUILD_OBJECT(
    'totalStrategies', total_strategies,
    'strategiesThisMonth', strategies_this_month,
    'topIndustries', COALESCE(top_industries, '[]'::JSON)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- PERMISSIONS & GRANTS
-- ================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON strategies TO authenticated;
GRANT EXECUTE ON FUNCTION search_user_strategies(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;

-- ================================================
-- SETUP COMPLETE
-- ================================================