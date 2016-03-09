//=require ../../bower_components/jquery/dist/jquery.js 

jQuery(document).ready(function($){

    var Site = {
        
        init: function() {
            Site.customFunction();
        },

        customFunction: function() {
            console.log('milllove');
        }

    };

    // here we go!
    Site.init();
});