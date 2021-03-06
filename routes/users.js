var express = require('express');
var router = express.Router();
var models = require('../server/models/index');

//gets all the users from Users table in our db using the models.findAll method which acts like a
//SELECT, we pass it an empty object as an argument so it acts like a SELECT * FROM Users.
//it then passes users to the res.render method method which renders users/index.ejs with the params 
//title and users. models.User.findAll returns an array which will come in handy when we render
router.get('/', function(req, res, next) {
  models.User.findAll({}).then((users) => {
    res.render('users/index', {
      title: 'fazbook with users loaded',
      users: users
    });
  });
});

//this is the route that we go to when the create new user is clicked, it renders the users/new.ejs file
router.get('/new', function(req, res, next) {
  res.render("users/new", {title: 'new users'});
});

//this is the route that we go to when the new user form is submitted, it handles the post method
//by using the create method of the model object and passing it the values we get 
//from the body of the request object which is what's posted by the new user form
router.post('/', function(req, res, next) {
  models.User.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob
  }).then(function(users) {
    res.redirect('/users');
  });
});

//this is the route of the post/delete form action it uses the destroy method to remove a record
//from the users table. it takes the id from the url which was created by the delete button and accesses it 
//with req.params.id. then redirects us to the users route.
router.delete('/:id', function(req,res,next){
  models.User.destroy({
    where: {id: req.params.id}
  }).then(function(user) {
    res.redirect('/users');
  });
});

//creates a route for get user/id which renders the new user show page
router.get('/:id', function(req, res, next) {
  models.User.findById(req.params.id).then(function(user) {
    res.render('users/show', { user: user });
  });
});

//creates a route for user/id/edit and renders the user edit page
router.get('/:id/edit', function(req, res, next) {
  models.User.findById(req.params.id).then(function(user) {
    res.render('users/edit', { user: user });
  });
});

//ostensibly creates a route for a put req to user/id but it's sending my browser into forever wait.
//I googled it and it seems like i'm trying to post an empty object but my form looks correct so i really don't know.
router.put('/:id', function(req, res, next) {
  models.User.update({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob
  }, { where: { id: req.params.id } }).then(function() {
    res.redirect('/users/' + req.params.id);
  });
});

module.exports = router;