let app = new Vue({
  el: '#app',
  data: {
    cart: JSON.parse(sessionStorage.getItem("cart")) || [],
    orderDetails: {
      firstName: '',  // Fixed from firstNmae
      lastName: '',   // Fixed from lastNmae
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
    // Add this method to your methods object in cart.js

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

      let totalPrice = 0;
      this.cart.forEach(item => {
        totalPrice += item.price * item.quantity;
      });

      const orderData = {
        customer: {
          firstName: this.orderDetails.firstName.trim(),
          lastName: this.orderDetails.lastName.trim(),
          phone: this.orderDetails.phone.trim()
        },
        order: this.cart.map(item => ({
          courseId: item.id,
          courseName: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        totalPrice: totalPrice,
        orderDate: new Date().toISOString()
      };

      fetch('https://after-mdx-backend.onrender.com/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      .then(response => {
        if(!response.ok){
          throw new Error('Order submission failed. Please try again.');
        }
        return response.json();
      })
      .then(data => {
        alert('Order placed successfully! Order ID: ' + (data.orderId || 'N/A'));
        
        this.cart = [];
        sessionStorage.removeItem('cart');
        
        this.orderDetails.firstName = '';
        this.orderDetails.lastName = '';
        this.orderDetails.phone = '';
      })
      .catch(error => {
        console.error('Error:', error);
        this.errorMessage = 'There was an error processing your order. Please try again.';
      });
    }
  },
  computed: {
    itemTotal(item){
      return item.price * item.quantity;
    }
  }
})