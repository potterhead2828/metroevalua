'use strict';

const Hapi = require('hapi');
const Vision = require('vision')
const Handlebars = require('handlebars')
const Good = require('good')
const Bcrypt=require('bcrypt');
const BasicAuth=require('hapi-auth-basic');





// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: process.env.IP, 
    port: process.env.PORT || 3000 
});

const Sequelize=require('sequelize');
const sequelize = new Sequelize('c9', 'adriana2828', "", {
  host: 'localhost',
  dialect: 'mysql',
});

// Start the server
server.start((err) => {
if (err) {
        throw err;
    }
   console.log('Server running at:', server.info.uri);
});

// register vision to your server instance
server.register(Vision, function (err) {  
  if (err) {
    console.log('Cannot register vision')
  }

  // configure template support   
  
  server.views({
    engines: {
      html:{
            module: require('handlebars'),
            isCached: false, //dev mode only
            compileMode: 'sync' //dev mode only
        }
    },
    relativeTo: __dirname,
    path: __dirname + '/views',
    //layout: true,
    //layout: 'default',
    layoutPath: './views/layout',
    helpersPath: './views/helpers',
    partialsPath: './views/partials'
    
  })
 
})
//_______Enviar un Email____________________
//Para probar esto, hay que hacer npm start, luego ir a la vista /mail, y esperar el email
//Sino llega en recibidos, revisar la carpeta spam.

var SendGrid = require('sendgrid-nodejs').SendGrid;
var sendgrid = new SendGrid('adriana2828', 'Oliver.80');
server.route({
    method:'GET',
    path:'/mail',
    handler:
function(req,res){ 
     sendgrid.send({
  to: 'adriana2828@gmail.com',
  from: 'metroevalua@unimet.edu.ve',
  subject: 'Crea una persona!',
  text: 'Metete en c9, has el npm start, y luego te invito a crear una persona en la tabla de prueba :)'+'https://metroevalua-node6-adriana2828.c9users.io/persona'
},function(err,json){
    if (err){return res.send('Damn it!')}
    res.send('Im a freaking genius!');;
});
}
});
//_______Enviar un Email____________________












//______________________________________________________________________________

//______________________________________________________________________________
//registro del plugin que permite tener las rutas en otro archivo

server.register([
  {
    register: BasicAuth
  },
  {
    register: require('./rutas/routes')
  },
  {
    register: Good,
    options: {
      ops: {
        interval: 10000
      },
      reporters: {
        console: [
          {
            args: [ { log: '*', response: '*', request: '*' } ]
          },
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  }
]);


//RUTAS_________________________________________________________________________

//------Falta el index.js de la carpeta models.
//------Falta la definicion de los controladores.
//------Falta las tablas de la base de datos y sus respectivos modelos.
//______________________________________________________________________________



























//________________------------EJEMPLOS------------______________________________
var Ejemplo=sequelize.import(__dirname + "/models/Ejemplo.js"); 
//______________________________________________________________________________
//EJEMPLO PARA IMPRIMIR UNA TABLA DE LA BASE DE DATOS EN UNA VISTA HTML
/*
server.route({
    method: 'GET',
    path:'/enviar_evaluacion_estudiante', 
    handler:function (request,reply){ 
      
     
      Ejemplo.sequelize.sync();    
      Ejemplo.findAll().then(function(ejemplo) {
      //
      // En este caso ejemplo es un arreglo.
      // objeto1 es un json que tiene un arreglo que se llama personas.
      // a cada elemento i de personas le agregamos un elemento i de ejemplo.
      //  
   var i;   
   var   objeto1={personas:[
                          
                          ]
                };
 
  for(i=1;i<18;i++){  
   objeto1.personas[i]={nombre:ejemplo[i].dataValues.nombre, 
                    cedula:ejemplo[i].dataValues.cedula
                    };
  }

    console.log(ejemplo);
       
  return reply.view('enviar_evaluacion_estudiante',objeto1);
  });
  
    }      
}); */
  /*   
  Ejemplo.findById(1).then(function(ejemplo) {
    
  var objeto1= {personas:[
                          {
                            nombre:ejemplo.dataValues.nombre, 
                            cedula:ejemplo.dataValues.cedula
                            },
                           {nombre:'Iris West',
                            cedula:'V-9854727'}
                          ]
                };*/
  //objeto=objeto1;             
 
  //console.log('nombre es:_'+ejemplo.dataValues.nombre);
 
     
 // siempre es util ver el objeto por consola.
  /*var objeto1={};
  
  objeto1={nombre:'Iris West',
           cedula:'V-19692854'};*/    
 
      


//EJEMPLO PARA IMPRIMIR UNA TABLA DE LA BASE DE DATOS EN UNA VISTA HTML
//______________________________________________________________________________

//______________________________________________________________________________
  
//Si se define una variable fuera del metodo de sequelize para hacer el find, 
//a esa variable no se le puede asignar nada del objeto que el find devuelve.
//por eso, la variable objeto1 debe ser definida dentro del find...
  //var objeto;
 /* 
  Ejemplo.sequelize.sync();    
  Ejemplo.findById(1).then(function(ejemplo) {
    
  var objeto1={nombre:ejemplo.dataValues.nombre, 
               cedula:ejemplo.dataValues.cedula};
  //objeto=objeto1;             
 
  console.log('nombre es:_'+ejemplo.dataValues.nombre);
  console.log(ejemplo);
  })
  */
   //console.log(objeto); esto no funciona si esta fuera del find. devuelve undefined si se pone aqui.
//______________________________________________________________________________

/*
 Ejemplo.sequelize.sync(); 
 Ejemplo.findAll().then(function(ejemplo) {
   var i;   
   var objeto1=[];
   var objeto2={};
for (i = 13; i <18; i++) {
    
     objeto1+=ejemplo[i].dataValues.nombre;
     objeto2+={personas:
                      {nombre:ejemplo[i].dataValues.nombre,
                       cedula:ejemplo[i].dataValues.cedula
     }}
}
 
  })
*/
//______________________________________________________________________________

//EJEMPLO PERSONA_______________________________________________________________
server.route ({
    
    method:'GET',
    path:'/persona',
    handler:{
        
        view:'persona'
        
    }
  
});

server.route({
    method: [ 'POST', 'PUT' ],
    path:'/getP', 
    handler:function (request,reply){ 
     
  console.log(request);// siempre es util ver el objeto por consola.
  Ejemplo.sequelize.sync();// cada vez q se va a modificar la bd primero hay q llamar a sync();    
  Ejemplo.create({
    nombre:request.payload.nombre,//los datos vienen en un json q se llama payload. 
    cedula:request.payload.cedula
  });
    }    
});
//______________________________________________________________________________


//__________EJEMPLO DE COMO IMPORTAR UN MODELO__________________________________





  
/* 
const funcion=function (req,reply){ 
  Ejemplo.sequelize.sync();    
  Ejemplo.create({
    
    nombre:req.param('nombre'),
    cedula:req.param('cedula')
    
  });
}

server.method({
    name:'funcion',
    method:funcion,
    options:{}
});*/
  /*
   Puedo importar el modulo a traves de una variable, 
   e incluso en el modulo puedo definir metodos que puedo utilizar a traves de 
   la variable q uso para importar. Asi tipo objeto, tipo java.
*/
//______________________________________________________________________________
//________________------------EJEMPLOS------------______________________________