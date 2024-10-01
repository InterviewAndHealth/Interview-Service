
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_type') THEN
        CREATE TYPE interview_type AS ENUM ('behaviour', 'coding', 'communication', 'knowledge');
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
        CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_status') THEN
        CREATE TYPE interview_status AS ENUM ('scheduled', 'running', 'completed');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS interviews (
    userid VARCHAR(255),                       
    interviewid VARCHAR(255) PRIMARY KEY,  
    jobdescription TEXT,                       
    interviewtype interview_type,              
    difficulty difficulty_level,               
    jobfield VARCHAR(255),                     
    status interview_status,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP                   
);

