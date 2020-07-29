var IndexView = IndexView || {};

IndexView.Home1 = Backbone.View.extend( {
    
    el: '#Homeview1',
    
    //template: Handlebars.compile($("#home-template").html()),

    initialize: function (options){
        this.render();
    },

    render: function (){
        var products = this.collection;
        var product_picture = products.at(0).get('product_picture');
        var localel = this.el;
        $.get('../javascripts/template/index-home.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'products': products.toJSON() }));
        }, 'html');
        
        return this;
    }
});

IndexView.Home2 = Backbone.View.extend({

    el: '#Homeview2',

    //template: Handlebars.compile($("#home-template-2").html()),

    initialize: function (options){
        this.render();
    },

    render: function (){
        var products = this.collection;
        var localel = this.el;
        $.get('../javascripts/template/index-home2.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'products': products.toJSON() }));
        });
        return this;
    }
});

IndexView.Home3 = Backbone.View.extend({
    
    el: '#Homeview3',
    
    //template: Handlebars.compile($("#home-template-3").html()),
    
    initialize: function (options) {
        this.render();
    },
    
    render: function () {
        var products = this.collection;
        var localel = this.el;
        $.get('../javascripts/template/index-home3.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'products': products.toJSON() }));
        });
        
        return this;
    }
});

IndexView.Login = Backbone.View.extend({
    el: '.login-info' ,
    
    events : {
        'click #SearchProduct' : 'searchProduct'
    },

    initialize : function (){
        this.render();
    },

    render: function (){
        var localel = this.el;
        var localUser = this.model;
        var user = new PrintFactory.user();
        if (!localUser) {
            user.getLoginUser(function (user) {
                localUser = user;
            });
        } 

        $(localel).empty();
        $.get('../javascripts/template/index-home.handlebars', function (data) {
            var template = Handlebars.compile(data);
            if (localUser) {
                $(localel).html(template({ 'user': localUser }));
            } else {
                $(localel).html(template({ 'user': null }));
            }
            
        });
    }

});

IndexView.Search = Backbone.View.extend({
    el: '.search' ,
    
    events : {
        'click #SearchProduct' : 'searchProduct'
    },
    
    initialize : function () {
        this.render();
    },
    
    render: function () {
        var self = this;
        var localel = this.el;
        $(localel).empty();
        $.get('../javascripts/template/searchProduct.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template());
            self.delegateEvents();
        });
        return self;
    },
    
    searchProduct : function (e) {

        e.preventDefault();
        var searchQuery = $('#SearchQuery').val();

        if (searchQuery && searchQuery.length > 0) {
            var products = new PrintFactory.products();
            products.fetch({
                url: '/PrintFactory/SearchProduct',
                data : {
                    searchquery : searchQuery
                },
                type : 'POST',
                success: function (collectionProduct) {
                    if (_.isNull(collectionProduct)) {
                        //window.location.href = '/';
                        new ErrorView.Error({ model : 'There is no result return, please try again later.' }).el;
                    } else {
                        new IndexView.Login().el;
                        var productsview = new ProductsView.Products({ collection: collectionProduct }).el
                    }
                    
                },
                error : function (err) {
                    if (err) {
                        console.log(err);
                    }
                    new ErrorView.Error({ model : 'search process failed, please try again later.' }).el;
                }
            });
        }
    }

});