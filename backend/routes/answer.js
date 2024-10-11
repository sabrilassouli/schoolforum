const express = require("express");
const router = express.Router();
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

const {
  checkComment,
  checkQuestionId,
  checkCreatorId,
  checkUpvotes,
} = require("../helpers/answerEndpointHelpers");

router.get("/", async (req, res) => {
  try {
    const answers = await db("answers")
      .select("*")
      .orderByRaw("upvotes::integer DESC");
    res.json(answers);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch answers",
    });
  }
});

router.get("/question/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    const answers = await db("answers")
      .join("users", "answers.creator_id", "users.id")
      .where("answers.question_id", questionId)
      .select("answers.*", "users.name as creator_name");
    res.json(answers);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch answers",
    });
  }
});

router.post("/", async (req, res) => {
  const { creator_id, question_id, comment, upvotes = 0 } = req.body;

  if (!checkCreatorId(creator_id)) {
    return res.status(400).json({
      error: "Invalid creator_id",
    });
  }
  if (!checkQuestionId(question_id)) {
    return res.status(400).json({
      error: "Invalid question_id",
    });
  }
  if (!checkComment(comment)) {
    return res.status(400).json({
      error: "Invalid comment",
    });
  }
  if (!checkUpvotes(upvotes)) {
    return res.status(400).json({
      error: "Invalid upvotes",
    });
  }

  try {
    const [id] = await db("answers")
      .insert({
        creator_id,
        question_id,
        comment,
        upvotes,
      })
      .returning("id");
    res.status(201).json({
      id,
    });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({
      error: "Failed to create answer",
    });
  }
});

//upvote comment
router.put("/:id/upvote", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the answer exists
    const answer = await db("answers")
      .where({
        id,
      })
      .first();
    if (!answer) {
      console.log("error is here");
      return res.status(404).json({
        error: "answer not found",
      });
    }

    // Increment the upvotes count
    await db("answers")
      .where({
        id,
      })
      .increment("upvotes", 1);

    // Fetch the updated comment
    const updatedAnswer = await db("answers")
      .where({
        id,
      })
      .first();

    res.json(updatedAnswer);
  } catch (err) {
    res.status(500).json({
      error: "Failed to upvote comment",
    });
  }
});

//downvote comment
router.put("/:id/downvote", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the answer exists
    const answer = await db("answers")
      .where({
        id,
      })
      .first();
    if (!answer) {
      console.log("error is here");
      return res.status(404).json({
        error: "answer not found",
      });
    }

    // decrement the upvotes count
    await db("answers")
      .where({
        id,
      })
      .decrement("upvotes", 1);

    // Fetch the updated comment
    const updatedAnswer = await db("answers")
      .where({
        id,
      })
      .first();

    res.json(updatedAnswer);
  } catch (err) {
    res.status(500).json({
      error: "Failed to downvote comment",
    });
  }
});

module.exports = router;
