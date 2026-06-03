const http = require('http');

const server = http.createServer((request, response) => {
    try{
        if(request.url=='/'&&request.method=='GET'){
            response.statusCode=200
            response.end(JSON.stringify({"message":"accediendo al servidor"}))
        }else if(request.url=='/home'&&request.method=='GET'){
            response.statusCode=300
            response.end(JSON.stringify({"message":"accediendo a home"}))
        }else{
            response.statusCode=404
            response.end(JSON.stringify({"message":"Pagina no encontrada"}))
        }
    }catch(error){
        response.statusCode = 500
        response.end(JSON.stringify({"message":"Ah ocurrido un error en el servidor"}))
    }
});

const port = 3000;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(`Servidor ejecutandose en http://${host}:${port}`);//el link es http://localhost:3000
});