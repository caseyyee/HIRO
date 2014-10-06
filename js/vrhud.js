'use strict';

function VRHud() {
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



