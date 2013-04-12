// Generated by CoffeeScript 1.6.2
(function() {
  var rtc, wireCall;

  rtc = holla.createClient({
    debug: true
  });

  wireCall = function(call) {
    var name, user, _fn, _ref;

    _ref = call.users();
    _fn = function(user) {
      user.ready(function() {
        console.log("" + user.name + " ready");
        return user.stream.pipe($(".them"));
      });
      user.on("answered", function() {
        return console.log("" + user.name + " answered");
      });
      return user.on("declined", function() {
        return console.log("" + user.name + " declined");
      });
    };
    for (name in _ref) {
      user = _ref[name];
      _fn(user);
    }
    call.on("end", function() {
      return $(".them").attr("src", "");
    });
    return $("#hangup").click(function() {
      return call.end();
    });
  };

  $(function() {
    $("#me").hide();
    $("#them").hide();
    $("#whoCall").hide();
    $("#hangup").hide();
    return $("#whoAmI").change(function() {
      var name;

      name = $("#whoAmI").val();
      $(".me").show();
      $(".them").show();
      $("#whoAmI").remove();
      $("#whoCall").show();
      $("#hangup").show();
      return holla.createFullStream(function(err, stream) {
        if (err) {
          throw err;
        }
        stream.pipe($(".me"));
        return rtc.register(name, function(err) {
          if (err) {
            throw err;
          }
          console.log("Registered as " + name + "!");
          rtc.on("call", function(call) {
            console.log("Inbound call", call);
            call.on('error', function(err) {
              throw err;
            });
            call.setLocalStream(stream);
            call.answer();
            return wireCall(call);
          });
          return $("#whoCall").change(function() {
            var toCall;

            toCall = $("#whoCall").val();
            return rtc.createCall(function(err, call) {
              var user;

              if (err) {
                throw err;
              }
              console.log("Created call", call);
              call.on('error', function(err) {
                throw err;
              });
              call.setLocalStream(stream);
              user = call.add(toCall);
              return wireCall(call);
            });
          });
        });
      });
    });
  });

}).call(this);