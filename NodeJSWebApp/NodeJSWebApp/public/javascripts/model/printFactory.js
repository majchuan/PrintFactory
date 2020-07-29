var PrintFactory = PrintFactory || {};
PrintFactory.product = Backbone.Model.extend({

    urlRoot: '/PrintFactory/Product/',

    idAttribute: '_id',

    initialize: function (){

    },
    defaults: {
        _id: null,
        product_name: "",
        product_description : "",
        product_picture: "",
        product_price: 0
    }
});

PrintFactory.products = Backbone.Collection.extend({

    model: PrintFactory.product,

    url: '/PrintFactory'

});

PrintFactory.contact = Backbone.Model.extend({
    urlRoot: '/PrintFactory/SendEmail',

    initialize : function (){

    },

    defaults : {
        Name: null,
        Email : '' ,
        Subject : 'test',
        Message: 'hello world' 
    }

});

PrintFactory.user = Backbone.Model.extend({
    urlRoot: '/Login',
    
    idAttribute : '_id' ,

    initialize : function (){

    },

    defaults : {
        username : '',
        password : ''
    },

    getLoginUser : function (fn) {
        this.fetch({
            url: '/CheckUserLogin',
            success : function (user){
                fn(user);
            },
            error: function (err){
                if (err) {
                    console.log(err);
                    return;
                }
            }
        })
    }

});

PrintFactory.image = Backbone.Model.extend({
    urlRoot: '/PrintFactory/random/image',
    
    initialize: function () {

    },

    defaults: {
        image_name : ''
    }

});

PrintFactory.company = Backbone.Model.extend({
    urlRoot: '/PrintFactory/Company',
    
    idAttribute : '_id' ,

    initialize : function (){ },

    defaults : {
        _id: null,
        companyname :'',
        companyIntro : '' ,
        background : '',
        skillsets : ''
    }
});