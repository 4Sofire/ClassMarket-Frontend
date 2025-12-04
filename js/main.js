let app = new Vue(
    { 
    el: '#app',
    data: {
        firstname:'Kyle',
        lastname: 'Walker',
        courses: [],
    }, 
    methods: {},
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
