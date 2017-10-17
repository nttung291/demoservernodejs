var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');

var Girl = require ('./models/girl')


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
//1.Connect
var mlabUri = "mongodb://admin:admin@ds143542.mlab.com:43542/girls"
mongoose.connect(mlabUri, {useMongoClient: true});
//2.Dump data
// var girl = new Girl({
//   name: "Ai Vy",
//   image: "https://scontent.fhan2-2.fna.fbcdn.net/v/t1.0-9/22405977_1301611749960978_9185372641484372039_n.jpg?oh=7c9758dd5315b3fcce37885ec43f623b&oe=5A85862A",
//   yob: 1995
// });
// girl.save();
//3. Use in GET /girls
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/api',function(request,response){
  response.json({hello: 'world'});
});
app.get('/api/girls',function(request,response){
  Girl.find(
    {},
    function(err,girls){
      if (err) {
        response.json({sucess : 0, data: null});
      }
      else{
        response.json({sucess: 1,data: girls});
      }
    }
  );
});

app.post('/api/girls',function(req,res){
  var body = req.body;
  var name = body.name;
  var image = body.image;
  var yob= body.yob;
  var girl = new Girl({
    name : name,
    image : image,
    yob: yob
  });
  girl.save(function(err,savedGirl){
    if (err) {
      res.json({sucess:0, data:null, message: "Error in save" + err});
    }
    else{
      res.json({sucess:1,data:savedGirl});
    }
  });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
