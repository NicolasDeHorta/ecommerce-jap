//NavBar modular asi no hay que cambiarlo en todas las paginas cuando hacemos una modificacion
//prepend lo agrega como 1st child del body
$("body").prepend(`<nav class="site-header py-1 bg-dark">
<div class="container d-flex flex-column flex-md-row justify-content-between">
  <a class="py-2 d-md-inline-block" href="home.html">Inicio</a>
  <a class="py-2 d-md-inline-block" href="categories.html">Categorías</a>
  <a class="py-2 d-md-inline-block" href="products.html">Productos</a>
  <a class="py-2 d-md-inline-block" href="sell.html">Vender</a>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span id="navbar-user">Dropdown button</span>
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item"  href="my-profile.html">My profile</a>
      <a class="dropdown-item" href="cart.html">Mi carrito</a>
      <a class="dropdown-item" id="logout" href="index.html">Log Out</a>
    </div>
</div>
</nav>`)

//Agregamos animaciones de SlideUp y SlideDown al elemento del usuario en el NavBar
 $('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown("fast");
  });

  $('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp("fast");
  });