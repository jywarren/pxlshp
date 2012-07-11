$.ajaxSetup ({ cache: false }); 
var ajax_load = "<img src='/images/spinner-small.gif' alt='loading...' />";

$P = {
	pointer_x: 0,
	pointer_y: 0,
	x_offset: 0,
	initialize: function() {
		$P.element = $('#canvas')
		$P.element = $('#canvas')[0]
		$P.canvas = $P.element.getContext('2d');
		$C = $P.canvas
		$P.width = 256
		$P.height = 256
		$P.iconSize = 32
		$P.pixelSize = $P.width/$P.iconSize
		$P.element.width = $P.width+"px"
		$P.element.height = $P.height+"px"
		$P.element.width = $P.width
		$P.element.height = $P.height
		$('body').mouseup($P.on_mouseup)
		$('body').mousedown($P.on_mousedown)
		$('body').mousemove($P.on_mousemove)
		$P.element.addEventListener('touchend',$P.on_mouseup)
		$P.element.addEventListener('touchstart',$P.on_mousedown)
		$P.element.addEventListener('touchmove',$P.on_mousemove)
		setInterval($P.draw,1500)
	},
	on_mousedown: function(e) {
		e.preventDefault()
		$P.dragging = true
		$P.getPointer(e)
		if ($P.isBlack($P.pointer_x,$P.pointer_y)) {
			$C.fillStyle = "white"
		} else {
			$C.fillStyle = "black"
		}
		$P.drawPixel()
	},
	on_mouseup: function(e) {
		e.preventDefault()
		$P.dragging = false
	},
	on_mousemove: function(e) {
		if ($P.dragging) {
			$P.getPointer(e)
			$P.drawPixel()
		}
	},

	drawPixel: function() {
		x = parseInt($P.pointer_x/$P.width*$P.iconSize)
		y = parseInt($P.pointer_y/$P.height*$P.iconSize)
		$C.fillRect(x*$P.pixelSize,y*$P.pixelSize,$P.pixelSize,$P.pixelSize)
	},

	getPointer: function(e) {
		if (e.touches && (e.touches[0] || e.changedTouches[0])) {
			var touch = e.touches[0] || e.changedTouches[0];
			$P.pointer_x = touch.offsetX
			$P.pointer_y = touch.offsetY
		} else {
			$P.pointer_x = e.offsetX
			$P.pointer_y = e.offsetY
		}
	},
	isBlack: function(x,y) {
		px = $C.getImageData(x,y,1,1).data
		return px[0] == 0 && px[1] == 0 && px[2] == 0 && px[3] != 0
	},

	save: function() {
		$.ajax({
			url:"/icon/create",
			success: function(data) {
				$('#notice').html(data)
				setTimeout(function(){ $('#notice').html("") },1500)
			}, 
			failure: function(data) {
				$('#error').html("<p>There was an error</p>")
				setTimeout(function(){ $('#error').html("") },1500)
			} 
		})
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
