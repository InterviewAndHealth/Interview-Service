const joi = require('joi');
// userid, jobdescription, interviewtype, difficulty, jobfield, status
class InterviewSchema {

  interviewSchema = joi.object().keys({
    userid: joi.string().required(),
    jobdescription: joi.string().required(),
    interviewtype: joi.string().required(),
    difficulty: joi.string().required(),
    jobfield: joi.string().required(),
    status: joi.string().required()
  })

}

module.exports = InterviewSchema;