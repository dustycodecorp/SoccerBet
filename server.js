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

io.on('connection',function(socket){
    console.log("A user is connected");
    // socket.on('test',function(status){
    //   add_status(status,function(res){
    //     if(res){
    //         io.emit('refresh feed',status);
    //     } else {
    //         io.emit('error');
    //     }
    //   });
    // });

    socket.on('addMatch',function(teams){

      add_match(teams, function(callback){
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
          console.log(rows);
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
          //console.log(row);
          socket.emit('display_details', row)
          });
        });
}


});

var add_status = function (status,callback) {

}

var add_match = function (teams,callback) {
    var home = teams.home;
    var away  = teams.away;


db.serialize(function() {
  db.run("INSERT INTO `matches` (`home_team`, `away_team`) VALUES (?, ?)", [home, away], callback);
});



}




http.listen(3000,function(){
    console.log("Quiniela-o-matic is now running, listening on 3000");
});
