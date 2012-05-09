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

    test("Region properties - region-overflow property", function() {
        setup();
        
        equal($region.css('-webkit-region-overflow'), 'auto', 'Initial default value for region-overflow');
        
        $region.css('-webkit-region-overflow', 'break');
        equal($region.css('-webkit-region-overflow'), 'break', 'region-overflow: break');

        teardown();
    })

    //TODO Rework and re-enable tests once we get a resolution on intended test & current
    // implementation behavior.
    
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

    test("NamedFlow should have contentNodes property", function() {
        setup();

        var namedFlow = document.webkitGetFlowByName("article");
        ok(namedFlow.contentNodes, "NamedFlow.contentNodes");
        equal(namedFlow.contentNodes.length, 1, "NamedFlow.contentNodes has one node")

        teardown();
    })

    test("NamedFlow should have getRegionsByContentNode() function", function() {
        setup();

        var namedFlow = document.webkitGetFlowByName("article");
        equal(typeof(namedFlow.getRegionsByContentNode), "function", "NamedFlow.getRegionsByContentNode is a function");

        teardown();
    })
    test("NamedFlow getRegionsByContentNode() should return NodeList", function() {
        setup();

        $flow.html('Foo');
        var namedFlow = document.webkitGetFlowByName("article");
        var theRegions = namedFlow.getRegionsByContentNode($flow.contents()[0]);

        equal(theRegions.length, 1, "One region for the content");
        equal(theRegions[0], $region.get(0), "Same region is returned");

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

    //TODO Write tests for getRegionFlowRanges() once this gets implemented

    asyncTest("regionLayoutUpdate event is thrown", function(){
        function handler(ev) {
            $region.unbind("webkitRegionLayoutUpdate", handler);
            console.log(ev.target);
            equal(ev.target, $region[0], "Event.target points to the region");
            teardown();
            start();
        }

        setup();
        $region.css(
            {
                "width": "20px",
                "height": "20px"
            }
        );
        $flow.html("M");
        $region.bind("webkitRegionLayoutUpdate", handler);
        $flow.html("Long text long text long text long long long longer very longer text");
    })

    module("Region styling");

    test("Basic @region rule support", function() {
        ok(window.WebKitCSSRegionRule, "@region rules seem to be supported");
    });
})   