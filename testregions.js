$(function () {
    
    var $flow, $region;  
    
    function setup(){
        $flow = $('<div />').css("-webkit-flow-into", "article");    
        $region = $('<div />').css("-webkit-flow-from", "article"); 
            
        $("body").append($flow, $region)    
    }   
    
    function teardown(){
        $flow.remove();
        $region.remove();
    }  
    
    module("CSS Regions basic")
    
    test("Named flow - content should be pulled to a flow", function(){ 
        setup();   
        
        ok($flow.css("-webkit-flow-into") == "article");
        
        teardown();
    })
    
    test("Region - should consume from flow", function(){        
        setup();

        ok($region.css("-webkit-flow-from") == "article");

        teardown();
    })
    
    module("CSS OM");
    
    test("Document should return a flow by name", function(){      
        setup(); 
        
        ok(document.webkitGetFlowByName("article"));
        
        teardown();           
    }) 
    
    test("NamedFlow should have overflow property", function(){ 
        setup();

        ok(document.webkitGetFlowByName("article").overflow === false)   

        teardown(); 
    })
    
    test("Element should have regionOverflow property", function(){   
        
        setup();
        
        $region.css(
            {
                "width": "20px",
                "height": "20px"
            }
        );
        
        // lots of content, expect overflow
        $flow.html("Long text Long text Long text Long text ");
        ok($region[0].webkitRegionOverflow == "overflow"); 

        // less content, expect fit
        $flow.html("x");
        ok($region[0].webkitRegionOverflow == "fit"); 
        
        // no content, expect empty
        $flow.html("");
        ok($region[0].webkitRegionOverflow == "empty"); 

        teardown(); 
    })

})   