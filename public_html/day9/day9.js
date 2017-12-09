(function($){
  "use strict";
  
  $.ajax({
    type: 'GET',
    url: 'input.txt',
    dataType: 'text',
    success: function(data){
      var stream = data.replace(/\!./g, '');
      var rep = {
        '{': '&lbrace;',
        '}': '&rbrace;',
        '<': '&lt;',
        '>': '&gt;',
      };
      var rep2 = {
        '{': '<div class="group">',
        '}': '</div>',
      };
      stream = stream.replace(/<([^>]*)>/g, function(match, p1){
        return '<span class="garbage">'+match.replace(/[<\{\}]/g, function(m){ return rep[m]; })+'</span>';
      });
      $('#stream').html(
        stream.replace(/[\{\}]/g, function(m){ return rep2[m]; }).replace(/,<div/g, '<div').replace(/,<span/g, '<span')
      );
      
      var score = 0;
      var explore = function($el, deep){
        $el.children('.group').each(function(){
          score += deep;
          explore($(this), deep+1);
        });
      }
      explore($('#stream'), 1);
      
      var trashcount = 0;
      $('.garbage').each(function(){
        trashcount += $(this).text().length - 2;
      });
      
      $('#stream').prepend('<h2>La quantité de déchets est ' +  trashcount +'</h2>');
      $('#stream').prepend('<h2>Le score est ' +  score +'</h2>');
    },
    error: function(){
      alert('Ajax error!');
    }
  })
})(Zepto);