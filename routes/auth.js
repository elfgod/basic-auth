const { genSaltSync } = require("bcrypt")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")

router.get('/signup', (req, res) => res.render('auth/signup'));

/* this code will check the info posted by the user in the terminal
router.post('/signup', (req, res) => {  
  console.log('The form data: ', req.body);
});*/

/* this code will show the hashed password in the terminal 
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body; 

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
    })
    .catch(error => next(error));
});*/

router.post('/signup', async (req, res) => {
  // 1. Take the info from the form
  const { username, email, password } = req.body
  // 2. Evaluate if the fields are empty
  if (username === "" || email === "" || password === "") {
    // 2.1 if they are empty send error
    return res.render("auth/signup", { error: "Missing fields" })
  } else {
    // Search users if there is already that email
    const user = await User.findOne({ email })
    // if there is already that email user send error
    if (user) {
      return res.render("auth/signup", { error: "something went wrong" })
    }

    // 3. Hash the password
    const salt = bcrypt.genSaltSync(12)
    const hashpwd = bcrypt.hashSync(password, salt)
    // 3.1 If information is correct we save the user in the DB
    await User.create({
      username,
      email,
      password: hashpwd
    })
    // 5. Answer the user with a new view(redirect('/profile'))
    res.redirect("/profile")
  }
})

router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", async (req, res) => {
  // res.send(req.body)
  // 1. tomamos la informacion del formulario
  const { email, password } = req.body
  // 2. evaluar si la informacion esta completa
  if (email === "" || password === "") {
    res.render("auth/login", { error: "Missing fields" })
  }
  // 3. buscamos si hay un usuario con el correo que nos enviaron
  const user = await User.findOne({ email })
  // 3.1 si no hay usuario notificar el error
  if (!user) {
    res.render("auth/login", { error: "something went wrong" })
  }

  // 4. si existe el usuario en la base de datos, comparamos la contrase~a de ese usuario, con la que llego del form
  if (bcrypt.compareSync(password, user.password)) {
    // 4.1 si coinciden renderizamos profile con el usuario
    // res.render("auth/profile", user)
    delete user.password
    req.session.currentUser = user
    res.redirect("/profile")
  } else {
    // 4.2 si no coinciden, hacemos render del form con el error
    res.render("auth/login", { error: "something went wrong" })
  }
})

router.get("/profile", (req, res) => {
  res.render("auth/profile", { user: req.session.currentUser })
})

router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

module.exports = router