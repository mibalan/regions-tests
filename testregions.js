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

    test("Region break properties", function(){
        function testBreakProperty(prop) {
            setup();

            equal($region.css(prop), 'auto', 'Initial default value for ' + prop);

            //TODO Since these do not actually overload break-[before|inside|after], the name of the
            //attributes does not conform to the spec, either.
            $region.css(prop, 'region');
            equal($region.css(prop), 'region', 'Always break on ' + prop);

            $region.css(prop, 'avoid-region');
            equal($region.css(prop), 'avoid-region', 'Avoid breaking on ' + prop);

            teardown();
        }

        testBreakProperty('-webkit-region-break-before');
        testBreakProperty('-webkit-region-break-inside');
        testBreakProperty('-webkit-region-break-after');
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

    test("Element should have getRegionFlowRanges() function", function() {
        //TODO
    })

    test("regionLayoutUpdate event exists", function(){
        //TODO
    })

    test("regionLayoutUpdate event is thrown", function(){
        //TODO
    })

    module(" Region styling");

    test("Creating @region rule", function() {
        //TODO
    })

    test("Function to get region styling exists", function() {
        //TODO
    })

    test("Minimal region styling is applied", function() {
        //TODO
    })
})   