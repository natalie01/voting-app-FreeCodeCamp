$(document).ready(function(){
	$('.delete-poll').on('click', function(e){
	var $target = $(e.target);
	const id = $target.attr('data-id');
	console.log(id);
	$.ajax({
	type:'DELETE',
	url: '/polls/'+id,
	success: function(response){
	alert('Deleting Poll');
	window.location.href='/';
	},
	error: function(err){
	console.log(err);
	}
	});
	});
});
