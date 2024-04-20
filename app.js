import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

const pages = [
  { url: '/', file: 'login.html' },
  { url: '/signup', file: 'signup.html' },
  { url: '/main', file: 'posts.html' },
  { url: '/posts/:postsId', file: 'posts-detail.html' },
  { url: '/posts-make', file: 'posts-make.html' },
  { url: '/posts/:postsId/edit', file: 'posts-edit.html' },
  { url: '/update-profile', file: 'update-profile.html' },
  { url: '/update-password', file: 'update-password.html' },
];

pages.forEach(route => {
  app.get(route.url, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', route.file));
  });
});

app.listen(app.get('port'), () => {
  console.log(`=== Start hong.server on ${app.get('port')} port ===`);
});
