-- USERS & ROLES
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL  -- e.g. 'ROLE_USER', 'ROLE_ADMIN'
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100),
  password_hash VARCHAR(255),       -- nullable for OAuth-only accounts
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- OAUTH PROVIDERS (social login)
CREATE TABLE oauth_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google','github'
  provider_user_id VARCHAR(255) NOT NULL,
  provider_data JSONB,           -- raw profile if needed
  UNIQUE(provider, provider_user_id)
);

-- EMAIL VERIFICATION / OTP (store hashed OTP)
CREATE TABLE email_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  otp_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  consumed BOOLEAN DEFAULT false
);

-- PASSWORD RESET (hashed token)
CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  consumed BOOLEAN DEFAULT false
);

-- REFRESH TOKENS (for token revocation / rotation)
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT false,
  device_info VARCHAR(512)
);

-- FAILED LOGINS (account lockout)
CREATE TABLE failed_logins (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  ip VARCHAR(50),
  occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOG
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(255),
  details JSONB,
  ip VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_verifications_otp_hash ON email_verifications(otp_hash);
CREATE INDEX idx_failed_logins_occurred_at ON failed_logins(occurred_at);
CREATE INDEX idx_password_resets_token_hash ON password_resets(token_hash);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_users_username ON users(username);