const { customAlphabet } = require("nanoid");
const DB = require("./db");

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

// Repository will be used to interact with the database
class Repository {
  async getInterview(interviewId) {
    const result = await DB.query({
      text: "SELECT * FROM interviews WHERE interviewid = $1",
      values: [interviewId],
    });
    return result.rows[0];
  }

  async getInterviewByUserId(userid) {
    const result = await DB.query({
      text: "SELECT * FROM interviews WHERE userid = $1",
      values: [userid],
    });
    return result.rows;
  }

  async createInterview(
    userid,
    jobdescription,
    interviewtype,
    difficulty,
    jobfield,
    status,
    feedback_status,
    city,
    country
  ) {
    const interviewid = nanoid(); // Generates a unique ID for the interview

    const result = await DB.query({
      text: `
            INSERT INTO interviews (userid, interviewid, jobdescription, interviewtype, difficulty, jobfield, status, feedback_status,city,country) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
      values: [
        userid,
        interviewid,
        jobdescription,
        interviewtype,
        difficulty,
        jobfield,
        status,
        feedback_status,
        city,
        country,
      ],
    });

    return result.rows[0]; // Return the inserted row
  }

  async checkInterviewOfStatus(userid, status) {
    const result = await DB.query({
      text: `
            SELECT * 
            FROM interviews 
            WHERE userid = $1 AND status = $2`,
      values: [userid, status],
    });

    return result.rows[0]; // Return all matching rows
  }

  async upadateInterviewStatus(interviewId, status) {
    const result = await DB.query({
      text: `
            UPDATE interviews
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE interviewid = $2
            RETURNING *`,
      values: [status, interviewId],
    });

    return result.rows[0];
  }

  async upadateInterviewFeedbackStatus(interviewId, feedback_status) {
    const result = await DB.query({
      text: `
            UPDATE interviews
            SET feedback_status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE interviewid = $2
            RETURNING *`,
      values: [feedback_status, interviewId],
    });

    return result.rows[0];
  }

  async updateInterviewStatusAndFeedbackStatus(
    interviewId,
    status,
    feedback_status
  ) {
    const result = await DB.query({
      text: `
            UPDATE interviews
            SET status = $1, feedback_status = $2, updated_at = CURRENT_TIMESTAMP
            WHERE interviewid = $3
            RETURNING *`,
      values: [status, feedback_status, interviewId],
    });

    return result.rows[0];
  }

  async addInterviewDetails(interviewId, transcript, feedback) {
    const serializedTranscript = JSON.stringify(transcript);
    const serializedFeedback = JSON.stringify(feedback);
    const result = await DB.query({
      text: `INSERT INTO interviewdetails (interviewid,transcript,feedback)
        VALUES ($1,$2,$3) RETURNING *`,
      values: [interviewId, serializedTranscript, serializedFeedback],
    });

    return result.rows[0];
  }

  async getCompletedInterviews(userid) {
    const result = await DB.query({
      text: `SELECT * FROM interviews 
               LEFT JOIN interviewdetails ON interviews.interviewid = interviewdetails.interviewid 
               WHERE userid = $1 AND status = 'completed'`,

      values: [userid],
    });
    return result.rows;
  }

  async getLatestCompletedInterview(userid) {
    const result = await DB.query({
      text: `SELECT * FROM interviews 
               JOIN interviewdetails ON interviews.interviewid = interviewdetails.interviewid 
               WHERE userid = $1 AND status = 'completed' 
               ORDER BY interviews.created_at DESC LIMIT 1`,
      values: [userid],
    });
    return result.rows[0];
  }

  async getCityRank(city, finalScore) {
    const result = await DB.query({
      text: `SELECT COUNT(*) + 1 AS rank FROM interviews 
               JOIN interviewdetails ON interviews.interviewid = interviewdetails.interviewid 
                WHERE (feedback->>'final_score')::numeric > $1 AND city = $2`,
      values: [finalScore, city],
    });
    return result.rows[0].rank;
  }

  async getCountryRank(country, finalScore) {
    const result = await DB.query({
      text: `SELECT COUNT(*) + 1 AS rank FROM interviews 
               JOIN interviewdetails ON interviews.interviewid = interviewdetails.interviewid 
               WHERE (feedback->>'final_score')::numeric > $1 AND country = $2`,
      values: [finalScore, country],
    });
    return result.rows[0].rank;
  }
}

module.exports = Repository;
