-- 1️⃣ ENUM type pehle create kar
CREATE TYPE project_type AS ENUM ('Internship', 'Personal', 'Freelance');


-- 3️⃣ SKILLS TABLE
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority INTEGER NOT NULL,
    icon_url VARCHAR(255) NOT NULL,
    CONSTRAINT unique_skill UNIQUE (name, category)
);

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary VARCHAR(1000) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time VARCHAR(50) NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_images (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    public_id VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL
);


-- 6️⃣ PROJECTS TABLE (updated with SERIAL instead of BIGSERIAL)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    github_url VARCHAR(255),
    live_demo_url VARCHAR(255),
    live BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    type project_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7️⃣ PROJECT_KEY_FEATURES TABLE
CREATE TABLE project_key_features (
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    key_feature VARCHAR(255) NOT NULL,
    PRIMARY KEY (project_id, key_feature)
);

-- 8️⃣ PROJECT_TECHNOLOGIES TABLE (Linked to skills)
CREATE TABLE project_technologies (
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- 9️⃣ PROJECT_IMAGES TABLE


CREATE TABLE project_images (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    public_id VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL
);



CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issued_organisation VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    media_url TEXT NOT NULL,
    credential_id VARCHAR(255) NOT NULL,
    credential_url TEXT NOT NULL
);

CREATE TABLE contacts (
    id BIGSERIAL  PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 🔟 INDEXES for fast filtering/search
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_project_technologies_skill_id ON project_technologies(skill_id);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_slug ON blogs(slug);

-- 1️⃣1️⃣ TRIGGER function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1️⃣2️⃣ Apply trigger on blogs and projects
CREATE TRIGGER set_timestamp_projects
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_blogs
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
