'use strict';

function VRUi(container) {
	var self = this;
	this.container = container;
	this.active = false;
	this.settings = null;
	this.hud = new VRHud();
	this.scene = this.camera = this.controls = this.renderer = this.effect = null;
	
	// main
	this.initSettings();
	this.initRenderer();

		
		
	self.start();
	



	return this;
};

VRUi.prototype.initSettings = function() {
	var self = this;

	function getJson(url) {
		return new Promise( function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			
			xhr.onload = function() {
				resolve(JSON.parse(xhr.response));
			}
			
			xhr.onerror = function() {
				reject(new Error('Some kind of network error, XHR failed.'))
			}

			xhr.open('GET', url);
			xhr.send();
		});
	}

	// combine settings exported from UI templates and match them up with the corresponding favorites.
	function parseSettings(values) {
		var user = values[0];
		var ui = values[1];

		// hash function
		var djb2Code = function(str){
	    var i, char, hash = 5381;
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
	    }
	    return hash;
		}

		// map ui to user favorites
		user.favorites = user.favorites.map(function(fav) {
			fav.id = djb2Code(fav.url);
			for (var i = 0; i < ui.length; i++) {
				if (ui[i].id == fav.id) {
					fav.ui = ui[i];
					break;
				}
			}
			return fav;
		});

		return user;
	}

	// main
	var userSettingsP = getJson('./data/settings.json');
	var uiSettingsP = getJson('./data/ui/index.json');

	Promise.all([userSettingsP, uiSettingsP]).then(function(values) {
		self.settings = parseSettings(values);

		//self.scene.add( self.hud.initLayout(this.renderer.domElement, this.scene) );
		
		self.scene.add( self.hud.initLayout(self.renderer.domElement, self.scene, self.settings.favorites) );
		console.log(self.scene.children);
	});
}


VRUi.prototype.initRenderer = function() {
	this.renderer = new THREE.WebGLRenderer( { alpha: true } );
  this.renderer.setClearColor( 0x000000, 0 );
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  this.controls = new THREE.VRControls( this.camera );
  this.effect = new THREE.VREffect( this.renderer );
  this.effect.setSize( window.innerWidth, window.innerHeight );
  this.container.appendChild(this.renderer.domElement);
}

VRUi.prototype.start = function() {

	this.active = true;
	this.animate();
}

VRUi.prototype.stop = function() {
	this.active = false;
}

VRUi.prototype.animate = function() {
	if (!this.active) {
		return false;
	}
	this.effect.render( this.scene, this.camera );
	this.controls.update();

	requestAnimationFrame(this.animate.bind(this));
}

