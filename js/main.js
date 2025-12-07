let app = new Vue(
    { 
    el: '#app',
    data: {
        firstname:'Kyle',
        lastname: 'Walker',
        courses: [],
        cart: JSON.parse(sessionStorage.getItem("cart")) || [],
        sortAttribute: 'name',
        sortOrder: 'asc',
        searchQuery: '',
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
                sessionStorage.setItem("cart", JSON.stringify(this.cart));
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
             else if (this.sortAttribute === "space" && this.sortOrder === 'asc') {
                this.courses.sort(function(a, b) { return a.availableSpaces - b.availableSpaces});
            }else if (this.sortAttribute === "space" && this.sortOrder === 'desc') {
                this.courses.sort(function(a, b) { return a.availableSpaces - b.availableSpaces}).reverse();
            }else if (this.sortAttribute === "price" && this.sortOrder === 'asc') {
                this.courses.sort(function(a, b) { return a.price - b.price});
            }else if (this.sortAttribute === "price" && this.sortOrder === 'desc') {
                this.courses.sort(function(a, b) { return a.price - b.price}).reverse();
            }
        }
    },
    computed: {
        fullname: function(){
            return this.firstname + ' ' + this.lastname;
        },
        searchedCourses: function(){
            if (this.searchQuery.trim() === ''){
                return this.courses;
            }
            
            return this.courses.filter((course)=>{
                return course.name.toUpperCase().includes(this.searchQuery.toUpperCase().trim()) ||
                    course.location.toUpperCase().includes(this.searchQuery.toUpperCase().trim()) ||
                    course.description.toUpperCase().includes(this.searchQuery.toUpperCase().trim())
            })
        },
    },
    beforeMount() {
        fetch("https://classmarket-backend.onrender.com/api/courses/")
        .then(function(response){return response.json();
        })
        .then((data)=>{
            console.log("Courses Fetch", data);
            this.courses = data.flat();
        })
    },

    })
