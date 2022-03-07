var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Content-Length');
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
        });
        res.end();
        return;
    }
    if (['GET', 'POST'].indexOf(req.method) > -1) {
        if (req.url === "/showtodos") {
            var tododata = fs.readFileSync('./todos.json');
            tododata = JSON.parse(tododata);
            res.writeHead(200, {"Content-Type": "text/json"});
            res.end(JSON.stringify(tododata));
        }
        else if (req.url === "/savetodos") {
            var body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                data = JSON.parse(body);
                fs.writeFile('./todos.json', JSON.stringify(data.todos), 'utf8', () => {
                    res.writeHead(200, {"Content-Type": "text/json"});
                    res.end(JSON.stringify({message: 'saved successfully'}));
                });
            });
            
        }
    }
});

server.listen(3000, function(){
    console.log("Server UP at port number 3000");
});