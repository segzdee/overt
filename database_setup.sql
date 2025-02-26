-- Users table (already created)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'agency', 'shift-worker', 'company')) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    agency_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    company_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('open', 'filled', 'cancelled')) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Shifts table
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id),
    worker_id UUID REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status TEXT CHECK (status IN ('available', 'assigned', 'completed', 'cancelled')) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id),
    worker_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Allow authenticated users to insert their record"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to select their own record"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own record"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Policies for clients table
CREATE POLICY "Allow agencies to insert clients"
ON clients FOR INSERT
WITH CHECK (auth.uid() = agency_id);

CREATE POLICY "Allow agencies to select their clients"
ON clients FOR SELECT
USING (auth.uid() = agency_id);

CREATE POLICY "Allow agencies to update their clients"
ON clients FOR UPDATE
USING (auth.uid() = agency_id);

-- Policies for jobs table
CREATE POLICY "Allow companies to insert jobs"
ON jobs FOR INSERT
WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Allow companies to select their jobs"
ON jobs FOR SELECT
USING (auth.uid() = company_id);

CREATE POLICY "Allow companies to update their jobs"
ON jobs FOR UPDATE
USING (auth.uid() = company_id);

CREATE POLICY "Allow shift workers to view open jobs"
ON jobs FOR SELECT
USING (status = 'open');

-- Policies for shifts table
CREATE POLICY "Allow companies to insert shifts"
ON shifts FOR INSERT
WITH CHECK (auth.uid() = (SELECT company_id FROM jobs WHERE id = shifts.job_id));

CREATE POLICY "Allow companies to select their shifts"
ON shifts FOR SELECT
USING (auth.uid() = (SELECT company_id FROM jobs WHERE id = shifts.job_id));

CREATE POLICY "Allow workers to select their shifts"
ON shifts FOR SELECT
USING (auth.uid() = worker_id);

CREATE POLICY "Allow companies to update shifts"
ON shifts FOR UPDATE
USING (auth.uid() = (SELECT company_id FROM jobs WHERE id = shifts.job_id));

-- Policies for applications table
CREATE POLICY "Allow workers to insert applications"
ON applications FOR INSERT
WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Allow workers to select their applications"
ON applications FOR SELECT
USING (auth.uid() = worker_id);

CREATE POLICY "Allow companies to select applications for their jobs"
ON applications FOR SELECT
USING (auth.uid() = (SELECT company_id FROM jobs WHERE id = applications.job_id));

CREATE POLICY "Allow companies to update application status"
ON applications FOR UPDATE
USING (auth.uid() = (SELECT company_id FROM jobs WHERE id = applications.job_id));

