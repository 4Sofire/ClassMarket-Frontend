let app = new Vue(
    { 
    el: '#app',
    data: {
        firstname:'Kyle',
        lastname: 'Walker',
        courses: [],
        cart: [],
        sortAttribute: 'name',
        sortOrder: 'asc',
    }, 
    methods: {
        addToCart(course){
            if(course.availableSpaces>0){
                let existingCartItem = this.cart.find(item => item._id === course.id);

                if (existingCartItem){
                    existingCartItem.quantity +=1;  
                } else{
                    this.cart.push({
                        _id: course._id,
                        name: course.name,
                        price: course.price,
                        quantity: 1,
                        location: course.location,
                        availableSpaces: course.availableSpaces
                    })
                }

                course.availableSpaces -= 1;
                alert(`Added ${course.name} to cart!`);
                
            }

        },
        goToCart(course){
            window.location.href = "./cart.html";
        },
        sort(){
            console.log(`Sorting by ${this.sortAttribute} in ${this.sortOrder}`);
            if(this.sortAttribute === 'name' && this.sortOrder === 'asc'){
                this.courses.sort(function(a, b) { return a.name.localeCompare(b.name)})
            }
            else if(this.sortAttribute === 'name' && this.sortOrder === 'desc'){
                this.courses.sort(function(a, b) { return a.name.localeCompare(b.name)}).reverse()
            }
            else if(this.sortAttribute === 'location' && this.sortOrder === 'asc'){
                this.courses.sort(function (a, b) {return a.location.localeCompare(b.location)})
            }
            else if(this.sortAttribute ==='location' && this.sortOrder === 'desc'){
                this.courses.sort(function (a, b) {return a.location.localeCompare(b.location)}).reverse()
            }
        }
    },
    computed: {
        fullname: function(){
            return this.firstname + ' ' + this.lastname;
        },
    },
    beforeMount() {
        fetch("https://after-mdx-backend.onrender.com/api/courses/pages")
        .then(function(response){return response.json();
        })
        .then((data)=>{
            console.log("Courses Fetch", data);
            this.courses = data.flat();
        })
    },

    })
