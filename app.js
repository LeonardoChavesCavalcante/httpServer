var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//bodyParser.json();
app.use(bodyParser.json(),function(req, res, next) {
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","DELETE,GET,PUT,POST,PATH");  
  next();
}); // for parsing application/json necessário para entender o json recebido no body

var saudar =(req,res)=>{                  
  res.send('opá estamos ligados!');
  res.end()
};

var buscarDados = (req,res)=>{
  if (req.url.includes(".ico")){
    return res.end();
  }  

  var  dados = require('./'+req.params["resource"]);
  if (req.params["id"]){
    dados = dados.find(p => p.id == req.params["id"] );
  }else{
    dados = dados.sort( (prev,cur) => {
      return Number(prev.id) - Number(cur.id);
    } );
  }  
  res.json(dados);     
};

var inserirDados = (req,res)=>{  
  var  dados = require('./'+req.params["resource"]);
  if (!req.body.id){
    var maxId = dados.reduce((prev,cur)=> prev.id >cur.id?prev.id:cur.id );    
    req.body.id = Number(maxId) +1 ;
  }
  dados.push(req.body);  
  res.json(dados.find(r => r.id == req.body.id) );
};

var alterarDados = (req,res)=>{  
  var dados = require('./'+req.params["resource"]);
  var dado = dados.find(p => p.id == req.body.id );
  dados.splice(dados.indexOf(dado),1,req.body);    
  res.json(req.body);  
};

var removerDados = (req,res)=>{  
  var dados = require('./'+req.params["resource"]);
  var dado = dados.find(p => p.id == req.params["id"]);
  var index = dados.indexOf(dado);
  if (index >= 0){
    dados.splice(index,1);
  }    
  res.json({});  
};


app.get('/', saudar);
app.get('/:resource',buscarDados);
app.get('/:resource/:id',buscarDados);
app.put('/:resource',alterarDados);
app.put('/:resource/:id',alterarDados);
app.post('/:resource',inserirDados);
app.delete('/:resource/:id',removerDados);


var iniciarLogServidor =()=>{ 
  console.log("Servidor iniciado")
};

app.listen(4000,iniciarLogServidor);
