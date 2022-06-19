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


//rendering example for response

let getTemplate = (template) => {
  var content = "";
  try {
    content = fs.readFileSync(path.join(__dirname, "views", template), "utf8");
  } catch (err) {
    console.error(err);
  }

  return content;
};

app.get('/nuevoindex', (req, res) => {
    /// const pre = Mustache.render(path.join(__dirname,'views','pre.mst'))
    res.render('index.mst', {
        head: getTemplate("head.mst"),
    });
});
                            //este es el request del navegador
app.post('/login_action', (req, res) => {
    const { name, pass } = req.body;
                            //de aqui cogemos el body del request que hace nuestro navegador



console.log(`Aqui esta el user ${name} con el pass ${pass}`);

console.log("LOGIN TODO");
res.send("LOGIN"); // <-- devuelve lo que pongas aquí, tal vez es un .redirect para reenviar a otra página
                    // en este caso es la cadena de texto LOGIN
})
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

app.post('/registro_action', (req, res) => {
    const { name, pass } = req.body;

})


app.use('/', express.static(STATIC_PATH));


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
    console.log(`Servidor web escuchando en el puerto ${PORT}, sirviendo el contenido de ${STATIC_PATH}`);
});
