const express = require("express");
const Blog = require("../models/Blog");
const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    await Subscriber.create({ email });

    res.json({ msg: "Subscribed successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Already subscribed or error" });
  }
});

router.get("/subscribers", async (req, res) => {
  try {
    const users = await Subscriber.find().sort({ _id: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch subscribers" });
  }
});
router.delete("/subscribers/:id", async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

router.get("/blog", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed" });
  }
});

router.post("/blog", upload.single("image"), async (req, res) => {
  try {
    const { name, rate } = req.body;

    let description = req.body.description;

    if (!Array.isArray(description)) {
      description = [description];
    }

    if (!name || !rate || !description) {
      return res.status(400).json({ msg: "All fields required" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Image required" });
    }

    const image = req.file.path;

    const blog = await Blog.create({
      name,
      image,
      rate,
      description,
    });

    const users = await Subscriber.find();

    if (users.length === 0) {
      return res.json(blog);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const emailPromises = users.map((u) =>
      transporter.sendMail({
        from: process.env.EMAIL,
        to: u.email,
        subject: `New Offer: ${name}`,
        html: `
  <div style="background:#f3f4f6;padding:30px;font-family:Arial,sans-serif">
    
    <div style="max-width:400px;margin:auto;background:#e6f4ea;border-radius:16px;padding:20px;text-align:center;box-shadow:0 4px 10px rgba(0,0,0,0.1)">
      
      <!-- IMAGE -->
      <div style="border:3px solid #16a34a;border-radius:12px;padding:10px;margin-bottom:15px;display:inline-block">
        <img src="${image}" width="120" style="object-fit:contain"/>
      </div>

      <!-- NAME -->
      <h2 style="margin:10px 0;color:#111;font-size:20px">${name}</h2>

      <!-- PRICE -->
      <h1 style="color:#111;font-size:26px;margin:5px 0">₹${rate}</h1>
      <p style="color:#6b7280;font-size:12px;margin-bottom:15px">per campaign</p>

      <!-- BUTTON -->
      <div style="margin-bottom:15px">
        <a href="#" style="background:#16a34a;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;display:inline-block">
          Promote
        </a>
      </div>

      <!-- DESCRIPTION -->
      <ul style="text-align:left;font-size:14px;color:#374151;padding-left:20px">
        ${description.map((p) => `<li style="margin-bottom:6px">✔ ${p}</li>`).join("")}
      </ul>

    </div>

  </div>
`,
      }),
    );

    await Promise.allSettled(emailPromises);

    res.json(blog);
  } catch (err) {
    console.log("BLOG ERROR:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});

module.exports = router;
