const express = require("express");
const { Service } = require("../services");
const authMiddleware = require("../middlewares/auth");
const { RPCService } = require("../services/broker");

const { RPC_TYPES, USERS_RPC } = require("../config");

const router = express.Router();
const service = new Service();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Interview Service" });
});

router.post("/createinterview", authMiddleware, async (req, res) => {
  const { jobdescription, interviewtype, difficulty, jobfield } = req.body;

  const status = "scheduled";
  const feedback_status="NA";

  const userid = req.userId;

  const userDetails = await RPCService.request(USERS_RPC, {
    type: RPC_TYPES.GET_USER_DETAILS,
    data: {
      userId: userid,
    },
  });

  // console.log(userDetails);
  const city = userDetails.data.city;
  const country = userDetails.data.country;

  const data = await service.createinterview(
    userid,
    jobdescription,
    interviewtype,
    difficulty,
    jobfield,
    status,
    feedback_status,
    city,
    country
  );
  return res.status(200).json(data);
});

router.get("/getinterview", authMiddleware, async (req, res) => {
  const userid = req.userId;
  const data = await service.getinterview(userid);
  return res.status(200).json(data);
});

router.get("/getallinterviews", authMiddleware, async (req, res) => {
  const userid = req.userId;

  // console.log(userid);
  // Get all completed interviews for the user
  const interviews = await service.getAllCompletedInterviews(userid);

  // console.log(interviews);

  // If any interview does not have feedback data, add a message for feedback status
  const interviewsWithStatus = interviews.map((interview) => {
    if (!interview.feedback || Object.keys(interview.feedback).length === 0) {
      interview.feedbackAvailable = 0;
      interview.feedbackStatus = "Feedback yet to be generated";
    } else {
      interview.feedbackAvailable = 1;
      interview.feedbackStatus = "Feedback generated";
    }
    return interview;
  });

  // console.log(interviewsWithStatus);

  return res.status(200).json(interviewsWithStatus);
});

// GET latest completed interview with rank
router.get("/getlatestinterview", authMiddleware, async (req, res) => {
  const userid = req.userId;

  // Fetch the latest completed interview for the user
  const latestInterview = await service.getLatestCompletedInterview(userid);
  // console.log(latestInterview);

  // If no completed interview exists, return an error
  if (!latestInterview) {
    return res.status(404).json({
      error: "Feedback and rank for the latest interview not yet generated",
    });
  }

  // Get user details from students table using RPC
  const userDetails = await RPCService.request(USERS_RPC, {
    type: RPC_TYPES.GET_USER_DETAILS,
    data: { userId: userid },
  });

  // console.log(userDetails);

  // Calculate ranks based on the final score
  const finalScore = latestInterview.feedback.final_score;
  const { cityrank, countryrank } = await service.calculateRank(
    userDetails.data.city,
    userDetails.data.country,
    finalScore
  );

  // console.log(cityrank);
  // console.log(countryrank);

  return res.status(200).json({
    interview: latestInterview,
    ranks: { cityrank, countryrank },
  });
});

router.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

module.exports = router;
