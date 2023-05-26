/*custom js*/
$(document).ready(function() {
	$(".help-tip > div .glyphicon.glyphicon-remove").click(function(){
		$("#help-container").css('display', 'none');
	});
	$(".main-menu-item i.material-icons.small").click(function(){
		$(".main-menu-item").toggleClass("d-none");
	});
	$(".btn.btn-outline-secondary.menu-ico").click(function(){
		$(".main-menu-item").toggleClass("d-none");
	});
	$(".main-menu-item .has-submenu").click(function(){
		$(".main-menu-item .sub-menu.elementor-nav-menu--dropdown").toggleClass("d-none");
		$(".main-menu-item .has-submenu .glyphicon").toggleClass("glyphicon-menu-down");
		$(".main-menu-item .has-submenu .glyphicon").toggleClass("glyphicon-menu-up");
	});
});