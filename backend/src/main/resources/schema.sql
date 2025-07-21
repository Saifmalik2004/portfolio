-- PERSON TABLE
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SKILLS TABLE
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority INTEGER NOT NULL,
    icon_url VARCHAR(255) NOT NULL
);

-- BLOGS TABLE
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
-- BLOG_IMAGES TABLE
CREATE TABLE blog_images (
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    image VARCHAR(255) NOT NULL,
    PRIMARY KEY (blog_id, image)
);


-- PROJECTS TABLE
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
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


-- PROJECT_KEY_FEATURES TABLE
CREATE TABLE project_key_features (
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    key_feature VARCHAR(255) NOT NULL,
    PRIMARY KEY (project_id, key_feature)
);

-- PROJECT_TECHNOLOGIES TABLE (linked to skills)
CREATE TABLE project_technologies (
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);




-- PROJECT_IMAGES TABLE
CREATE TABLE project_images (
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    image VARCHAR(255) NOT NULL,
    PRIMARY KEY (project_id, image)
);

CREATE TYPE project_type AS ENUM ('Internship', 'Personal', 'Freelance');

