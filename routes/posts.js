const router = require("express").Router();
let Post = require("../models/posts.model");

router.route("/").get((req, res) => {
    Post.find()
            .then(post => res.json(post))
            .catch(err => res.status(400).json("Error:" + err));
});

router.route("/add").post((req, res) => {
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const description = req.body.description;
    const footer = req.body.footer;

    const post = new Post( {title, subtitle, description, footer} );

    post.save()
                .then(() => res.json("New Post Created"))
                .catch(err => res.status(400).json("Error:" + err));
});

router.route("/:id").get((req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            post.title = req.body.title;
            post.subtitle = req.body.subtitle;
            post.description = req.body.description;
            post.footer = req.body.footer;

            Post.save()
                .then(() => res.json("Post updated"))
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(post => res.json("Post deleted: " + post))
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;