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

  async createinterview(userid, jobdescription, interviewtype, difficulty, jobfield, status) {
      
      const existingscheduledinterview = await this.repository.checkInterviewOfStatus(userid,"scheduled");

      const existingrunninginterview = await this.repository.checkInterviewOfStatus(userid,"running");

      if(existingscheduledinterview||existingrunninginterview){
        throw new BadRequestError("Interview already exists");
      }

      const interview = await this.repository.createInterview(userid, jobdescription, interviewtype, difficulty, jobfield, status);

      
      return{
        message: "Interview created successfully",
        interview
      }
    
    
  }

}

module.exports = Service;
