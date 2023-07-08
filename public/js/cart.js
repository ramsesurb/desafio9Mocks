const addToCartButtons = document.querySelectorAll('.addCart');

addToCartButtons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();

    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;;

    fetch(`/api/cart/${cartId}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // Puedes enviar información adicional del producto aquí si es necesario
    })
    .then(response => response.json())
    .then(data => {
      // Aquí puedes manejar la respuesta del servidor después de agregar el producto al carrito
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  });
});