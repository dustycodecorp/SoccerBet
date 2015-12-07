var app       =     require("express")();
//var mysql     =     require("mysql");
var sqlite3   =     require("sqlite3").verbose();
var db        =     new sqlite3.Database('./quiniela.db');
var http      =     require("http").Server(app);
var io        =     require("socket.io")(http);
var path      =     require("path");
var express   =     require("express")

var initload = false;
var matches  = [];


app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

/*  This is auto initiated event when Client connects to Your Machien.  */

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
      console.log("data ==> "+ teams.home);
      console.log("data ==> "+ teams.away);

      add_match(teams, function(callback){
          console.log("RES => "+callback);
          if (callback == null) {
            console.log(this);
            io.emit('refresh matches',data);
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

var get_details = function (match_id,callback) {
    console.log("TRying to get details from match "+match_id);

}


http.listen(3000,function(){
    console.log("Listening on 3000");
});
