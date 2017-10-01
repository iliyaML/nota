const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// idea index page
router.get('/', (req, res) => {
  Idea.find({})
  .sort({ date: 'desc' })
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  });
});

// add idea form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// edit idea form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
});

// edit form process
router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
    .then(idea => {
      req.flash('successMsg', 'Idea updated');
      res.redirect('');
    });
  });
});

// delete idea process
router.delete('/:id', (req, res) => {
  Idea.remove({ _id: req.params.id })
  .then(() => {
    req.flash('successMsg', 'Idea removed');
    res.redirect('/ideas');
  });
});

// process idea form
router.post('/', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({ text: 'Please add a title' });
  }
  if(!req.body.details){
    errors.push({ text: 'Please add some details' });
  }

  // if there are errors
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    // if no error
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    }

    new Idea(newUser)
    .save()
    .then(idea => {
      req.flash('successMsg', 'Idea added');
      res.redirect('/ideas');
    });
  }
});

module.exports = router;
