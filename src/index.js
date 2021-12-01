//CÓDIGO DEL SERVIDOR
const express = require('express');
const engine = require('ejs-mate');
const path = require('path'); //MÓDULO PARA COLOCAR O UNIR DIRECTORIOS
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//INICIALIZACIONES
const app = express();
require('./database');
require('./passport/local-auth');

//CONFIGURACIÓN
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine); //PARA PODER UTILIZAR EL MOTOR DE PLANTILLAS EJS
app.set('view engine', 'ejs'); //ESTABLECER EL MOTOR DE PLANTILLAS
app.set('port', process.env.PORT || 3000); //LE DECIMOS QUE UTILICE EL PUERTO DEL SISTEMA OPERATIVO Y SI NO EXISTE, QUE UTILICE EL PUERTO 3000


//MIDDLEWARES //funciones que se ejcutan antes que se pasen a las rutas
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport. initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    next();
});

//ROUTES
app.use('/', require('./routes/index')); //LE DECIMOS A EXPRESS QUE UTILICE ESTAS RUTAS QUE ESTOY REQUIRIENDO CADA VEZ QUE EL USUARIO INGRESE A LA RUTA PRINCIPAL DE MI APLICACIÓN


//INICIANDO EL SERVIDOR
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});

//CAPTURAR ARCHIVOS EXTERNOS
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))