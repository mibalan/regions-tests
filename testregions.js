$(function () {
    function prefixOM(name) {
        return PrefixFree.Prefix.toLowerCase() + name.replace(/^[a-z]/, function($0){ return $0.toUpperCase(); });
    }
    function prefixMethod(obj, method) {
        if (obj[method]) {
            return obj[method].bind(obj);
        } else {
            return obj[prefixOM(method)].bind(obj);
        }
    }
    
    var $flow, $region;  
    
    function setup(){
        $flow = $('<div />').css("flow-into", "article");
        $region = $('<div />').css("flow-from", "article"); 
            
        $("body").append($flow, $region)    
    }   
    
    function teardown(){
        $flow.remove();
        $region.remove();
    }  
    
    module("CSS Regions basic")
    
    test("Named flow - content should be pulled to a flow", function(){ 
        setup();
        
        ok($flow.css("flow-into") == "article");
        
        teardown();
    })
    
    test("Region - should consume from flow", function(){
        setup();

        ok($region.css("flow-from") == "article");

        teardown();
    })

    test("Region properties - region-overflow property", function() {
        setup();
        
        equal($region.css('region-overflow'), 'auto', 'Initial default value for region-overflow');
        
        $region.css('region-overflow', 'break');
        equal($region.css('region-overflow'), 'break', 'region-overflow: break');

        teardown();
    })

    //TODO Rework and re-enable tests once we get a resolution on intended test & current
    // implementation behavior.
    
    module("CSS OM");
    
    test("Document should return a flow by name", function(){      
        setup(); 

        ok(prefixMethod(document, "getFlowByName")("article"));
        
        teardown();
    }) 
    
    test("NamedFlow should have overflow property", function(){ 
        setup();

        ok(prefixMethod(document, "getFlowByName")("article").overflow === false);

        teardown(); 
    })

    test("NamedFlow should have contentNodes property", function() {
        setup();

        var namedFlow = prefixMethod(document, "getFlowByName")("article");
        ok(namedFlow.contentNodes, "NamedFlow.contentNodes");
        equal(namedFlow.contentNodes.length, 1, "NamedFlow.contentNodes has one node")

        teardown();
    })

    test("NamedFlow should have getRegionsByContentNode() function", function() {
        setup();

        var namedFlow = prefixMethod(document, "getFlowByName")("article");
        equal(typeof(namedFlow.getRegionsByContentNode), "function", "NamedFlow.getRegionsByContentNode is a function");

        teardown();
    })
    test("NamedFlow getRegionsByContentNode() should return NodeList", function() {
        setup();

        $flow.html('Foo');
        var namedFlow = prefixMethod(document, "getFlowByName")("article");
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
        ok($region[0][prefixOM("regionOverflow")] == "overflow"); 

        // less content, expect fit
        $flow.html("x");
        ok($region[0][prefixOM("regionOverflow")] == "fit"); 
        
        // no content, expect empty
        $flow.html("");
        ok($region[0][prefixOM("regionOverflow")] == "empty"); 

        teardown(); 
    })

    //TODO Write tests for getRegionFlowRanges() once this gets implemented

    asyncTest("regionLayoutUpdate event is thrown", function(){
        function handler(ev) {
            $region.unbind(prefixOM("regionLayoutUpdate"), handler);
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
        $region.bind(prefixOM("regionLayoutUpdate"), handler);
        $flow.html("Long text long text long text long long long longer very longer text");
    })

    module("Region styling");

    test("Basic @region rule support", function() {
        for (var prop in window) {
            if (window.hasOwnProperty(prop) && prop.indexOf("CSSRegionRule") != -1) {
                ok(prop, "Found CSSRegionRule constructor, @region rules seem to be supported")
                return;
            }
        }
        ok(false, "Couldn't find CSSRegionRule constructor on document.");
    });
})   