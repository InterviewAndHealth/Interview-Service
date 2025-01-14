const { Repository } = require("../database");

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

    return { error: "Invalid request" };
  }

  async handleEvent(event) {
    console.log("Event received", event);

    if (event.type === "INTERVIEW_COMPLETED") {
      const { interviewId } = event.data;

      await this.repository.updateInterviewStatusAndFeedbackStatus(
        interviewId,
        "completed",
        "pending"
      );
    } else if (event.type === "INTERVIEW_STARTED") {
      const { interviewId } = event.data;

      await this.repository.upadateInterviewStatus(interviewId, "running");
    } else if (event.type === "INTERVIEW_DETAILS") {
      const { interviewId, transcript, feedback } = event.data;

      await Promise.all([
        this.repository.addInterviewDetails(interviewId, transcript, feedback),
        this.repository.upadateInterviewFeedbackStatus(
          interviewId,
          "completed"
        ),
      ]);
    }
  }
}
module.exports = { InterviewService };
