const fs = require("fs");
const path = require("path");
const express = require("express");
const mustacheExpress = require("mustache-express");
const ddbb = require("./ddbb");

const app = express();
const PORT = process.env.PORT;
const STATIC_PATH = path.join(__dirname, "..", "tiempo_cliente");
const VIEWS_PATH = path.join(__dirname, "views");

// To set functioning of mustachejs view engine

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Setting mustachejs as view engine
// app.set('views',path.join(__dirname,'views'));
// app.set('view engine','html');

// Register '.mustache' extension with The Mustache Express
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));
app.engine("mst", mustacheExpress(VIEWS_PATH, ".mst"));

let getTemplate = (template) => {
  var content = "";
  try {
    content = fs.readFileSync(path.join(__dirname, "views", template), "utf8");
  } catch (err) {
    console.error(err);
  }

  return content;
};

//rendering example for response

app.get("/ejemplo", (req, res) => {
  res.render("ejemplo.mst", {
    msg: "tu pyagdhgj",
  });
});

app.get("/login", (req, res) => {
  res.render("login.mst", {
    head: "Pagina de Log-in",
  });
});

app.get("/registro", (req, res) => {
  res.render("register.mst", {
    head: "Pagina de Registro",
  });
});

app.get("/addcity", (req, res) => {
  res.render("addcity.mst", {
    head: "Pagina de Anadir Ciudad",
  });
});

//rendering example for response

app.get("/nuevoindex", (req, res) => {
  /// const pre = Mustache.render(path.join(__dirname,'views','pre.mst'))
  res.render("index.mst", {
    head: getTemplate("head.mst"),
  });
});

app.get("/listarciudades", (req, res) => {
  /// const pre = Mustache.render(path.join(__dirname,'views','pre.mst'))
  res.render("listarciudades.mst", {
    head:'Pagina de Anadir Ciudad',
  });
});


app.use("/login_action", (req, res) => {
  const { usuario, pass } = req.body;

  ddbb.loginUsuario(usuario, pass, res);
  // let newUserId = ddbb.registrarUsuario(usuario, pass);
});

app.post("/register_action", (req, res) => {
  const { usuario, pass } = req.body;
  console.log(`Aqui esta el user ${usuario} con el pass ${pass}`);
  ddbb.registrarUsuario(usuario, pass, res);
  // res.send("registro_user");
});

app.post("/addcity_action", (req, res) => {
  const { ciudad, idusuario,lat,lon } = req.body;
  console.log(`Aqui esta el user ${idusuario} con la ciudad ${ciudad}, latidud ${lat}, longitud ${lon}`);
  ddbb.registrarCiudad(idusuario, ciudad, lat, lon, res);
  // res.send("registro_user");
});

app.post("/listarciudades_action", (req, res) => {
  const { idusuario } = req.body;
  console.log(`Aqui esta el user ${idusuario}`);
  ddbb.listarCiudades(idusuario,res);
  // res.send("registro_user");
});


app.use("/", express.static(STATIC_PATH));

app.listen(PORT, function () {
  console.log(
    `Servidor web escuchando en el puerto ${PORT}, sirviendo el contenido de ${STATIC_PATH}`
  );
});
