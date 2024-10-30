const express = require("express");
const { Service } = require("../services");
const { BadRequestError } = require("../utils/errors");
const authMiddleware = require('../middlewares/auth');
const { EventService, RPCService } = require("../services/broker");

const { EVENT_TYPES,RPC_TYPES,USERS_RPC } = require("../config");


const router = express.Router();
const service = new Service();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the users API" });
});



router.post("/createinterview",authMiddleware, async (req, res) => {
  const {jobdescription, interviewtype, difficulty, jobfield} = req.body;

  const status="scheduled";
  
  const userid=req.userId;

  const userDetails = await RPCService.request(USERS_RPC, {
        type:RPC_TYPES.GET_USER_DETAILS,
        data:{
          userId:userid
        },
      });

      // console.log(userDetails);
      const city=userDetails.data.city;
      const country=userDetails.data.country;

  const data = await service.createinterview(userid, jobdescription, interviewtype, difficulty, jobfield, status,city,country);
  return res.status(200).json(data);
});


router.get("/getinterview", authMiddleware, async (req, res) => {
  const userid=req.userId;
  const data = await service.getinterview(userid);
  return res.status(200).json(data);
});





router.get("/getallinterviews", authMiddleware, async (req, res) => {
  const userid  = req.userId;

    // console.log(userid);
    // Get all completed interviews for the user
    const interviews = await service.getAllCompletedInterviews(userid);

    // console.log(interviews);

    // If any interview does not have feedback data, add a message for feedback status
    const interviewsWithStatus = interviews.map(interview => {
      if (!interview.feedback || Object.keys(interview.feedback).length === 0) {
        interview.feedbackAvailable=0;
        interview.feedbackStatus = "Feedback yet to be generated";
      }else{
        interview.feedbackAvailable=1;
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
      return res.status(404).json({ error: "Feedback and rank for the latest interview not yet generated" });

    }

    // Get user details from students table using RPC
    const userDetails = await RPCService.request(USERS_RPC, {
      type: RPC_TYPES.GET_USER_DETAILS,
      data: { userId: userid }
    });

    // console.log(userDetails);

    // Calculate ranks based on the final score
    const finalScore = latestInterview.feedback.final_score;
    const { cityrank, countryrank } = await service.calculateRank(userDetails.city, userDetails.country, finalScore);

    // console.log(cityrank);
    // console.log(countryrank);

    return res.status(200).json({ 
      interview: latestInterview, 
      ranks: { cityrank, countryrank } 
    });
  
});









// const { EventService, RPCService } = require("../services/broker");
// router.get("/rpctest",authMiddleware, async (req, res) => {
//   // const {jobdescription, interviewtype, difficulty, jobfield, status } = req.body;

  
//   const userid=req.userId;
//   console.log(userid);
//   const response = await RPCService.request('USERS_RPC', {
//     type: 'GET_USER_DETAILS',
//     data:{
//       userId:userid
//     },
//   });
//   console.log(response);
  
//   return res.json(response);
// });

// router.get("/eventtest",authMiddleware, async (req, res) => {
//   const userid=req.userId;
//   console.log(userid);
//   await EventService.publish('INTERVIEWS_SCHEDULE_SERVICE', {
//     type: 'INTERVIEW_DETAILS',
//     data:{ 
//       interviewId: "tikmh7r04y2e",
//     transcript: [
//       {
//         type: "AI",
//         content: "Welcome to the interview. Let's begin with your introduction.",
//         timestamp: "2024-10-30T10:15:00Z"
//       },
//       {
//         type: "human",
//         content: "Thank you. My name is Alex, and I am a recent graduate in computer science.",
//         timestamp: "2024-10-30T10:15:10Z"
//       },
//       {
//         type: "AI",
//         content: "Can you tell me about a challenging project you've worked on?",
//         timestamp: "2024-10-30T10:16:00Z"
//       },
//       {
//         type: "human",
//         content: "Sure. I recently worked on a machine learning model to classify images.",
//         timestamp: "2024-10-30T10:16:15Z"
//       }
//     ],
//     feedback: {
//       feedbacks: [
//         {
//           question: "Can you introduce yourself?",
//           answer: "My name is Alex, and I am a recent graduate in computer science.",
//           feedback: "Clear and concise introduction.",
//           score: 8
//         },
//         {
//           question: "Describe a challenging project.",
//           answer: "I recently worked on a machine learning model to classify images.",
//           feedback: "Good explanation of the project, but could include more technical details.",
//           score: 7
//         }
//       ],
//       final_feedback: "Overall good performance. Demonstrated understanding and communication skills.",
//       final_score: 7.5
//     }
//   }
//   });

//   return res.json("done");
  
// });



module.exports = router;



