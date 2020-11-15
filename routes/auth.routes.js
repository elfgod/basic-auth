const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res) => res.render('auth/signup'));

/*router.post('/signup', (req, res) => {
  this code will check the info posted by the user in the terminal
  console.log('The form data: ', req.body);
});*/

router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body; 

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
    })
    .catch(error => next(error));
});

module.exports = router;