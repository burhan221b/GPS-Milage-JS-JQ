
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

// Simple jQuery event handler
$(document).ready(function () {
    "use strict";
    var startPos;
    var startPosLat;
    var startPosLong;
    var distance;

    
    
    $("#button").on("click", function(){
        $("#distance").text('Loading......');
        $("#startLat").text('Locating......');
        $("#startLon").text('Locating......');
        $("#currentLat").text('Locating......');
        $("#currentLon").text('Locating......');
        $("#message").text('Calculating......');
        $("#roundtrip").text('Calculating......');
        var found = false;
        var $city = $('#city');
        var $state = $('#state');
        var responseObject; 
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(city.value);
                console.log(xhr.readyState);
                console.log(xhr.status);
//________________________________________________________________
                //tempmain.js has my original code that works with cities.json file
                responseObject = JSON.parse(xhr.responseText);
//                console.log(responseObject.events[0].city);//this works
                for(var i = 0; i < responseObject.length; i++){
//                    console.log(responseObject.events[i].city);
                    if(responseObject[i].city === city.value && responseObject[i].state === state.value){
                        found = true;
                        startPosLat = responseObject[i].latitude;
                        startPosLong = responseObject[i].longitude;
                        console.log(startPosLat + " " + startPosLong);

                        loco(startPosLat, startPosLong);
                    }
                        
                }
                console.log(found);

                if(found === false){
                    $("#distance").text('Unable to find. Check spelling and try again.');
                    alert("Sorry, couldn't find that city, please check spelling.");
                }
            }
        }

//        xhr.open("GET", "cities.json", true);
        xhr.open("GET", "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json", true);
//        https://stackoverflow.com/questions/1523686/timeout-xmlhttprequest
        xhr.timeout = 5000; // Set timeout to 4 seconds (4000 milliseconds)
        xhr.ontimeout = function () { alert("Can not connect to server, please try again."); }
        
        xhr.send(null);
        
        
        //ajax JQ
//        $.ajax({
//            type: "GET",
//            url: "cities.json",
//            dataType: "json",
//            success: function(data){
//                $.each(data, function(data){
//                    if(data.city === city.value && data.state === state.value){
//                        startPosLat = data.latitude;
//                        startPosLong = data.longitude;
//                        loco();
//                    }
//                })
//                }
////                $.each(data, function(index){
////                    if(index.country ===  )
////                })
//            
//        })
    });

    
    function loco(startPosLat, startPosLong){
        if (navigator.geolocation) {
//            var e = document.getElementById("city");
//            var currentop = e.options[e.selectedIndex].value;
//            if(currentop == 1){
//            startPosLat = 37.819929;  // latitude of sjcc
//            startPosLong = -122.478255;
//                document.getElementById("chosen").innerHTML = "Golden Gate Bridge";
//            }
//            else if(currentop == 2){
//            startPosLat = 25.197197;  // latitude of sjcc
//            startPosLong = 55.274376;
//                document.getElementById("chosen").innerHTML = "Bridge Khalifa";
//            }
//            else{
//            startPosLat = -33.852306;  // latitude of sjcc
//            startPosLong = 151.210787;
//                document.getElementById("chosen").innerHTML = "Sydney Harbour Bridge";
//            }
            console.log(startPosLat + " " + startPosLong);
//            $("#startLat").text(startPosLat);
//            $("#startLon").text(startPosLong);
            
            
            //this below code is for GSP like position locating 
//            navigator.geolocation.watchPosition(function(position)
//          the below code is get it now.
            navigator.geolocation.getCurrentPosition(function(position) {
            $("#startLat").text(startPosLat);
            $("#startLon").text(startPosLong);
                console.log(startPosLat + " " + startPosLong);
            $("#currentLat").text(position.coords.latitude);
            $("#currentLon").text(position.coords.longitude);
            var distance = calculateDistance(startPosLat, startPosLong,position.coords.latitude, position.coords.longitude);
            distance = distance.toFixed(2);
            var gasprice =  gas(distance);
            $("#distance").text(distance + " miles (approximately)");
            $("#message").text("$" + gasprice + " for " + distance + " miles (approximately)");
            $("#roundtrip").text("$" + (gasprice * 2) + " for " + (distance * 2)+ " miles (approximately)");
            $('#date').remove();
            updatedate();
            });
        } else{
            window.alert("Your browser and/or device does not support geolocation.")
        }
    };

        
//
//       var city = document.getElementById("city");
        
//       city.addEventListener("change", loco, false);
    
    function updatedate(){
        var d = new Date();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var day = d.toDateString();
        console.log(hrs+":"+mins);
        var m;
        if(hrs > 12){
            hrs = hrs - 12;
            m = "pm";
        } else{
            m = "am";
        }

        if(mins < 10){
            mins = mins.toFixed(2);
        }
        
        var $msg = $('<p id="date">Last Updated <span>' +day +' '+ hrs+':'+mins+ m + '</span></p>');

        $('p:last').after($msg);
    }
    
    function gas(mileage){
        var $miles = $('#gallon').val(); 
        var gasinput = $('#gas').val();
        var temp = mileage/$miles; //miles it takes for distance 
        var price = temp * gasinput;
        return price.toFixed(2);
    }

     function calculateDistance(lat1, lon1, lat2, lon2) {
       var R = 3956; // Radius of the Earth in miles (6371 km = 3956 mi)
       var dLat = (lat2-lat1).toRad();
       var dLon = (lon2-lon1).toRad();
       var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
       Math.sin(dLon/2) * Math.sin(dLon/2);
       var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
       var d = R * c;
       return d;
       }
       Number.prototype.toRad = function() {
       return this * Math.PI / 180;
       }
});