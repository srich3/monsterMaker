-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monsters table
CREATE TABLE monsters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    size TEXT DEFAULT 'medium',
    rarity TEXT DEFAULT 'common',
    hp INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 15,
    perception INTEGER DEFAULT 0,
    fortitude INTEGER DEFAULT 0,
    reflex INTEGER DEFAULT 0,
    will INTEGER DEFAULT 0,
    description TEXT,
    private_notes TEXT,
    image_url TEXT,
    skills JSONB DEFAULT '{}',
    attacks JSONB DEFAULT '[]',
    items JSONB DEFAULT '[]',
    spells JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_monsters_user_id ON monsters(user_id);
CREATE INDEX idx_monsters_created_at ON monsters(created_at DESC);
CREATE INDEX idx_monsters_name ON monsters(name);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for monsters
CREATE POLICY "Users can view own monsters" ON monsters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monsters" ON monsters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own monsters" ON monsters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own monsters" ON monsters
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monsters_updated_at
    BEFORE UPDATE ON monsters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 