const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//

//@route GET api/posts
//@desc Test route
//@access Public
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //bad req
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id, //from auth
      });

      const post = await newPost.save();
      res.json(post);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route GET api/posts
//@desc get all posts
//@access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //newest first
    res.json(posts);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/posts/:id
//@desc get post by id
//@access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //newest first

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (e) {
    console.error(e.message);

    if (e.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

//@route DELETE api/posts/:id
//@desc delete post by id
//@access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //newest first

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //post.user is an object so make it a string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized post delete" });
    }

    await post.remove();
    res.json({ msg: "Post removed" });

    res.json(post);
  } catch (e) {
    console.error(e.message);

    if (e.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

//@route PUT api/posts/like/:id
//@desc like post
//@access Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if already liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "User Already Liked post" });
    }

    post.likes.unshift({ user: req.user.id }); //unshift adds to the front

    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e.message);

    if (e.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

//@route PUT api/posts/unlike/:id
//@desc unlike post
//@access Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if already liked
    console.log("post");
    console.log(post);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length <= 0
    ) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }

    const removeIndex = post.likes
      .map((like) => like.user.id.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e.message);

    if (e.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

//@route GET api/posts/comment/:id
//@desc add comment
//@access Public
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //bad req
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id, //from auth
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@desc DELETe comment
//@access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() }); //bad req
  // }

  try {
    //   const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    //pull out comment

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).send("Comment not found");
    }
  
    const removeIndex = post.comments
      .map((comment) => comment.user.id.toString())
      .indexOf(req.user.id);

    //user can delete other peoples comments on their posts
    if (post.user.toString() === req.user.id) {
      post.comments.splice(removeIndex, 1);
      await post.save();
      return res.json(post.comments);
    }

    //user can delete their own comments on other peoples posts
    if (req.user.id !== comment.user.toString()) {
      return res.status(401).send("Unauthorized comment delete");
    } else {
      post.comments.splice(removeIndex, 1);
      await post.save();
      res.json(post.comments);
    }

    // const removeIndex = post.comments
    //   .map((comment) => comment.user.id.toString())
    //   .indexOf(req.user.id);

    // post.comments.splice(removeIndex, 1);

    // await post.save();
    // res.json(post.comments);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
