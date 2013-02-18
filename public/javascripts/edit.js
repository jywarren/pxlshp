$.ajaxSetup ({ cache: false }); 
//var ajax_load = "<img src='/images/spinner-small.gif' alt='loading...' />";

$P = {
	pointer_x: 0,
	pointer_y: 0,
	v_offset: 60, // height of the canvas below top of page, used only for touch events

	/**
	 * Startup environment, accepts data_url or just URL of starting image
	**/
	initialize: function(args) {
		$P.element = $('#canvas')[0]
		$P.canvas = $P.element.getContext('2d');
		$C = $P.canvas
		if ($(window).width() < $(window).height()) $P.width = args['displaySize'] || $(window).width()-64 //256
		else $P.width = args['displaySize'] || ($(window).width()-30)/3
		$P.height = $P.width
		$P.element.width = $P.width
		$P.element.height = $P.width
		$P.iconSize = 16
		$P.pixelSize = $P.width/$P.iconSize
		$P.intPixelSize = Math.floor($P.width/$P.iconSize)
		$P.url = args['url'] || ''
		$P.grid = args['grid'] || true
		$P.pointerActive = false
		$('body').mouseup($P.on_mouseup)
		$('body').mousedown($P.on_mousedown)
		$('body').mousemove($P.on_mousemove)
		//$(window).bind('touchend',$P.on_mouseup)
		//$(window).bind('touchstart',$P.on_mousedown)
		//$(window).bind('touchmove',$P.on_mousemove)
		window.addEventListener('touchend',$P.on_mouseup)
		window.addEventListener('touchstart',$P.on_mousedown)
		window.addEventListener('touchmove',$P.on_mousemove)
		//setInterval($P.draw,1500)
		$C.fillStyle = "white"
		$C.fillRect(0,0,$P.width,$P.height)
		if (args['image_data'] != "") $P.displayIcon(args['image_data'])
		if (args['icon_id'] != "" || args['icon_id'] == 0) $P.icon_id = args['icon_id']
		if (args['type'] != "") $P.type = args['type']
		if (args['hash'] != "") {
			$P.hash = args['hash']
			$P.decodeIconString($P.hash)
			//$P.generatePermalink()
		}
		if ($P.grid) $P.drawGrid() 
	},
	on_mousedown: function(e) {
		$P.getPointer(e)
		if ($P.onCanvas) e.preventDefault()
		if (!$P.pointerActive) {
			$P.pointerActive = true
			$P.dragging = true
			if ($P.isBlack($P.pointer_x,$P.pointer_y)) {
				$C.fillStyle = "white"
			} else {
				$C.fillStyle = "black"
			}
			$P.drawPixel()
		}
	},
	on_mouseup: function(e) {
		$P.pointerActive = false
		//e.preventDefault()
		$P.dragging = false
		if ($P.grid) $P.drawGrid() 
		//$P.generatePermalink()
	},
	on_mousemove: function(e) {
		if ($P.dragging) {
			$P.getPointer(e)
			$P.drawPixel()
		}
	},

	/**
	 * Draws a pixel of black or white at the pointer location
	**/
	drawPixel: function() {
		x = parseInt($P.pointer_x/$P.width*$P.iconSize)
		y = parseInt($P.pointer_y/$P.height*$P.iconSize)
		if ($P.onCanvas) {
			$C.fillRect(x*$P.pixelSize,y*$P.pixelSize,$P.intPixelSize,$P.intPixelSize)
		}
	},

	/**
	 * Refetches the pointer position and stores it in $P.pointer_x, $P.pointer_y
	 * and handles touch events too.
	**/
	getPointer: function(e) {
		offsetX = ($(window).width()-$P.width)/2;
		offsetY = $P.v_offset;//($(window).height()-$P.height)/2;
		if (e.touches && (e.touches[0] || e.changedTouches[0])) {
			var touch = e.touches[0] || e.changedTouches[0];
			$P.pointer_x = touch.pageX - offsetX;
			$P.pointer_y = touch.pageY - offsetY;
			$P.onCanvas = (touch.pageX >= offsetX && touch.pageX < offsetX+$P.width && touch.pageY >= offsetY && touch.pageY < offsetY+$P.height)
		} else {

		// Firefox shim for offsetX/Y:
		// from https://bug69787.bugzilla.mozilla.org/attachment.cgi?id=248546, https://bugzilla.mozilla.org/show_bug.cgi?id=69787
		var x=0, y=0, fatalerror=0, mozilla=false;

		if (typeof e.offsetX != 'undefined' && typeof e.offsetY != 'undefined') {	// Browser provides the co-ords for us easily (zero-indexed)
			x = e.offsetX;
			y = e.offsetY;
		}
		else if (e.target) {		// If we have the 'target' of the (click) event - in this case, the image
			mozilla = true
			var elem = e.target;
			do {						// Calc x and y of 'target' element (ie. the image)
				x += elem.offsetLeft;
				y += elem.offsetTop;
			} while (elem = elem.offsetParent);
			x = (window.pageXOffset + e.clientX) - x;
			y = (window.pageYOffset + e.clientY) - y;
		}
		else {	// Fatal error trying to determine click co-ords!
			fatalerror = 1;
		}

// x and y are still zero-indexed...
		if (!fatalerror) {x++; y++;}



		$P.pointer_x = x
		$P.pointer_y = y
		$P.onCanvas = (e.pageX >= offsetX && e.pageX < offsetX+$P.width && e.pageY >= offsetY && e.pageY < offsetY+$P.height)
		}
	},
	isBlack: function(x,y) {
		px = $C.getImageData(x+2,y+2,1,1).data
		return px[0] == 0 && px[1] == 0 && px[2] == 0 && px[3] != 0
	},


	/**
	 * Draws a pixel grid 
	**/
	drawGrid: function(color) {
		color = color || "#cccccc"
		$C.strokeStyle = color
		$C.lineWidth = 1
		for (i=1;i<$P.iconSize;i++) {
			$C.beginPath()
			$C.moveTo(Math.floor(i*$P.pixelSize),0)
			$C.lineTo(Math.floor(i*$P.pixelSize),$P.height)
			$C.stroke()
		}
		for (i=1;i<$P.iconSize;i++) {
			$C.beginPath()
			$C.moveTo(0,Math.floor(i*$P.pixelSize))
			$C.lineTo($P.width,Math.floor(i*$P.pixelSize))
			$C.stroke()
		}
	},

	/**
	 * Given a data_url or URL (src), displays it, scaled up without aliasing
	**/
	displayIcon: function(src) {
		$P.displayImage = new Image()
		$P.displayImage.onload = function() {
			$('body').append("<canvas style='display:none;' id='displayCanvas'></canvas>")
			var element = $('#displayCanvas')[0]
			element.width = $P.iconSize
			element.height = $P.iconSize
			var displayCanvasContext = element.getContext('2d')
			displayCanvasContext.drawImage($P.displayImage,0,0,$P.iconSize,$P.iconSize)
			var img = displayCanvasContext.getImageData(0,0,$P.iconSize,$P.iconSize).data
			for (i=0;i<img.length/4;i+=1) {
				x = i-(Math.floor(i/$P.iconSize)*$P.iconSize)
				y = Math.floor(i/$P.iconSize)
				j = i*4
				$C.fillStyle = "rgba("+img[j]+","+img[j+1]+","+img[j+2]+","+img[j+3]+")"
				$C.fillRect(x*$P.pixelSize,y*$P.pixelSize,$P.pixelSize,$P.pixelSize)
			}
			//$P.generatePermalink()
			if ($P.grid) $P.drawGrid() 
		}
		$P.displayImage.src = src
	},

	/**
	 * Generates a b64 permalink and displays it; ended up impractical
	**/
	generatePermalink: function() {
		s = $P.encodeIconString()
		$('#permalink').html("/bw8/"+s)
		$('#permalink')[0].href = "/bw8/"+s
	},

	/**
	 * Converts the icon into a URL string for permalinks, default black & white or "bw"
	**/
	encodeIconString: function(type) {
		if (type == "gs") {
			//greyscale
		} else {
			binary = ""
			for (y=0;y<$P.iconSize;y++) {
				for (x=0;x<$P.iconSize;x++) {
					data = $C.getImageData(parseInt(x*$P.pixelSize+$P.pixelSize/2),parseInt(y*$P.pixelSize+$P.pixelSize/2),1,1).data
					if (data[0] > 128 || data[3] == 0) binary += "0"
					else binary += "1"
				}
			}
			return Base64.encode(parseInt(binary,2))
		}
	},

	decodeIconString: function(string,type) {
		string = Base64.decode(string)
		if (type == "gs") {
			//greyscale
		} else {
			binary = parseInt(string).toString(2)
			for (p = 0;p < binary.length;p++) {
				y = Math.floor(p/$P.iconSize)
				x = p-(y*$P.iconSize)
				if (binary[p] == 1) $C.fillStyle = "black"
				else $C.fillStyle = "white"
				$C.fillRect(x*$P.pixelSize,y*$P.pixelSize,$P.intPixelSize,$P.intPixelSize)
			}
		}
	},

	/**
	 * Duh
	**/
	save: function(anew) {
		if ($P.icon_id == 0) url = $P.url+"/create"
		else url = $P.url+"/save/"+$P.icon_id
		$P.getScaledIcon(function() {
			$.ajax({
				url:url,
				type: "POST",
				data: { image_data: $P.scaled_icon },
				success: function(data) {
					$('#save').button('reset');
					$('#save-anew').button('reset');
					if (data == "Saved!") {
						setTimeout(function(){ $('#alerts').html("") },1500)
						if (anew) window.location = $P.url+"/new"
					} else {
						window.location = $P.url+"/icon/"+data
					}
				}, 
				failure: function(data) {
					$P.alert("There was an error.","error",true)
				} 
			})
		})
	},

	/**
	 * Returns a dataURL string of the canvas, resized to $P.iconSize x $P.iconSize
	 */
	getScaledIcon: function(callback) {
		$('body').append("<canvas style='display:none;' id='excerptCanvas'></canvas>")
		var element = $('#excerptCanvas')[0]
		element.width = $P.iconSize
		element.height = $P.iconSize
		var excerptCanvasContext = element.getContext('2d')
		for (var x=0;x<$P.iconSize;x++) {
			for (var y=0;y<$P.iconSize;y++) {
			var sourcedata = $C.getImageData(x*$P.pixelSize+parseInt($P.pixelSize/2),y*$P.pixelSize+parseInt($P.pixelSize/2),1,1)
			excerptCanvasContext.putImageData(sourcedata,x,y)
			}
		}
		$P.scaled_icon = excerptCanvasContext.canvas.toDataURL()
		callback()
	},

	/**
	 * Displays a Bootstrap-style alert of type "type" ("success", "error", "info")
	 * and fades after 1.5 seconds if "fade" is true
	 */
	alert: function(msg,type,fade) {
		if (type) type = " alert-"+type
		$('#alerts').append("<div class='alert"+type+"'>"+msg+' <button type="button" class="close" data-dismiss="alert">×</button></div>')
		if (fade) setTimeout(function(){ $('#alerts').html("") },1500)
},

	/**
	 * Returns a dataURL string of any rect from the offered canvas
	 */
	excerptCanvas: function(x1,y1,x2,y2,source) {
		source = source || $C
		var width = x2-x1, height = y2-y1
		$('body').append("<canvas style='display:none;' id='excerptCanvas'></canvas>")
		var element = $('#excerptCanvas')[0]
		element.width = width
		element.height = height
		var excerptCanvasContext = element.getContext('2d')
		var sourcedata = source.getImageData(x1,y1,width,height)
		excerptCanvasContext.putImageData(sourcedata,0,0)
		return excerptCanvasContext.canvas.toDataURL()
	}

}
