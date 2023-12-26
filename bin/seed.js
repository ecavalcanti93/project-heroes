const mongoose = require('mongoose');
const Hero = require('../models/Hero.model');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project-heroes"

const heroes = [
    {
    name: "Catwoman",
    gender: "Female",
    specie: "Human",
    origin: "Gothan City",
    affiliation: "Justice League",
    abilities: "Expert burglar; Master martial artist and hand-to-hand combatant; Skilled gymnast and acrobat"
    },
    {
    name: "Nightcrawler",
    gender: "Male",
    specie: "Human Mutant",
    origin: "Witzeldorf",
    affiliation: "X-Men",
    abilities: "Teleportation; Prehensile tail; Camouflage; Night vision; Fencer and hand-to-hand combatant"
    },
    {
    name: "Spider-Man",
    gender: "Male",
    specie: "Human Mutant",
    origin: "Queens",
    affiliation: "Avengers",
    abilities: "Superhuman strength; Agility; Reflexes; Master martial artist and hand-to-hand combatant"
    }
];

mongoose
  .connect(MONGO_URI)

  .then(x => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
  }).then( () => {
    return Hero.deleteMany();
  }).then( () => {
    // Create new documents in the books collection
    return Hero.create(heroes);
  })
  .then(heroFromDB => {
    console.log(`Created ${heroFromDB.length}`);

    // Once the documents are created, close the DB connection
    return mongoose.connection.close();
  })
  .then(() => {
    // Once the DB connection is closed, print a message
    console.log('DB connection closed!');
  })
  .catch(err => {
    console.log(`An error occurred while creating books from the DB: ${err}`);
  });