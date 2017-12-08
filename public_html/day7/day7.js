(function($){
  var template = _.template($('#bloc-template').text());
  $.getJSON('input.json', function(data){    
    for (var j in data){
      $('#schema').append(template({id: j, children: data[j]}));
    }
    $('.bloc-parent').each(function(){
      var id = $(this).data('name');
      var $parent = $('#'+id);
      if ($parent.length){
        $parent.replaceWith(this);
      }
      
//      console.log($(this).data('name'));
    });
  })
})(Zepto);