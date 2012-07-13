$.ajaxSetup ({ cache: false }); 
var ajax_load = "<img src='/images/spinner-small.gif' alt='loading...' />";

$P = {
	pointer_x: 0,
	pointer_y: 0,
	v_offset: 60, // height of the canvas below top of page, used only for touch events

	/**
	 * Startup environment, accepts data_url or just URL of starting image
	**/
	initialize: function(args) {
		$P.element = $('#canvas')
		$P.element = $('#canvas')[0]
		$P.canvas = $P.element.getContext('2d');
		$C = $P.canvas
		if ($(window).width() < $(window).height()) $P.width = args['displaySize'] || $(window).width()-30 //256
		else $P.width = args['displaySize'] || ($(window).width()-30)/3
		$P.height = $P.width
		$P.element.width = $P.width
		$P.element.height = $P.width
		$P.iconSize = 8//16
		$P.pixelSize = $P.width/$P.iconSize
		$P.intPixelSize = Math.floor($P.width/$P.iconSize)
		$P.grid = args['grid'] || true
		$('body').mouseup($P.on_mouseup)
		$('body').mousedown($P.on_mousedown)
		$('body').mousemove($P.on_mousemove)
		window.addEventListener('touchend',$P.on_mouseup)
		window.addEventListener('touchstart',$P.on_mousedown)
		window.addEventListener('touchmove',$P.on_mousemove)
		//setInterval($P.draw,1500)
		if (args['image_data'] != "") $P.displayIcon(args['image_data'])
		if ($P.grid) $P.drawGrid() 
		$P.generatePermalink()
	},
	on_mousedown: function(e) {
		e.preventDefault()
		$P.dragging = true
		$P.getPointer(e)
		if ($P.isBlack($P.pointer_x,$P.pointer_y)) {
			$P.clear = true
		} else {
			$C.fillStyle = "black"
		}
		$P.drawPixel()
	},
	on_mouseup: function(e) {
		e.preventDefault()
		$P.dragging = false
		$P.clear = false
		if ($P.grid) $P.drawGrid() 
		$P.generatePermalink()
	},
	on_mousemove: function(e) {
		if ($P.dragging) {
			$P.getPointer(e)
			$P.drawPixel()
		}
	},

	/**
	 * Draws a pixel of black or clear at the pointer location
	**/
	drawPixel: function() {
		x = parseInt($P.pointer_x/$P.width*$P.iconSize)
		y = parseInt($P.pointer_y/$P.height*$P.iconSize)
		if (x >= 0 && x < $P.iconSize && y >= 0 && y < $P.iconSize) {
			if ($P.clear) $C.clearRect(x*$P.pixelSize,y*$P.pixelSize,$P.intPixelSize,$P.intPixelSize)
			else $C.fillRect(x*$P.pixelSize,y*$P.pixelSize,$P.intPixelSize,$P.intPixelSize)
		}
	},

	/**
	 * Refetches the pointer position and stores it in $P.pointer_x, $P.pointer_y
	 * and handles touch events too.
	**/
	getPointer: function(e) {
		if (e.touches && (e.touches[0] || e.changedTouches[0])) {
			var touch = e.touches[0] || e.changedTouches[0];
			offsetX = ($(window).width()-$P.width)/2;
			offsetY = $P.v_offset;//($(window).height()-$P.height)/2;
			$P.pointer_x = touch.pageX - offsetX;
			$P.pointer_y = touch.pageY - offsetY;
		} else {
			$P.pointer_x = e.offsetX
			$P.pointer_y = e.offsetY
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
		$C.setStrokeColor(color)
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
			$('body').append("<canvas style='' id='displayCanvas'></canvas>")
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
			if ($P.grid) $P.drawGrid() 
		}
		$P.displayImage.src = src
	},

	/**
	 * Generates a b64 permalink and displays it
	**/
	generatePermalink: function() {
		s = $P.encodeIconString()
		console.log(s)
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
			pixelNum = 0
			for (x=0;x<$P.iconSize;x++) {
				for (y=0;y<$P.iconSize;y++) {
					data = $C.getImageData(x*$P.intPixelSize+2,y*$P.intPixelSize+2,1,1).data
					if (data[0] > 128 || data[3] == 0) pixelNum += Math.pow(2,(x+y*$P.iconSize))
				}
			}
			return Base64.encode(pixelNum)
		}
	},

	/**
	 * Duh
	**/
	save: function() {
		$('#notice').html("<p>Sending...</p>")
		$P.getScaledIcon(function() {
			$.ajax({
				url:"/save/"+$P.icon_id,
				type: "POST",
				data: { image_data: $P.scaled_icon },
				success: function(data) {
					$('#notice').html("<p>"+data+"</p>")
					setTimeout(function(){ $('#notice').html("") },1500)
				}, 
				failure: function(data) {
					$('#error').html("<p>There was an error</p>")
					setTimeout(function(){ $('#error').html("") },1500)
				} 
			})
		})
	},

	/**
	 * Returns a dataURL string of any rect from the offered canvas, resized to given h,w
	 */
	getScaledIcon: function(callback) {
		$P.on_scaled_icon = callback
		$P.scaled_image = new Image()
		$P.scaled_image.onload = function() {
			$('body').append("<canvas style='' id='excerptCanvas'></canvas>")
			var element = $('#excerptCanvas')[0]
			element.width = $P.iconSize
			element.height = $P.iconSize
			var excerptCanvasContext = element.getContext('2d')
			excerptCanvasContext.drawImage($P.scaled_image,0,0,$P.iconSize,$P.iconSize)
			$P.scaled_icon = excerptCanvasContext.canvas.toDataURL()
			$P.on_scaled_icon()
		}
		$P.scaled_image.src = $P.excerptCanvas(0,0,$P.width,$P.height)
	},
	/**
	 * Returns a dataURL string of any rect from the offered canvas
	 */
	excerptCanvas: function(x1,y1,x2,y2,source) {
		source = source || $C
		var width = x2-x1, height = y2-y1
		$('body').append("<canvas style='' id='excerptCanvas'></canvas>")
		var element = $('#excerptCanvas')[0]
		element.width = width
		element.height = height
		var excerptCanvasContext = element.getContext('2d')
		var sourcedata = source.getImageData(x1,y1,width,height)
		excerptCanvasContext.putImageData(sourcedata,0,0)
		return excerptCanvasContext.canvas.toDataURL()
	}

}
