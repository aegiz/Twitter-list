Hull.init({
   appId : "54db24c7e4bd981bee000281",
   orgUrl: "https://6e082fcc.hullapp.io",
   debug:false,
}, function(hull) {
   console.log("Hull is initialized for app", hull.config());
});

 // On auth success
var $facebook_login = $('.facebook-login'),
    $twitter_login = $(".twitter-login");
var refreshButton = function() {
   var user = Hull.currentUser();
   if (user) {
      $facebook_login.html("Connected as " + user.name + ". Logout");
      $twitter_login.html("Connected as " + user.name + ". Logout");
   } else {
      $facebook_login.html("Login with Facebook");
      $twitter_login.html("Login with Twitter");
   }
}
// Let's initialize it when you app is loaded
/*Hull.on('hull.init', function() {
   refreshButton();
   $facebook_login.on('click', function() {
      if (Hull.currentUser()) {
         Hull.logout();
      } else {
         Hull.login({provider:'facebook'});
         postComment();
      }
   });
   $twitter_login.on('click', function() {
      debugger;
      if (Hull.currentUser()) {
         Hull.logout();
      } else {
         Hull.login({provider:'twitter'}).then(function(me){
           debugger; 
         });
      }
   });

   
});*/

Hull.on('hull.auth.login', function(me) {
   Hull.api({
     provider:'twitter',
     path:'/statuses/home_timeline'
   },function(result){
     console.log('This is the result', result)
   });
})


// Let's react to all events prefixed by 'hull.auth'
Hull.on('hull.auth.*', refreshButton);

