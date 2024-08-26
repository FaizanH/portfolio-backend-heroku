const router = require("express").Router();
let Blogpost = require("../models/blogpost.model");
const { paginatedResults, getBlog, createNewBlog, updateBlog, deleteBlog } = require('../controllers/blogsController')
const slug = require('slug')
const { logEvents } = require('./../middleware/logger.js')
const fs = require('node:fs')

// List pages
router.route("/").get(paginatedResults(Blogpost), (req, res) => {
  res.json(res.paginatedResults);
});

router.route("/export").post(paginatedResults(Blogpost), (req, res) => {
  // Save all blogs to md files on github
  // Get all blogs from database
  const posts = res.paginatedResults.results
  // Grab json content and dump to files
  // Loop over posts
  for (let i = 0; i < posts.length; i++) {
    // Save each to /data/backup/blogs folder
    console.log(`./data/json/post-${(posts[i].slug == '') ? ('unnamed-post' + i) : posts[i].slug}.json`)
    fs.writeFileSync(`./data/json/post-${(posts[i].slug == '') ? ('unnamed-post' + i) : posts[i].slug}.json`, JSON.stringify(posts[i]), (err) => {
      if (err)
        logevents('error', `error writing to filesystem: ${err}`, 'events.log')
    })
  }
  res.send("Successfully exported all blogs")
})

router.route("/add").post((req, res) => {
  const s = slug(req.body.title);
  const title = req.body.title;
  const subtitle = req.body.subtitle;
  const description = req.body.description;
  const author = req.body.author;
  const date = req.body.date;
  const tags = req.body.tags;
  const footer = req.body.footer;
  const images = {
    "main": req.body.images.main
  }
  const isPrivate = req.body.isPrivate;
  const post = new Blogpost({ slug: s, title, subtitle, description, author, date, tags, footer, images, isPrivate });

  post.save()
    .then(() => res.json("New Blogpost Created"))
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/:slug").get((req, res) => {
  Blogpost.findOne({ 'slug': req.params.slug })
    .then(post => res.json(post))
    .catch(err => res.status(400).json("Error: " + err));
});

// router.route("/public/:id").get((req, res) => {
//     Blogpost.findById(req.params.id, {isPrivate:false})
//         .then(post => res.json(post))
//         .catch(err => res.status(400).json("Error: " + err));
// });

router.route("/update/:slug").post((req, res) => {
  Blogpost.findOne({ 'slug': req.params.slug })
    .then(post => {
      post.slug = req.body.slug
      post.title = req.body.title
      post.subtitle = req.body.subtitle
      post.description = req.body.description
      post.author = req.body.author
      post.date = req.body.date
      post.tags = req.body.tags
      post.footer = req.body.footer
      post.images = {
        "main": req.body.images.main
      }
      post.isPrivate = req.body.isPrivate

      post.save()
        .then(() => res.json("Post updated"))
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:slug").delete((req, res) => {
  Blogpost.findOneAndDelete({ 'slug': req.params.slug })
    .then(post => res.json("Post deleted: " + post))
    .catch(err => res.status(400).json("Error: " + err));
});

// Mongo Section Update Promise - Fix for the fucked amount of concatenation in the next method
async function SectionUpdatePromise(payload, res) {
  return Promise.all(

  )
}

// Update page section
// router.route("/section/update").post((req, res) => {
//     const header = req.body.header;
//     const body = req.body.body;
//     const footer = req.body.footer;
//     const images = req.body.images;

//     const page_id = req.body.page_id;
//     const section_id = req.body.section_id;

//     Page.findOne({ "_id": page_id })
//         .then(page => {
//             // Update page section body
//             if (body != null) {
//                 Page.updateOne(
//                     { "sections._id": section_id },
//                     { "$set": { "sections.$.body": body } }
//                 )

//                 page.save()
//                     .then((post) => {
//                         res.json("Page section body updated");
//                     })
//                     .catch(err => res.status(400).json("Error: " + err));
//             }
//             // Update page section footer
//             if (footer != null) {
//                 Page.updateOne(
//                     { "sections._id": section_id },
//                     { "$set": { "sections.$.footer": footer } }
//                 )

//                 page.save()
//                     .then((post) => {
//                         res.json("Page section footer updated");
//                     })
//                     .catch(err => res.status(400).json("Error: " + err));
//             }
//             // Update page section header
//             if (header != null) {
//                 Page.updateOne(
//                     { "sections._id": section_id },
//                     { "$set": { "sections.$.header": header } }
//                 )

//                 page.save()
//                     .then((post) => {
//                         res.json("Page section header updated");
//                     })
//                     .catch(err => res.status(400).json("Error: " + err));
//             }
//             if (images != null) {
//                 Page.updateOne(
//                     { "sections._id": section_id },
//                     { "$set": { "sections.$.images": images } }
//                 )

//                 page.save()
//                     .then((post) => {
//                         res.json("Page section images updated");
//                     })
//                     .catch(err => res.status(400).json("Error: " + err));
//             }
//         })
//         .catch(err => res.status(400).json("Error: " + err));
// });


// router.route("/prices/:id").delete((req, res) => {
//     Price.findByIdAndDelete(req.params.id)
//         .then(price => res.json("Price deleted: " + price))
//         .catch(err => res.status(400).json("Error: " + err));
// })


// View blog by id


// Add page
// router.route("/add").post((req, res) => {
//     const title = req.body.title;
//     const sections = req.body.sections;
//     Page.findOne({"title": title}, function(err, page) {
//         if (err) {
//             throw err;
//         } else if (page) {
//             // Duplicate
//             res.json({"Message": "Duplicate Found, skipping"});
//         } else {
//             let newPage = new Page({ title, sections });
//             newPage.save()
//                 .catch(err => res.status(400).json("Error:" + err));
//         }
//     });
//     res.json("New Section Created")
// });

// Add section
// router.route("/section/add").post((req, res) => {
//     const title = req.body.title;
//     const section = req.body.data;


//     Page.updateOne(
//         {"title": title},
//         {"$push": {"sections": section}}
//     )
//     .then(section => res.json("Section added: " + section))
//     .catch(err => res.status(400).json("Error: " + err));
// });

// Update page title
// router.route("/update").post((req, res) => {
//     const title = req.body.title;
//     const _id = req.body._id;

//     Blogpost.findOne({ "_id": _id })
//         .then(page => {
//             page.title = title;

//             page.save()
//                 .then((post) => {
//                     res.json("Blogpost title updated");
//                 })
//                 .catch(err => res.status(400).json("Error: " + err));
//         })
//         .catch(err => res.status(400).json("Error: " + err));
// });

module.exports = router;
