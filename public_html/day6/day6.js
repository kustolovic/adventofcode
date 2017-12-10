(function($){
  "use strict";
  var Bank = function(pos, n, memory){
    this.n = n;
    this.pos = pos;
    this.memory = memory;
    this.init();
  };
  Bank.prototype = {
    init: function(){
      var o = '';
      for (var i=0; i < this.n; i++){
        o += '<div class="block"></div>';
      }
      this.$el = $('<div class="bank"><div class="blocks">'+o+'</div></div>');
      this.$n = $('<div class="count">'+this.n+'</div>');
      this.$el.prepend(this.$n).appendTo(this.memory.$el);
    },
    clone: function(){
      var clone = _.clone(this);
      clone.$el = clone.$el.clone().addClass('clone').appendTo('#clone');
      clone.$n = clone.$el.find('.count');
      return clone;
    },
    reset: function(){
      this.$n.text(0);
      this.n = 0;
      this.$el.find('.block').remove();
    },
    decrease: function(){
      if (this.n < 1) return false;
      this.n--;
      this.$n.text(this.n);
      this.$el.find('.block:last-child').remove();
      return true;
    },
    increase: function(){
      this.n++;
      this.$n.text(this.n);
      this.$el.find('.blocks').append('<div class="block"></div>');
    },
    remove: function(){
      this.$el.remove();
      delete this;
    }
  }
  var Memory = function(numbers){
    this.numbers = numbers;
    this.$el = $('#memory');
    this.banks = [];
    this.hashs = [];
    this.init();
  };
  Memory.prototype = {
    init: function(){
      for (var i=0; i < this.numbers.length; i++){
        this.banks.push(new Bank(i, parseInt(this.numbers[i], 10), this));
      }
      this.distribute();
    },
    getMaxBank: function(){
      return _.max(this.banks, function(bnk){ console.log(bnk.n); return bnk.n; });
    },
    addHash: function(){
      var loop = true;
      var hash = this.numbers.join(' ');
      if(_.contains(this.hashs, hash)){
        loop = false;
        var last = this.hashs.indexOf(hash)+1;
        $('#logs').prepend('<div class="log"><div class="num">'+this.hashs.length+'</div>'+hash+'</div>');
        $('#logs').prepend('<div class="log"><div class="num">Taille de la boucle</div>'+(this.hashs.length - last)+'</div>');
        return loop;
      }
      
      this.hashs.push(hash);
      $('#logs').prepend('<div class="log"><div class="num">'+this.hashs.length+'</div>'+hash+'</div>');
      return loop;
    },
    distribute: function(){
      var bank = this.getMaxBank();
      var clone = bank.clone();
      bank.reset();
      var self = this;
      var walk = function(){
//        setTimeout(function(){
          if (clone.decrease()){
            var next = bank.pos + 1;
            if (next >= self.numbers.length) next = 0;
            bank = self.banks[next];
            bank.increase();
            walk();
          }
          else {
            self.finishDistribution(clone);
          }
//        }, 10);
      };
      walk();
    },
    finishDistribution: function(clone){
      clone.remove();
      this.numbers = _.pluck(this.banks, 'n');
      if (this.addHash()) {
        setTimeout(this.distribute.bind(this), 40);
      }
    }
  };
  
  $.ajax({
    type: 'GET',
    url: 'input.txt',
    dataType: 'text',
    success: function(data){
      var numbers = data.split(/\s/);
      new Memory(numbers);
    },
    error: function(){
      alert('Ajax error!');
    }
  })
})(Zepto);