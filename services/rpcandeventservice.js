const { Repository } = require("../database");
// A mock function to simulate user lookup

class InterviewService {
  constructor() {
    this.repository = new Repository();
  }

  async respondRPC(request) {
    console.log("Request received", request);
    if (request.type === "GET_INTERVIEW_DETAILS") {
      const { interviewId } = request.data;
      const interview = await this.repository.getInterview(interviewId);
      return { data: interview };
    }
  }

  async handleEvent(event) {
    console.log("Event received", event);

    if (event.type === "INTERVIEW_COMPLETED") {
      const { interviewId } = event.data;

      // Update the interview status in the database

      const status = "completed";
      const feedback_status="pending";
      await this.repository.upadateInterviewStatus(interviewId, status);
      await this.repository.upadateInterviewFeedbackStatus(interviewId, feedback_status);

    } else if (event.type === "INTERVIEW_STARTED") {
      const { interviewId } = event.data;

      // Update the interview status in the database

      const status = "running";

      await this.repository.upadateInterviewStatus(interviewId, status);
    } else if (event.type === "INTERVIEW_DETAILS") {
      const { interviewId, transcript, feedback } = event.data;

      await this.repository.addInterviewDetails(
        interviewId,
        transcript,
        feedback
      );
    }
  }
}
module.exports = { InterviewService };
