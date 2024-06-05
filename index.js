var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app= Express();
app.use(cors());

var CONNECTION_STRING="mongodb+srv://admin:262658@cluster0.opnlvld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

var DATABASENAME = "todoappdb"
var database;

app.listen(5083, () =>{
    Mongoclient.connect(CONNECTION_STRING, (error, client)=>{
        database=client.db(DATABASENAME);
        console.log("conexion exitosa con Mongo DB");
    })
})

app.get('/api/todoapp/getNotes', (request, response) =>{
    database.collection("todoappcollection").find({}).toArray((error, result) =>{
        response.send(result);
    });
})

app.post('/api/todoapp/AddNotes', multer().none(), (request, response)=>{
    database.collection("todoappcollection").count({}, function(error, numOfDocs){
        database.collection("todoappcollection").insertOne({
            id:(numOfDocs+1).toString(),
            description:request.body.newNotes
        });
        response.json("Agregado correctamente");
    })
})

app.delete('/api/todoapp/DeleteNotes', (request, response)=>{
    database.collection("todoappcollection").deleteOne({
        id:request.query.id
    });
    response.json("se borró exitosamente")
})