const express = require('express');
const router = express.Router();
const Hero = require("../models/Hero.model");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const fileUploader = require('../config/cloudinary.config');

router.get('/', (req,res) => {
  Hero.find()
    .then( heroFromDB => {
      res.render('hero-views/hero-archive', { heroes: heroFromDB });
    });
});

router.get('/create', isLoggedIn, (req, res) => {
    res.render('hero-views/hero-create');
});

router.post('/create', fileUploader.single('hero-cover-image'), (req, res) => {
  
  const {name, gender, specie, origin, affiliation, abilities} = req.body;
  
  const newHero = {
    name: name,
    gender: gender,
    specie: specie,
    origin: origin,
    affiliation: affiliation,
    abilities: abilities,
  }

  if (req.file) {
    newHero.image = req.file.path;
  }

  Hero.create(newHero)
    .then(newlyCreatedHeroFromDB => {
      res.redirect(`/heroes/${newlyCreatedHeroFromDB._id}`)
    })
    .catch(error => console.log(`Error while creating a new hero: ${error}`));


});

router.get('/:id', (req, res) => {

  const { id } = req.params;

  Hero.findById(id)
    .then( heroFromDB => {
      res.render('hero-views/hero-single', heroFromDB );
    });

});

router.get('/:id/delete', isLoggedIn, (req, res) => {

  const { id } = req.params;

  Hero.findByIdAndDelete(id)
    .then( () => {
      res.redirect('/heroes')
    });

});

router.get('/:id/edit', isLoggedIn, (req, res) => {

  const { id } = req.params;

  Hero.findById(id)
    .then( heroFromDB => {
      res.render('hero-views/hero-edit', heroFromDB );
    });

});

router.post('/:id/edit', fileUploader.single('hero-cover-image'), (req, res) => {

  const { id } = req.params;
  const { name, gender, specie, origin, affiliation, abilities } = req.body;
  
  const updatedHero = {
    name: name,
    gender: gender,
    specie: specie,
    origin: origin,
    affiliation: affiliation,
    abilities: abilities
  }

  if (req.file) {
    updatedHero.image = req.file.path;
    console.log(`/heroes/${id}`);
  }

  Hero.findByIdAndUpdate(id, updatedHero, { new: true })
    .then( heroFromDB => {
      res.redirect(`/heroes/${id}`);
    });

});

router.get('/:id/delete-image', isLoggedIn, (req, res) => {
  
  const { id } = req.params;

  Hero.findOneAndUpdate(id, { image: null }, { new: true } )
    .then( () => {
      res.redirect(`/heroes/${id}/edit`);
    });

});


module.exports = router;