const bcrypt = require("bcrypt");
const { Repository } = require("../database");
const {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} = require("../utils/errors");
const { EventService, RPCService } = require("./broker");
const { EVENT_TYPES, TEST_QUEUE, TEST_RPC } = require("../config");

// Service will contain all the business logic
class Service {
  constructor() {
    this.repository = new Repository();
  }

  async createinterview(userid, jobdescription, interviewtype, difficulty, jobfield, status,city,country) {
      
      const existingscheduledinterview = await this.repository.checkInterviewOfStatus(userid,"scheduled");

      const existingrunninginterview = await this.repository.checkInterviewOfStatus(userid,"running");

      if(existingscheduledinterview||existingrunninginterview){
        throw new BadRequestError("Interview already exists");
      }

      const interview = await this.repository.createInterview(userid, jobdescription, interviewtype, difficulty, jobfield, status,city,country);

      
      return{
        message: "Interview created successfully",
        interview
      }
    
    
  }

  async getinterview(userid) {
    const result = await this.repository.getInterviewByUserId(userid);

    if (result.length === 0) {
      throw new NotFoundError("No interview found");
    }

    return {
      message: "Interview found",
      interview: result
    }
  }


  async getAllCompletedInterviews(userid) {
    // Fetch all completed interviews from the database
    const completedInterviews = await this.repository.getCompletedInterviews(userid);
    return completedInterviews;
  }


  async getLatestCompletedInterview(userid) {
    // Fetch the latest completed interview for the user
    return await this.repository.getLatestCompletedInterview(userid);
  }
  
  async calculateRank(city, country, finalScore) {
    // Fetch city and country ranks based on finalScore
    const cityRank = await this.repository.getCityRank(city, finalScore);
    const countryRank = await this.repository.getCountryRank(country, finalScore);
  
    return { cityrank: cityRank, countryrank: countryRank };
  }
  

}

module.exports = Service;
