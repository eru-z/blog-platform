const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // <-- add this

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Example posts (can be removed if using postRoutes)
const posts = [
  { title: "First Post", excerpt: "This is the first post.", author: "Admin", date: new Date(), image: "https://picsum.photos/400/250?random=10" },
  { title: "Second Post", excerpt: "This is the second post.", author: "Admin", date: new Date(), image: "https://picsum.photos/400/250?random=11" }
];

// Home page
app.get('/', (req, res) => {
    res.render('index', { posts, user: req.session.user });
});

// Use routes
app.use('/', authRoutes);
app.use('/', postRoutes); // <-- add this

// 404 page
app.use((req, res) => {
    res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
