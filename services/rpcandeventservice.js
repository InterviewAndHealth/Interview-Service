
const { Repository } = require("../database");
// A mock function to simulate user lookup


class InterviewService {
  constructor() {
    this.repository = new Repository();
  }
  
   async respondRPC(request) {
    if (request.type === 'GET_INTERVIEW_DETAILS') {
          const { interviewId } = request.data;
          const interview = await this.repository.getInterview(interviewId);
          return { data: interview };
        
     
    }
  }




  async handleEvent(event) {
    if (event.type === 'INTERVIEW_COMPLETED') {
      const { interviewId } = event.data;

      // Update the interview status in the database

      const status = 'completed';

      const interview = await this.repository.upadateInterviewStatus(interviewId, status);

      
    }else if (event.type === 'INTERVIEW_STARTED') {
      const { interviewId } = event.data;

      // Update the interview status in the database

      const status = 'running';

      const interview = await this.repository.upadateInterviewStatus(interviewId, status);

      
    }
  }
}
module.exports = {InterviewService};
