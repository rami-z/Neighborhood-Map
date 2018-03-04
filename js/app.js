/* model*/
var favoritePlacesModel = [{
        title: 'Al-Balad, Jeddah',
        location: { lat: 21.483333, lng: 39.183333 },
        id: "50154238e4b0bc7cf5d5fdeb"
    },
    {
        title: 'Red Sea Mall',
        location: { lat: 21.6262366, lng: 39.1094803 },
        id: "4b81e997f964a520c3c330e3",
    },
    {
        title: 'Al-Shallal Theme Park',
        location: { lat: 21.567907, lng: 39.111038 },
        id: "4d7a78a2777bb1f7d3f8575b"
    },
    {
        title: 'King Abdulaziz International Airport',
        location: { lat: 21.668596, lng: 39.170723 },
        id: "4c0b37c332daef3b62cb4b50"
    },
    {
        title: 'Mall of Arabia (Jeddah)',
        location: { lat: 21.6321963, lng: 39.1545982 },
        id: "583c047b0acb6a4bcb280b20"
    }
];
var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 21.598665732072703, lng: 39.18208725297859 },
        zoom: 10
    });
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // Style the markers a bit. This will be our listing marker icon.
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    // Create a "highlighted location" marker color for when the user
    var defaultIcon = makeMarkerIcon('0091ff');
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    markerEvent = function(marker) {
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(marker, largeInfowindow);
            marker.setIcon(highlightedIcon);
            setTimeout((function() {
                marker.setIcon(defaultIcon);
            }).bind(marker), 1400)
        });
    };
    for (var i = 0; i < favoritePlacesModel.length; i++) {
        // Get the position from the location array.
        var position = favoritePlacesModel[i].location;
        var title = favoritePlacesModel[i].title;
        var id = favoritePlacesModel[i].id;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: id
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        markerEvent(marker);

        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

    // ViewModel
    function ViewModel() {
        // filter function for marker in google map and List
        var self = this;
        this.searchOption = ko.observable("");
        this.myLocationsFilter = ko.computed(function() {
            var result = [];
            for (var i = 0; i < markers.length; i++) {
                var markerLocation = markers[i];
                if (markerLocation.title.toLowerCase().includes(this.searchOption()
                        .toLowerCase())) {
                    result.push(markerLocation);
                    markers[i].setVisible(true);
                } else {
                    markers[i].setVisible(false);
                }
            }
            return result;
        }, this);
        // when the user click the list, lageInfowWindows will open
        // and Icon highlighted
        this.populateAndBounceMarker = function() {
            populateInfoWindow(this, largeInfowindow);
            this.setIcon(highlightedIcon);
            setTimeout((function() {
                this.setIcon(defaultIcon);
            }).bind(this), 1400);

        }
    }

    ko.applyBindings(new ViewModel());
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        // infowindow.setContent('<div>' + marker.title + '</div>'+'</br>'+'<a href="https://en.wikipedia.org/wiki/'+marker.title+'">click to get more information</a>');
        // foursquare api requst
        var xhttp = new XMLHttpRequest(); // request data from a server
        xhttp.open("GET", "https://api.foursquare.com/v2/venues/" + marker.id + "?&client_id=CT423AFTHJYWX5ZAN4U0PTE0FJOSLJH0YXDNOSCKNJHM31ZW&client_secret=1Q0FBMCSMXUMCUBSOKA1US4ONXMVDLN4ATTXKG2YQ0YV1A1P&v=20180609", true);
        xhttp.onerror = function() {
            alert("Obs, API not working. please refresh the page");
        };
        xhttp.send();

        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                var obj = JSON.parse(this.responseText); // store the response from foursquare
                var rating = obj.response.venue.rating ? obj.response.venue.rating : "rating unavailable";
                infowindow.c
                infowindow.marker = marker;
                infowindow.setContent('<div id="iw-container">' +
                    '<div class="iw-title">' + obj.response.venue.name + '</div>' +
                    '<div class="iw-content">' +
                    '<div class="iw-subTitle">' + "Tips" + '</div>' +
                    '<img src="' + obj.response.venue.bestPhoto.prefix + '200x200' + obj.response.venue.bestPhoto.suffix + '" alt="Best Photo" height="115" width="83">' +
                    '<p>' + obj.response.venue.tips.groups[0].items[0].text + '</p>' +
                    '<div class="iw-subTitle">Categorie</div>' +
                    '<p>' + obj.response.venue.categories[0].name + '</p>' +
                    '</div>' +
                    '<div class="iw-bottom-gradient">' + 'power by foursquare' + '</div>' +
                    '</div>');
                infowindow.open(map, marker);


            } else if (this.status != 200) {
                alert("Unexpected end of JSON");
            }
            infowindow.open(map, marker);
        }
    }
}

// function to Handel Google map error if connection fail.
function errorHandling() {
    alert("Google map can't load. please check Internet connection");
}