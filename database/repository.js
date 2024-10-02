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
  
    async createInterview(userid, jobdescription, interviewtype, difficulty, jobfield, status) {
        const interviewid = nanoid();  // Generates a unique ID for the interview
      
        const result = await DB.query({
          text: `
            INSERT INTO interviews (userid, interviewid, jobdescription, interviewtype, difficulty, jobfield, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
          values: [userid, interviewid, jobdescription, interviewtype, difficulty, jobfield, status],
        });
      
        return result.rows[0];  // Return the inserted row
      }


      async checkInterviewOfStatus(userid, status) {
        const result = await DB.query({
          text: `
            SELECT * 
            FROM interviews 
            WHERE userid = $1 AND status = $2`,
          values: [userid, status],
        });
      
        return result.rows[0];  // Return all matching rows
      }


     async upadateInterviewStatus(interviewId,status) {
        const result = await DB.query({
          text: `
            UPDATE interviews
            SET status = $1
            WHERE interviewid = $2
            RETURNING *`,
          values: [status, interviewId],
        });
      
        return result.rows[0];
     }
      
  
}

module.exports = Repository;
