'use strict';

function VRHud() {
	
	
	//var group = new THREE.Group();

	// this.initLayout();

	// this.started = false;
	
	// // create a home grid which everything can be bolted to.
	// this.ui = new VRGridUi();
	// container.appendChild(this.ui.el);
	// var layout = new VRGrid({ width: 50, height: 10, cols: 10, rows: 2, radius: -30 });
	// this.ui.makeLayout(layout, favorites);
	// if (this.visible) {
	// 	this.ui.animate();
	// }
};

VRHud.prototype.initLayout = function(dom, camera, favorites) {
	var layout = new GUI.Layout( dom, camera );
	var geometry = new THREE.PlaneGeometry( 1, 1 );
	var texture = null;
	
	var loadTexture = new Promise( function(resolve, reject) {
		texture = THREE.ImageUtils.loadTexture('../data/ui/index.png', undefined, function() {
			resolve();
		});
	});

	function createMeshes() {
		var i, fav;
		
		for (i = 0; i < favorites.length; i++) {
			fav = favorites[i];
			
			//var material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, wireframe: true } );
			var tex = texture.clone();
			
			tex.repeat.x = fav.ui.width / tex.image.width;
			tex.repeat.y = fav.ui.height / tex.image.height;
			tex.offset.x = (fav.ui.x / tex.image.width);
			tex.offset.y = (fav.ui.y / tex.image.height);
			
			tex.needsUpdate = true;
			var material = new THREE.MeshBasicMaterial({ map : tex });
			
			// var x = rect.left + ( rect.width / 2 ) - offset.x;
			// var y = rect.top + ( rect.height / 2 ) - offset.y;

			console.log(fav.ui);
			var x = fav.ui.x;
			var y = fav.ui.y;
			
			var button = new GUI.Element( geometry, material );
			button.position.set( x, - y, 0 );
			button.scale.set( fav.ui.height, fav.ui.height, 1 );
			button.userData.position = new THREE.Vector2( x, y );

			layout.add(button);
		}
	}

	function bend( group, amount ) {
		var vector = new THREE.Vector3();

		for ( var i = 0; i < group.children.length; i ++ ) {
			var element = group.children[ i ];
			element.position.x = Math.sin( element.userData.position.x / amount ) * amount;
			element.position.z = - Math.cos( element.userData.position.x / amount ) * amount;
			element.lookAt( vector.set( 0, element.position.y, 0 ) );
		}
	}

	// main
	loadTexture.then(function() {
		createMeshes()
		bend( layout, 500 );
	});
			

	return layout;
}

VRHud.Layout = function() {
	THREE.Group.call(this);
}

VRHud.Layout.prototype = Object.create( THREE.Group.prototype );







// 	// three
	
// 	var texture = THREE.ImageUtils.loadTexture( "../data/index.png" );
// 	var material = new THREE.MeshBasicMaterial( { map: texture } );

// 	var geometry = new THREE.PlaneGeometry( 1, 1 );

	
// 	//var x = rect.left + ( rect.width / 2 ) - offset.x;
// 	//var y = rect.top + ( rect.height / 2 ) - offset.y;

// 	var button = new THREE.Mesh( geometry, material );

// 	button.position.set(x, y, 0);
// 	button.scale.set(10, 3);
// 	//button.userData.position = new THREE.Vector2( x, y );

// }

// VRHud.prototype.start = function() {
// 	console.log('VRHud.start')
// 	if (!this.started) {
//   	this.started = true;
//   	this.ui.show();
//   }
// };

// VRHud.prototype.stop = function() {
// 	console.log('VRHud.stop')
// 	if (this.started) {
// 		this.started = false;
// 		this.ui.hide();
// 	}
// };

// VRHud.prototype.toggle = function() {
//   if (this.started) {
//     this.stop();
//   } else {
//     this.start();
//   }
// };


// // UI
// // requires three js
// function VRGridUi() {
// 	this.visible = false;

// 	// three.js setup
//   var renderer = new THREE.WebGLRenderer( { alpha: true } );
//   renderer.setClearColor( 0x000000, 0 );
//   this.scene = new THREE.Scene();
//   this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
//   this.controls = new THREE.VRControls( this.camera );
//   this.effect = new THREE.VREffect( renderer );
//   this.effect.setSize( window.innerWidth, window.innerHeight );
//   this.el = renderer.domElement;

// 	return this;
// };

// VRGridUi.prototype.makeLayout = function(layout, favorites) {
// 	if (!favorites || !layout) {
// 		console.error("give me a layout and favorites to work with!");
// 		return false;
// 	}

// 	var i, fav, pos, dim;
// 	var geometry, material, mesh;

// 	for (i = 0; i < favorites.length; i++) {
// 		fav = favorites[i];
// 		pos = layout.getPosition(fav.position);
// 		dim = layout.getDimension(fav.dimensions);
		
// 		geometry = new THREE.PlaneGeometry( dim.width, dim.height );
// 		material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
//     mesh = new THREE.Mesh( geometry, material );
//     mesh.position.x = pos.x;
//     mesh.position.y = pos.y;
//     mesh.position.z = pos.z;
//     this.scene.add(mesh);
// 	}
// };

// VRGridUi.prototype.animate = function() {
// 	this.effect.render( this.scene, this.camera );
// 	this.controls.update();

// 	if (this.visible) {
// 		requestAnimationFrame(this.animate.bind(this));
// 	};
// };

// VRGridUi.prototype.show = function() {
// 	this.scene.visible = true;
// 	this.visible = true;
// 	this.animate();
// };

// VRGridUi.prototype.hide = function() {
// 	this.scene.visible = false;
// 	this.visible = false;
// };





// // Grid layout
// function VRGrid(opts) {
// 	this.opts = opts;
// };

// // get grid position and return scene position
// VRGrid.prototype.getPosition = function(position) {
// 	return {
// 		x: position.x * (this.opts.width / this.opts.cols),
// 		y: position.y * (this.opts.height / this.opts.rows) * -1,
// 		z: this.opts.radius
// 	}
// };

// VRGrid.prototype.getDimension = function(dimensions) {
// 	return {
// 		width: dimensions.width * (this.opts.width / this.opts.cols) * 0.98,
// 		height: dimensions.height * (this.opts.height / this.opts.rows)* 0.98,
// 	}
// };
