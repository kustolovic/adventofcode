(function($){
  "use strict";
  var Knot = function(lengths, data){
    this.lengths = lengths;
    this.data = data;
    this.iter = 256;
    this.position = 0;
    this.vals = [];
    this.stage = 0;
    this.skipsize = 0;
    this.nextInterval = false;
    this.loop = 1;
    this.init();
  };
  Knot.prototype = {
    init: function(){
      for (var i=0; i<this.iter; i++){
        var deg = i * 360 / this.iter;
        var el = '<div class="el" style="transform: rotate('+deg+'deg)">';
        el += '<span class="val" style="transform: rotate(-'+deg+'deg)">';
        el += i+'</span></div>';
        $('#knots').append(el);
        this.vals.push(i);
      }
      for (var j=0; j<this.lengths.length; j++){
        $('#lengths').append('<div class="length">'+this.lengths[j]+'</div>');
      }
      this.$vals = $('.val');
      this.$lengths = $('.length');
      this.setActive();
      
      var self = this;
      $('a.tye').click(function(e){
        e.preventDefault();
        $('a.calc').remove();
        self.next();
      });
      $('a.calc').click(function(e){
        e.preventDefault();
        $('a.tye').remove();
        $('a.calc').remove();
        self.initHash();
      });
    },
    initHash: function(){
      this.lengths  = this.data.split('').map(function(s){ return s.charCodeAt(0) });
      Array.prototype.push.apply(this.lengths , [17, 31, 73, 47, 23]);
      $('#lengths').empty().addClass('hash');
      for (var j=0; j<this.lengths.length; j++){
        $('#lengths').append('<div class="length">'+this.lengths[j]+'</div>');
      }
      $('#infos').prepend('<div id="loop">1</div>');
      this.$lengths = $('.length');
      this.setActive();
      
      this.doloop();
    },
    doloop: function(){
      this.nextInterval = setInterval(function(){
        this.next();
      }.bind(this), 1);
    },
    setActive: function(){
      this.$vals.filter('.active').removeClass('active');
      this.$vals.eq(this.position).addClass('active');
      this.$lengths.filter('.active').removeClass('active');
      this.$lengths.eq(this.skipsize%this.lengths.length).addClass('active');
    },
    setValues: function(){
      this.$vals.each(function(index, item){
        $(item).text(this.vals[index]);
      }.bind(this));
    },
    next: function(){
      var l = this.lengths[this.skipsize%this.lengths.length];
      var rev = this.vals.slice(this.position, this.position+l);
      if (rev.length < l){
        Array.prototype.push.apply(rev, this.vals.slice(0, l-rev.length));
      }
      
      rev.reverse();
      for (var i=0; i<rev.length; i++){
        this.vals[(this.position+i)%this.iter] = rev[i];
      }
      this.position = (this.position + l + this.skipsize)%this.iter;
      this.skipsize++;
      this.setValues();
      this.setActive();
      
      if (this.skipsize%this.lengths.length == 0){
        this.finish();
      }
    },
    finish: function(){
      $('a.tye').remove();
      if (this.nextInterval) {
        
        this.loop++;
        if (this.loop < 65){
          $('#loop').text(this.loop);
        }
        else {
          clearInterval(this.nextInterval);
          this.calcHash();
        }
      }
      else {
        var el1 = this.vals[0];
        var el2 = this.vals[1];
        $('#infos').append('<div class="result">La multiplication des deux premiers éléments de la liste vaut '+(el1*el2)+'</div>');
      }
      
    },
    calcHash: function(){
      var res = [];
      for (var bl = 0; bl < 16; bl++) {
        var block = this.vals.slice(bl * 16, 16 * (bl + 1));
        res.push(block.reduce(function(a,b){ return a ^ b; }));
      }
      var hash = res.map(function(a){ return ('0' + a.toString(16)).substr(-2); }).join('');
      $('#infos').append('<div class="result">Le hachis de nœud vaut '+hash+'</div>');
    }
  }
  
  $.ajax({
    type: 'GET',
    url: 'input.txt',
    dataType: 'text',
    success: function(data){
      var lengths = data.split(/,/).map(function(n){ return parseInt(n, 10)});
      new Knot(lengths,data);
    },
    error: function(){
      alert('Ajax error!');
    }
  })
})(Zepto);