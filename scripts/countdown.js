// Pure JavaScript

var countdown = function(end, elements) {
  var second = 1000,
      minute = second * 60,
        hour = minute * 60,
         day = hour * 24,

         end = new Date(end),
       timer,
   calculate = function() {
     var now = new Date(),
     remaining = end.getTime() - now.getTime();

     if (remaining <= 0) {
       clearInterval(timer);
     } else {
       if (!timer) {
         timer = setInterval(calculate, second);
       }

       var data = {
         'days': Math.floor(remaining / day),
         'hours': Math.floor((remaining % day) / hour),
         'minutes': Math.floor((remaining % hour) / minute),
         'seconds': Math.floor((remaining % minute) / second)
       }

       if (elements.length) {
         for(x in elements) {
           var x = elements[x];
           document.getElementById(x).innerHTML = data[x];
         }
       }
     }


   };

  calculate();
}
