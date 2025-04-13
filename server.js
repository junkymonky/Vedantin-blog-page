console.log("Script.js is loaded correctly!");

const express = require("express");
const pool = require("./db");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the views folder for EJS templates
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public")); // Move this after app initialization
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// Route to insert admin user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [username, hashedPassword]);

    res.json({ message: "Admin added successfully!", user: result.rows[0] });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("🔹 Received login attempt for:", username);

  try {
    const query = "SELECT * FROM admins WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      console.log("❌ User not found:", username);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const admin = result.rows[0];
    console.log("✅ User found in database:", admin.username);
    console.log("🔹 Stored Hash:", admin.password);
    console.log("🔹 Entered Password:", password);

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔹 Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match for:", username);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log("🎉 Login successful for:", username);
    res.json({ message: "Login successful!" });

  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb("Error: Images only!");
  }
});

app.post("/upload", upload.single("featuredImage"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.post("/articles", upload.single("featuredImage"), async (req, res) => {
  const { title, category, excerpt, content, tags } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  console.log("📥 Received Article Submission:");
  console.log("➡️ Title:", title);
  console.log("➡️ Category:", category);
  console.log("➡️ Content:", content);
  console.log("➡️ Tags:", tags);
  console.log("🖼️ Image File:", req.file);

  if (!title || !category || !content) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ error: "Title, category, and content are required" });
  }

  try {
    const query = `
      INSERT INTO articles (title, category, excerpt, content, tags, image_url)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [title, category, excerpt, content, tags, imageUrl];
    const result = await pool.query(query, values);

    console.log("✅ Article saved:", result.rows[0]);
    res.json({ message: "Article saved successfully!", article: result.rows[0] });
  } catch (err) {
    console.error("❌ Error saving article:", err);
    res.status(500).json({ error: "Server error while saving article." });
  }
});

// Fetch all articles
app.get("/articles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM articles ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching articles:", err);
    res.status(500).json({ error: "Server error while fetching articles." });
  }
});

app.get('/articles', async (req, res) => {
    const result = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.render('articles', { articles: result.rows });
  });
  
  // Fetch article by ID
// Route to handle article details
app.get('/api/article/:id', async (req, res) => {
    const articleId = req.params.id;
    try {
      const result = await pool.query('SELECT * FROM articles WHERE id = $1', [articleId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('❌ Error fetching article:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  

  

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
