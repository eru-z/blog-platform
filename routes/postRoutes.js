// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// In-memory storage for demo purposes
let posts = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- ROUTES ---

// Homepage - list posts
router.get('/', (req, res) => {
    res.render('index', { posts, user: req.session.user });
});

// Create post page
router.get('/create', (req, res) => {
    res.render('create', { posts, user: req.session.user });
});

// Handle create post form submission
router.post('/create', upload.single('image'), (req, res) => {
    const { title, category, excerpt, body, action, meta_description, keywords } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = {
        id: posts.length + 1,
        title,
        category,
        excerpt,
        body,
        image,
        meta_description,
        keywords,
        date: new Date(),
        author: req.session.user ? req.session.user.username : 'Guest',
        status: action === 'publish' ? 'Published' : 'Draft'
    };

    posts.push(newPost);

    if (action === 'publish') {
        res.redirect('/posts');
    } else {
        res.redirect('/create');
    }
});

// List all posts
router.get('/posts', (req, res) => {
    res.render('posts', { posts, user: req.session.user });
});

// --- EDIT POST ---
router.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.render('edit', { post, user: req.session.user });
});

router.post('/edit/:id', upload.single('image'), (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (!post) return res.status(404).send('Post not found');

    const { title, category, excerpt, body, action, meta_description, keywords } = req.body;
    if (req.file) post.image = `/uploads/${req.file.filename}`;

    post.title = title;
    post.category = category;
    post.excerpt = excerpt;
    post.body = body;
    post.meta_description = meta_description;
    post.keywords = keywords;
    post.status = action === 'publish' ? 'Published' : 'Draft';

    res.redirect('/posts');
});

// --- DELETE POST ---
router.get('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect('/posts');
});

// Export router at the end
module.exports = router;
