const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const defaultImageURL = '/images/default.png';

const heroSchema = new Schema(
  {
    name: { 
      type: String,
      required: true,
      unique: true 
      },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Undefined'],
      },
    specie: {
      type: String,
      required: true,
      },
    origin: {
      type: String,
      required: true,
      },
    affiliation: {
      type: String,
      required: true,
      },
    abilities: {
      type: String,
      max: 200,
    },
    image:{
      type: String,
      default: defaultImageURL
    },
  },
    {timestamps: true}
  );

heroSchema.pre('findOneAndUpdate', function(next) {

  this.model.findOne(this.getQuery())
    .then( modelData => {
      if (modelData.imageUrl === null) {
        modelData.imageUrl = defaultImageURL;
      }
      modelData.save();
    })
  next();
});

module.exports = model('Hero', heroSchema);
