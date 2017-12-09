(function($){
  "use strict";
  var registry = {};
  var highest = 0;
  var operations = {
    '>': function(a,b){ return registry[a] > b; },
    '<': function(a,b){ return registry[a] < b; },
    '>=': function(a,b){ return registry[a] >= b; },
    '<=': function(a,b){ return registry[a] <= b; },
    '!=': function(a,b){ return registry[a] != b; },
    '==': function(a,b){ return registry[a] === b; },
    'dec': function(a,b){ registry[a] -= b; highest = Math.max(highest,registry[a]); },
    'inc': function(a,b){ registry[a] += b; highest = Math.max(highest,registry[a]); }
  };
  
  var cRegistry = function(val){
    if (val in registry) return;
    registry[val] = 0;
  };
  
  var append = function(log){
    $('#log').append('<div class="log">'+log+'</div>');
  };
  var log = function(line, val, success){
    var o = '<span class="line">'+line+'</span> ';
    if (success) {
      o += '<span class="res success">succès</span> ';
      o += '<span class="var">'+val+'</span> vaut <span class="value">' + registry[val] + '</span>';
    }
    else {
      o += '<span class="res fail">échec</span>';
    }
    append(o);
  }
  
  var test = function(line, val, op, diff, cond){
    cRegistry(cond.r);
    if (operations[cond.op](cond.r, cond.val)){
      cRegistry(val);
      operations[op](val, diff);
      log(line, val, true);
    }
    else {
      log(line, val, false);
    }
  };
  
  $.ajax({
    type: 'GET',
    url: 'input.txt',
    dataType: 'text',
    success: function(data){
      var lignes = data.split(/\r\n|\r|\n/);
      for (var i=0; i < lignes.length; i++){
        var re = /([a-z]+) (dec|inc) ([\-0-9]+) if ([a-z]+) ([!=<>]+) ([\-0-9]+)/;
        var r = re.exec(lignes[i]);
        test(r[0], r[1], r[2], parseInt(r[3], 10), {
          op: r[5], r: r[4], val: parseInt(r[6], 10)
        });
      }
      var max = Math.max.apply(null, _.values(registry));
      $('<div class="result">Valeur max: '+ max + '</div>'+
        '<div class="result">Valeur la plus haute obtenue: '+ highest + '</div>')
        .insertAfter('#log');

    },
    error: function(){
      alert('Ajax error!');
    }
  })
})(Zepto);