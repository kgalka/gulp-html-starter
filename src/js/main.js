jQuery(document).ready(function($){

    var Site = {
        
        init: function() {
            Site.customFunction();
        },

        customFunction: function() {
            console.log('test');
        }

    };

    // here we go!
    Site.init();
});