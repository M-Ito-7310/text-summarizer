-- Initialize PostgreSQL database with pgvector extension

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create texts table for storing processed documents
CREATE TABLE IF NOT EXISTS texts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT NOT NULL,
    summary TEXT,
    keywords JSONB,
    metadata JSONB DEFAULT '{}',
    embedding vector(384), -- For future semantic search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_texts_created_at ON texts(created_at);
CREATE INDEX IF NOT EXISTS idx_texts_title ON texts(title);
CREATE INDEX IF NOT EXISTS idx_texts_keywords ON texts USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_texts_metadata ON texts USING GIN (metadata);

-- Create index for vector similarity search (cosine distance)
CREATE INDEX IF NOT EXISTS idx_texts_embedding ON texts USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create processing_jobs table for async processing tracking
CREATE TABLE IF NOT EXISTS processing_jobs (
    id SERIAL PRIMARY KEY,
    job_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    input_data JSONB NOT NULL,
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_created_at ON processing_jobs(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_texts_updated_at 
    BEFORE UPDATE ON texts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO texts (title, content, summary, keywords, metadata) VALUES 
(
    'Sample Document',
    'This is a sample document for testing the text summarization and keyword extraction functionality. It contains multiple sentences with various topics including technology, artificial intelligence, and natural language processing. The system should be able to extract meaningful keywords and create a concise summary of this content.',
    'Sample document for testing text summarization and keyword extraction with topics like technology and AI.',
    '["technology", "artificial intelligence", "natural language processing", "text summarization", "keyword extraction"]',
    '{"word_count": 45, "language": "en", "category": "sample"}'
) ON CONFLICT DO NOTHING;