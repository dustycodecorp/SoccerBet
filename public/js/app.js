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
        $("#matchlist").prepend(
          '<li><a href="#" onclick="showDetails('+data.id+');">'+data.home+' vs '+data.away+'</a></li>'
        );
      });

      $("#add_match_button").click(function(){
        var home = $("#home_team").val();
        var away = $("#away_team").val();
        var data = {
          home: home,
          away: away
        }
        socket.emit('addMatch', data);
        $('#addMatchModal').modal('hide');
      });

    showDetails = function showDetails(match_id) {
        socket.emit('getMatchDetails',match_id);
      }
});
