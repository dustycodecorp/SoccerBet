var app       =     require("express")();
var mysql     =     require("mysql");
var http      =     require("http").Server(app);
var io        =     require("socket.io")(http);
var path      =     require("path");
var express   =     require("express")

var initload = false;
var matches  = [];

/* Creating POOL MySQL connection.*/

var pool    =    mysql.createPool({
      connectionLimit   :   100,
      host              :   'localhost',
      user              :   'root',
      password          :   '',
      database          :   'your_database_name',
      debug             :   false
});

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
          console.log("RES =>"+callback);
          if (callback) {
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
        pool.getConnection(function(err,connection){
          var queryString = "SELECT * FROM matches order by created_at asc limit 15";
        connection.query(queryString, function(err, rows, fields) {
          if (err) throw err;
          for (var i in rows) {
            console.log('Match id: ', rows[i].id);
            matches.push(rows[i]);
          }
          socket.emit('fetch matches', matches);

        });
      });
        initload = true
    //} else {
        // Initial notes already exist, send out
        socket.emit('fetch matches', matches)
    //}


});

var add_status = function (status,callback) {
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          callback(false);
          return;
        }
    connection.query("INSERT INTO `porra` (`s_text`) VALUES ('"+status+"')",function(err,rows){
            connection.release();
            if(!err) {
              callback(true);
            }
        });
     connection.on('error', function(err) {
              callback(false);
              return;
        });
    });
}

var add_match = function (teams,callback) {
    var home = teams.home;
    var away  = teams.away;

    pool.getConnection(function(err,connection){

        if (err) {
          console.log("Error gettin conection to the databse");
          connection.release();
          callback(false);
          return;
        }
    connection.query("INSERT INTO `matches` (`home_team`, `away_team`) VALUES ('"+home+"', '"+away+"')",function(err,rows){
            connection.release();
            if(!err) {
              data = {
                "home" : home,
                "away" : away,
                "id"   : rows.insertId
              }
              callback(data);
            } else {
              console.log("Error found in MySQL =>");
              console.log(err);
            }
        });
     connection.on('error', function(err) {
              console.log("Error found =>");
              console.log(err);
              callback(false);
              return;
        });
    });
}

var get_details = function (match_id,callback) {
    console.log("TRying to get details from match "+match_id);
    pool.getConnection(function(err,connection){

        if (err) {
          console.log("Error gettin conection to the databse");
          connection.release();
          callback(false);
          return;
        }
    connection.query("Select * from `matches` WHERE id = "+match_id+"",function(err,rows){
            connection.release();
            if(!err) {
              data = {
                "home" : rows[0].home_team,
                "away" : rows[0].away_team,
                "id"   : rows[0].id
              }
              callback(data);
            } else {
              console.log("Error found in MySQL =>");
              console.log(err);
            }
        });
     connection.on('error', function(err) {
              console.log("Error found =>");
              console.log(err);
              callback(false);
              return;
        });
    });
}


http.listen(3000,function(){
    console.log("Listening on 3000");
});
