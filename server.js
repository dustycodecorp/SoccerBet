var app       =     require("express")();
var sqlite3   =     require("sqlite3").verbose();
var db        =     new sqlite3.Database('./quiniela.db');
var http      =     require("http").Server(app);
var io        =     require("socket.io")(http);
var path      =     require("path");
var express   =     require("express")

var initload = false;
var matches  = [];


app.get("/",function(req,res){
    res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

/*  This is auto initiated event when Client connects to Your Machine.  */

io.on('connection',function(socket) {
    console.log("A user is connected");

    socket.on('addMatch',function(teams){

      add_match(teams, function(callback) {
          if (callback == null) {
            console.log("Que llego aqui");
            console.log(this);
            var information = {
              "home_team" : teams.home,
              "away_team" : teams.away,
              "id"  : this.lastID
            }
            io.emit('refresh matches',information);
          } else {
            io.emit('error');
          }
      });
    });

    socket.on('addPrediction',function(prediction){

      add_prediction(prediciton, function(callback) {
        if (callback == null) {
          console.log("Add Prediction -- Que llego aqui?");
          console.log(this);
          io.emit('refresh predictions', prediciton);
        } else {
          io.emit('error');
        }
      });
    });

    socket.on('getMatchDetails',function(match_id) {
      get_details(match_id, function(callback){
          console.log("== Calback getMatchDetails ==");
          console.log(callback);
          if (callback) {
            //io.emit('refresh matches',data);
          } else {
            //io.emit('error');
          }
      });
    });

    //if (! initload) {
        // Initial app start, run db query
        var matches  = [];

        initload = true
    //} else {
        // Initial notes already exist, send out
        db.serialize(function() {
          var rows = "";
          db.all("SELECT * FROM matches order by created_at asc LIMIT 25", function(err, row) {
          //console.log(row);
          rows = row;
          console.log("Returning stored matches");
          socket.emit('fetch matches', rows)
          });
          //socket.emit('fetch matches', row)
        });


    //}

    var get_details = function (match_id,callback) {
    console.log("== Trying to get details from match => "+match_id);
    db.serialize(function() {
          var rows = "";
          db.get("SELECT * FROM matches where id = ?", [match_id], function(err, row) {
            if (err != null) {
              console.log("error found");
              console.log(err);
            }
          socket.emit('display_details', row);
          });

          db.all("SELECT * FROM predictions WHERE match_id = ?", [match_id], function(err, predictions) {
            if (err != null) {
              console.log("error found when getting predictios");
              console.log(err);
            }
            console.log(predictions);
            socket.emit('display_predictions', predictions);
          });  
          
        });
}


});

var add_match = function (teams,callback) {
  var home = teams.home;
  var away  = teams.away;

  db.serialize(function() {
    db.run("INSERT INTO `matches` (`home_team`, `away_team`) VALUES (?, ?)", [home, away], callback);
  });
}

var add_prediction = function (prediction, callback) {
  var match_id            = prediction.match_id; 
  var home_team_score     = prediction.home_score;
  var away_team_score     = prediction.away_score;
  var user_name           = prediction.username;
  var did_pay              = prediction.did_pay;

  db.serialize(function() {
    db.run("INSERT INTO `matches` "+
      "(`match_id`, `home_team_score, away_team_score, user_name, did_pay`)"+
      " VALUES (?, ?)",
      [match_id, home_team_score, away_team_score, user_name, did_pay], callback);
  });
}



http.listen(3000,function(){
    console.log("SoccerBet is now running, listening on 3000");
});
