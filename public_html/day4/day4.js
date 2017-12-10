(function($){
  "use strict";
  var processPhrases = function(phrases){
    var successCount = 0;
    var successCount2 = 0;
    for (var i=0; i < phrases.length; i++){
      var parts = phrases[i].split(' ');
      var success = _.uniq(parts).length === parts.length;
      var style = success ? 'success' : 'fail';
      if (success){
        successCount++;
        for (var j=0; j < parts.length; j++){
          parts[j] = parts[j].split('').sort().join('');
          
        }
        var success2 = _.uniq(parts).length === parts.length;
        if (success2) successCount2++;
        style += success2 ? ' success2' : ' fail2';
      }
      $('#phrases').append('<div class="phrase '+style+'"><span>'+phrases[i]+'</span></div>');
    }
    $('#results').append('<div class="result">'+successCount+' phrases sont valides</div>');
    $('#results').append('<div class="result">'+successCount2+' phrases sont valides avec la vérification stricte</div>');
  };
  
  $.ajax({
    type: 'GET',
    url: 'input.txt',
    dataType: 'text',
    success: function(data){
      processPhrases(data.split(/\n/));
    },
    error: function(){
      alert('Ajax error!');
    }
  })
})(Zepto);