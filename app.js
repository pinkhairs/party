var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const url = require('url')
const SpotifyWebApi = require('spotify-web-api-node')
const getColors = require('get-image-colors')
const { Hue, Bridge } = require('hue');
const bodyParser = require('body-parser');
var converter = require('@q42philips/hue-color-converter');
var currentSong = ''
 
const v3 = require('node-hue-api').v3;
const LightState = v3.lightStates.LightState;

const USERNAME = '%HUE_API_USERNAME%'
  // The name of the light we wish to retrieve by name
  , LIGHT1 = 1, LIGHT2 = 2, LIGHT3 = 3
;

var client_id = '%SPOTIFY_CLIENT_ID%'; // Your client id
var client_secret = '%SPOTIFY_CLIENT_SECRET%'; // Your secret
var redirect_uri = 'http://localhost:8889/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = "user-read-currently-playing user-read-playback-state streaming user-read-private user-read-email";
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
    res.end()
});

app.get('/callback', function(req, res) {
var credentials = {
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
};

const { Bridge } = require('hue');

var HUE_BRIDGE
var HUE_USER = ''

var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI
var code = req.query.code;

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(code).then(
  (data) => {
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    
    setInterval(() => {

// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi.refreshAccessToken().then(
  function(data) {

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    
    

        // Get Information About The User's Current Playback State
        spotifyApi.getMyCurrentPlaybackState()
          .then((data) => {
            // Output items
            if (data.body && data.body.is_playing) {
              
              
              
              
              
              
              
              
              
              
            } else {
              console.log("User is not playing anything, or doing so in private.");
            }
          }, function(err) {
            console.log('Something went wrong!', err);
            
          });
  },
  function(err) {
    console.log('Could not refresh access token', err);
  }
);







    }, 3000)
    
    setInterval(((function() {
        
        
              
              // Get the User's Currently Playing Track 
spotifyApi.getMyCurrentPlayingTrack()
  .then(function(data) {

    if (data.body.item.name !== currentSong) {
        currentSong = data.body.item.name
    } else {
    return
    }
    console.log(data.body.item.name)
    
    var img = data.body.item.album.images[0].url
    
getColors(img, { count: 3 }).then(colors => {
var color1 = colors[0].rgb()
var color2 = colors[1].rgb()
var color3 = colors[2].rgb()

rgb_to_cie = function(red, green, blue)
{
	//Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
	var red 	= (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
	var green 	= (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
	var blue 	= (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92); 

	//RGB values to XYZ using the Wide RGB D65 conversion formula
	var X 		= red * 0.664511 + green * 0.154324 + blue * 0.162028;
	var Y 		= red * 0.283881 + green * 0.668433 + blue * 0.047685;
	var Z 		= red * 0.000088 + green * 0.072310 + blue * 0.986039;

	//Calculate the xy values from the XYZ values
	var x 		= (X / (X + Y + Z)).toFixed(4);
	var y 		= (Y / (X + Y + Z)).toFixed(4);

	if (isNaN(x))
		x = 0;

	if (isNaN(y))
		y = 0;	 


	return [x, y];
}

var color1cie = rgb_to_cie(color1[0], color1[1], color1[2])
var color2cie = rgb_to_cie(color2[0], color2[1], color2[2])
var color3cie = rgb_to_cie(color3[0], color3[1], color3[2])


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
  console.log({color1:color1cie[0], color2:color1cie[1]})
    // Using a LightState object to build the desired state
    const state1 = new LightState()
      .on()
      .xy(color1cie)
      .saturation(100)
    const state2 = new LightState()
      .on()
      .xy(color2cie)
      .saturation(100)
    const state3 = new LightState()
      .on()
      .xy(color3cie)
      .saturation(100)
    
    api.lights.setLightState(1, state1);
    api.lights.setLightState(2, state2);
    api.lights.setLightState(3, state3);
  })
   
   
   
   
   
   
   

})

    
    
    
    
  }, function(err) {
    console.log('Something went wrong!', err);
  });
    
    })), 500)

  },
  function(err) {
    console.log({err})
  }
);
res.end()
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8889');
app.listen(8889);
