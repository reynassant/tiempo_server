const path = require('path');
const express = require('express');
const fs = require("fs");
const Mustache = require('mustache');
const mustacheExpress = require("mustache-express")
const ddbb = require("./ddbb");

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
app.set('views', path.join(__dirname,'views'));
app.engine('mst', mustacheExpress(VIEWS_PATH, '.mst'));










//rendering example for response


app.get('/ejemplo',(req,res)=>{
    res.render('ejemplo.mst',{msg:'tu pyagdhgj'});
});

app.get('/login',(req,res) =>{
    res.render('index.mst',{
        head: 'Pagina de Log-in',         
    });    
});

app.get('/registro',(req,res) =>{
    res.render('register.mst',{
        head: 'Pagina de Registro',         
    });    
});


app.get('/nuevoindex',(req,res)=>{
    console.log("aquiiiii")

    /// const pre = Mustache.render(path.join(__dirname,'views','pre.mst'))

    var head = ""
    try 
    {
        const data = fs.readFileSync(path.join(__dirname,'views','head.mst'));
        head = data
    } catch (err) {
        console.error(err);
    }

    console.log(head)

    res.render('index.mst',{
        head: head, 
        ubicaciones: "<span>aaaaaa</span>"
    });
});

app.use('/login_action', (req, res) => {
    const {name, pass} = req.body;

    console.log(`Aqui esta el user ${name} con el pass ${pass}`);

   // let newUserId = ddbb.registrarUsuario(name, pass);

    
})

app.post('/register_action', (req, res) => {
    
    const {usuario, pass} = req.body;    
    console.log(`Aqui esta el user ${usuario} con el pass ${pass}`);    
    let newUserId = ddbb.registrarUsuario(usuario, pass);        
    //res.send("registro_user");

})

app.use('/yoqueseu', (req, res) => {
    console.log("yoqueseu TODO");
    res.send("yoqueseu");
})

app.use('/', express.static(STATIC_PATH));

app.listen(PORT, function() {
    console.log(`Servidor web escuchando en el puerto ${PORT}, sirviendo el contenido de ${STATIC_PATH}`);
});
