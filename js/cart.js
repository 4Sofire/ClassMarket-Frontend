let app = new Vue({
  el: '#app',
  data: {
    cart: JSON.parse(sessionStorage.getItem("cart")) || [],
    orderDetails: {
      firstName: '',
      lastName: '',
      phone: '',
    },
    errorMessage: ''
  },
  methods:{
    goToCart(){},

    increaseQuantity(cartItem){
      // Check if we've reached the maximum available spaces
      if(cartItem.quantity >= cartItem.availableSpaces) {
        alert("No more available spaces for " + cartItem.name);
        return;
      }
      
      cartItem.quantity += 1;
      sessionStorage.setItem("cart", JSON.stringify(this.cart));  
    },
    decreaseQuantity(cartItem){
      if(cartItem.quantity > 1){
        cartItem.quantity -= 1;
        sessionStorage.setItem("cart", JSON.stringify(this.cart));  
      }
    },
    removeFromCart(cartItem, index){
      this.cart.splice(index, 1);
      sessionStorage.setItem("cart", JSON.stringify(this.cart));  
    },

    checkout(){
      this.errorMessage = '';

      if(this.cart.length === 0){
        this.errorMessage = 'Your cart is empty. Please add items before checking out.';
        return;
      }

      if(!this.orderDetails.firstName || !this.orderDetails.firstName.trim()){
        this.errorMessage = 'Please enter your first name.';
        return;
      }

      if(!this.orderDetails.lastName || !this.orderDetails.lastName.trim()){
        this.errorMessage = 'Please enter your last name.';
        return;
      }

      if(!this.orderDetails.phone || !this.orderDetails.phone.trim()){
        this.errorMessage = 'Please enter your phone number.';
        return;
      }

      const phonePattern = /^\d{10}$/;
      if(!phonePattern.test(this.orderDetails.phone.replace(/\D/g, ''))){
        this.errorMessage = 'Please enter a valid 10-digit phone number.';
        return;
      }

      // Format order details to match backend expectations
      const orderDetailsArray = this.cart.map(item => ({
        course: item.name,
        space: item.quantity
      }));

      // Create form data matching backend structure
      const formData = new URLSearchParams();
      formData.append('firstName', this.orderDetails.firstName.trim());
      formData.append('lastName', this.orderDetails.lastName.trim());
      formData.append('phone', this.orderDetails.phone.trim());
      formData.append('orderDetails', JSON.stringify(orderDetailsArray));

      fetch('https://classmarket-backend.onrender.com/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
      .then(response => {
        if(!response.ok){
          return response.json().then(err => {
            throw new Error(err.error || 'Order submission failed. Please try again.');
          });
        }
        return response.json();
      })
      .then(data => {
        alert('Order placed successfully!');
        
        this.cart = [];
        sessionStorage.removeItem('cart');
        
        this.orderDetails.firstName = '';
        this.orderDetails.lastName = '';
        this.orderDetails.phone = '';
      })
      .catch(error => {
        console.error('Error:', error);
        this.errorMessage = error.message || 'There was an error processing your order. Please try again.';
      });
    }
  },
  computed: {
    itemTotal(item){
      return item.price * item.quantity;
    }
  }

})
