const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");  // Para persistência de sessões no MongoDB
const mongoose = require("mongoose"); // Adicionado para a conexão com o MongoDB

// Configurações do banco de dados MongoDB
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project-heroes";

// Conectar ao MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Encerra o processo se a conexão falhar
  });

// Middleware de configuração
module.exports = (app) => {
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super hyper secret key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: MONGO_URI,
        ttl: 14 * 24 * 60 * 60, // 14 dias
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 dia
      },
    })
  );
};

  
  // Middleware adicional conforme necessidade
  // Exemplo: Autenticação de rotas privadas
  // app.use((req, res, next) => {
  //   if (req.session && req.session.user) {
  //     return next();
  //   }
  //   res.redirect("/auth/login");
  // });


