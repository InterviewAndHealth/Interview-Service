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

    try {

      const existingscheduledinterview = await this.repository.checkInterviewOfStatus(userid,"scheduled");

      const existingrunninginterview = await this.repository.checkInterviewOfStatus(userid,"running");

      if(existingscheduledinterview||existingrunninginterview){
        throw new BadRequestError("Interview already exists");
      }

      const interview = await this.repository.createInterview(userid, jobdescription, interviewtype, difficulty, jobfield, status);

      EventService.publish(EVENT_TYPES.INTERVIEW_CREATED, {
        id: interview.interviewid,
        userid: interview.userid,
        jobdescription: interview.jobdescription,
        interviewtype: interview.interviewtype,
        difficulty: interview.difficulty,
        jobfield: interview.jobfield,
        status: interview.status
      });
      
      return{
        message: "Interview created successfully",
        interview
      }
    } catch (error) {
      return {
        message: error.message,
      };
    }
    
  }

  

  async rpc_test() {
    const data = await RPCService.request(TEST_RPC, {
      type: TEST_RPC,
      data: "Requesting data",
    });

    if (!data) throw new InternalServerError("Failed to get data");

    return data;
  }
}

module.exports = Service;
