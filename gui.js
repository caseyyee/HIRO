var GUI = {}

GUI.Layout = function ( dom, camera ) {

	THREE.Group.call( this );

	var scope = this;

	var changeEvent = { type: 'change' };
	var clickEvent = { type: 'click' };
	var mouseMoveEvent = { type: 'mousemove' };
	var mouseOverEvent = { type: 'mouseover' };
	var mouseOutEvent = { type: 'mouseout' };
	var mouseDownEvent = { type: 'mousedown' };

	var mouse = new THREE.Vector2();
	var vector = new THREE.Vector3( 0, 0, 1 );
	
	var objectMouseOver = null;

	var raycaster = new THREE.Raycaster();

	var onMouseMove = function ( event ) {

		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		var object = raycast( mouseMoveEvent );
		
		if ( object !== objectMouseOver ) {

			if ( objectMouseOver !== null ) {

				objectMouseOver.dispatchEvent( mouseOutEvent );

			}

			if ( object !== null ) {

				object.dispatchEvent( mouseOverEvent );

			}

			objectMouseOver = object;

		}

	};

	dom.addEventListener( 'mousemove', onMouseMove, false );

	var onMouseDown = function ( event ) {
	
		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycast( mouseDownEvent );

	};
	
	dom.addEventListener( 'mousedown', onMouseDown, false );

	var onClick = function ( event ) {

		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycast( clickEvent );

	};

	dom.addEventListener( 'click', onClick, false );

	var raycast = function ( event ) {

		vector.set( mouse.x, mouse.y, 1 ).unproject( camera );

		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( scope.children );
		var object = null;

		if ( intersects.length > 0 ) {

			object = intersects[ 0 ].object;
			object.dispatchEvent( event );

		}

		scope.dispatchEvent( changeEvent );

		return object;

	};

};

GUI.Layout.prototype = Object.create( THREE.Group.prototype );

THREE.EventDispatcher.prototype.apply( GUI.Layout.prototype );

// Element

GUI.Element = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

};

GUI.Element.prototype = Object.create( THREE.Mesh.prototype );

THREE.EventDispatcher.prototype.apply( GUI.Element.prototype );

// BitmapButton

GUI.BitmapButton = function ( texture ) {

	var geometry = new THREE.PlaneBufferGeometry( 40, 30 );
	var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

	THREE.Mesh.call( this, geometry, material );
	
	texture.offset.y = 2 / 3;
	texture.repeat.y = 1 / 3;
	
	this.addEventListener( 'mouseover', function ( event ) {
	
		texture.offset.y = 1 / 3;
	
	} );
	this.addEventListener( 'mouseout', function ( event ) {

		texture.offset.y = 2 / 3;
	
	} );
	this.addEventListener( 'mousedown', function ( event ) {

		texture.offset.y = 0;

	} );

};

GUI.BitmapButton.prototype = Object.create( THREE.Mesh.prototype );

THREE.EventDispatcher.prototype.apply( GUI.BitmapButton.prototype );

