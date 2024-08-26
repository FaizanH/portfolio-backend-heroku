const router = require("express").Router();
let Blogpost = require("../models/blogpost.model");
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const slug = require('slug')

// Paginate

function paginatedResults(model) {
  return async (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let isPrivate = req.query.private;
    // {"isPrivate": { "$eq": false }}
    const totalResults = await model.countDocuments().exec();

    if (!page)
      page = 1;
    if (!limit)
      limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    try {
      if (isPrivate)
        results.results = await model.find({ isPrivate: isPrivate }).sort({ "_id": -1 }).limit(limit).skip(startIndex).exec();
      else
        results.results = await model.find().sort({ "_id": -1 }).limit(limit).skip(startIndex).exec();
      results.total = Math.ceil(totalResults / limit);
      if (endIndex < totalResults) {
        results.next = {
          page: page + 1
        }
      }

      if (startIndex > 0) {
        results.prev = {
          page: page - 1
        }
      }
      results.current = {
        page: page
      }
      results.totalResults = totalResults;
      res.paginatedResults = results;

      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

// List pages
// const getAllBlogs = asyncHandler(paginatedResults(Blogpost), async (req, res) => {
//   res.json(res.paginatedResults);
// })

// router.route("/").get(paginatedResults(Blogpost), (req, res) => {
//     res.json(res.paginatedResults);
// });

const getBlog = asyncHandler(async (req, res) => {
  // Get id from params
  const { id } = req.params.id
  // Confirm data 
  if (!id) {
    return res.status(400).json({ message: 'Blog Id was not provided' })
  }

  Blogpost.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json("Error: " + err));
})

// router.route("/:id").get((req, res) => {
//     Blogpost.findById(req.params.id)
//         .then(post => res.json(post))
//         .catch(err => res.status(400).json("Error: " + err));
// });

const createNewBlog = asyncHandler(async (req, res) => {
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
  const post = new Blogpost({ title, subtitle, description, author, date, tags, footer, images, isPrivate });

  post.save()
    .then(() => res.json("New Blogpost Created"))
    .catch(err => res.status(400).json("Error:" + err));
})

// router.route("/add").post((req, res) => {
//     const title = req.body.title;
//     const subtitle = req.body.subtitle;
//     const description = req.body.description;
//     const author = req.body.author;
//     const date = req.body.date;
//     const tags = req.body.tags;
//     const footer = req.body.footer;
//     const images = {
//         "main": req.body.images.main
//     }
//     const isPrivate = req.body.isPrivate;
//     const post = new Blogpost({ title, subtitle, description, author, date, tags, footer, images, isPrivate });

//     post.save()
//         .then(() => res.json("New Blogpost Created"))
//         .catch(err => res.status(400).json("Error:" + err));
// });

const updateBlog = asyncHandler(async (req, res) => {
  Blogpost.findById(req.params.id)
    .then(post => {
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
})

// router.route("/update/:id").post((req, res) => {
//     Blogpost.findById(req.params.id)
//         .then(post => {
//             post.title = req.body.title
//             post.subtitle = req.body.subtitle
//             post.description = req.body.description
//             post.author = req.body.author
//             post.date = req.body.date
//             post.tags = req.body.tags
//             post.footer = req.body.footer
//             post.images = {
//                 "main": req.body.images.main
//             }
//             post.isPrivate = req.body.isPrivate

//             post.save()
//                 .then(() => res.json("Post updated"))
//                 .catch(err => res.status(400).json("Error: " + err));
//         })
//         .catch(err => res.status(400).json("Error: " + err));
// });

const deleteBlog = asyncHandler(async (req, res) => {
  Blogpost.findByIdAndDelete(req.params.id)
    .then(post => res.json("Post deleted: " + post))
    .catch(err => res.status(400).json("Error: " + err));
})

router.route("/:id").delete((req, res) => {
  Blogpost.findByIdAndDelete(req.params.id)
    .then(post => res.json("Post deleted: " + post))
    .catch(err => res.status(400).json("Error: " + err));
});

// Mongo Section Update Promise - Fix for the fucked amount of concatenation in the next method
async function SectionUpdatePromise(payload, res) {
  return Promise.all(

  )
}

module.exports = {
  paginatedResults,
  getBlog,
  createNewBlog,
  updateBlog,
  deleteBlog
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
