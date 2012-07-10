(function($) {
	var url = window.location.origin, socket;
	socket = io.connect(url);

	$('#play').on('touchstart click', function(event){
		socket.emit('start', {});
		$('#information span').html('Starting Wave');
	});

	$('#reset').on('touchstart click', function(event){
		socket.emit('restart', {});
	});

	socket.on('stats', function(data){
		$('#information span').html('Total connected clients : ' + data.total);
	});
})(jQuery);