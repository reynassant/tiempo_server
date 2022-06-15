const path = require('path');
const express = require('express');
const fs = require("fs")
const Mustache = require('mustache');
const mustacheExpress = require("mustache-express")
const app = express();
const PORT = process.env.PORT;
const STATIC_PATH = path.join(__dirname, '..', 'tiempo_cliente');
const VIEWS_PATH = path.join(__dirname, 'views');

// To set functioning of mustachejs view engine

app.use(express.urlencoded({
    extended: true
}));




// Setting mustachejs as view engine
// app.set('views',path.join(__dirname,'views'));
// app.set('view engine','html');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.engine('mst', mustacheExpress(VIEWS_PATH, '.mst'));










//rendering example for response


app.get('/nuevoindex', (req, res) => {
    console.log("aquiiiii")




    /// const pre = Mustache.render(path.join(__dirname,'views','pre.mst'))


    var head = ""
    try {
        const data = fs.readFileSync(path.join(__dirname, 'views', 'head.mst'), "utf8");
        head = data;
    } catch (err) {
        console.error(err);
    }

    console.log(head)

    res.render('index.mst', {
        head: head,
    });
});

app.post('/login_action', (req, res) => {
    const { name, pass } = req.body;


    console.log(`Aqui esta el user ${name} con el pass ${pass}`);

    console.log("LOGIN TODO");
    res.send("LOGIN");
})

app.post('/registro_action', (req, res) => {


    console.log("registro_user TODO");
    res.send("registro_user");
})

app.use('/', express.static(STATIC_PATH));

app.listen(PORT, function () {
    console.log(`Servidor web escuchando en el puerto ${PORT}, sirviendo el contenido de ${STATIC_PATH}`);
});