
var showDetails;
$(document).ready(function(){

      var socket = io();
      $("#add_status").click(function(){
        socket.emit('status added',$("#comment").val());
      });
      socket.on('refresh feed',function(msg){
        $("#show_comments").append(msg + '<br /><br />');
      });

      socket.on('fetch matches',function(data) {
          $("#matchlist").empty();
          for(var i = 0; i < data.length; i++) {
            $("#matchlist").prepend(
              '<li><a href="#" onclick="showDetails('+data[i].id+');">'+data[i].home_team+' vs '+data[i].away_team+'</a></li>'
            );
          }
      });

      socket.on('refresh matches',function(data) {
        console.log("Funcion refresh matches in app.js");
        console.log("La informacion recibida en data es ==>");
        console.log("Prueba de solo el id "+data.id);
        $("#matchlist").prepend(
          '<li><a href="#" onclick="showDetails('+data.id+');">'+data.home_team+' vs '+data.away_team+'</a></li>'
        );
      });

      // $("#add_match_button").click(function(){
      //   var home = $("#home_team").val();
      //   var away = $("#away_team").val();
      //   var data = {
      //     home: home,
      //     away: away
      //   }
      //   socket.emit('addMatch', data);
      //   $('#addMatchModal').modal('hide');
      // });

    showDetails = function showDetails(match_id) {
        socket.emit('getMatchDetails',match_id);
      }

      socket.on('display_details',function(data) {
        console.log("Reach display_details socket on -- hell yeah!");
        $("#home").html('<h4>'+data.home_team+'<h4>');
        $("#away").html('<h4>'+data.away_team+'<h4>');
        console.log(data);
      });

});
