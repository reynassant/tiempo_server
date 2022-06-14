var path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const STATIC_FOLDER = path.join(__dirname, '..', 'tiempo_cliente');

app.use(express.urlencoded({
    extended: true
}));

app.post('/login_action', (req, res)=>{ 

    const {name, pass} = req.body;

    console.log(`Aqui esta el user ${name} con el pass ${pass}`);

    console.log("LOGIN TODO");
    res.send("LOGIN");
})
app.post('/registro_action', (req, res)=>{ 
        
    console.log("registro_user TODO");
    res.send("registro_user");
})
app.use('/yoqueseu', (req, res)=>{ 
    console.log("yoqueseu TODO");
    res.send("yoqueseu");
})


app.use('/', express.static(STATIC_FOLDER));


app.listen(PORT, function(){
    console.log(`Servidor web escuchando en el puerto ${PORT}, sirviendo el contenido de ${STATIC_FOLDER}`);
});

