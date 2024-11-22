ALTER TABLE interviews
ADD COLUMN feedback_status VARCHAR(255);

UPDATE interviews
SET feedback_status = CASE
    WHEN status = 'scheduled' THEN 'NA'
    WHEN interviewid IN (
        SELECT i.interviewid
        FROM interviews i
        JOIN interviewdetails d ON i.interviewid = d.interviewid
    ) THEN 'completed'
    ELSE 'pending'
END;

