// Importações necessárias
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");  // Para persistência de sessões no MongoDB
// Se você quiser usar Redis, descomente a linha abaixo:
// const RedisStore = require("connect-redis").default; 
// const redisClient = require("./redis");  // Configuração do cliente Redis

// Configurações do banco de dados MongoDB
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project-heroes";

// Configuração do Redis (se você optar por usar Redis, veja a linha comentada acima)
// const redisClient = require("./redis"); // Certifique-se de que redis.js contém sua configuração do cliente Redis

// Middleware de configuração
module.exports = (app) => {
  // Logger para exibir as requisições no console (Útil para desenvolvimento)
  app.use(logger("dev"));

  // Middleware para processar dados em JSON e dados de formulários
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Middleware para lidar com cookies
  app.use(cookieParser());

  // Configuração de caminho para a pasta de views
  app.set("views", path.join(__dirname, "..", "views"));

  // Definição do mecanismo de templates (Handlebars)
  app.set("view engine", "hbs");

  // Permitir o acesso à pasta pública (imagens, arquivos CSS, JS, etc.)
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Configuração do favicon (ícone da aba do navegador)
  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));

  // Middleware de sessão
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super hyper secret key", // Chave secreta para criptografar as sessões
      resave: false, // Não re-salvar a sessão se nada foi alterado
      saveUninitialized: false, // Não salvar sessões não inicializadas
      store: MongoStore.create({
        mongoUrl: MONGO_URI,  // Configuração do armazenamento da sessão no MongoDB
        ttl: 14 * 24 * 60 * 60, // Tempo de expiração das sessões em segundos (14 dias por padrão)
      }),

      // Se estiver utilizando Redis:
      // store: new RedisStore({ client: redisClient }),

      cookie: {
        secure: process.env.NODE_ENV === "production", // Garantir segurança em ambiente de produção
        httpOnly: true, // Previne o acesso ao cookie via JavaScript
        maxAge: 1000 * 60 * 60 * 24, // 1 dia
      },
    })
  );
  
  // Middleware adicional conforme necessidade
  // Exemplo: Autenticação de rotas privadas
  // app.use((req, res, next) => {
  //   if (req.session && req.session.user) {
  //     return next();
  //   }
  //   res.redirect("/auth/login");
  // });
};

