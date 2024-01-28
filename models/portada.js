const mongoose = require("mongoose");

const portadaSchema = new mongoose.Schema({
  urlPortada: {
    type: String,
    required: true,
  },
});

const Portada = mongoose.model("Portada", portadaSchema);

module.exports = Portada;
