var DashboardView = DashboardView || {}

DashboardView.ListProducts = Backbone.View.extend({
    el: ".content_box" ,
    
    //template: Handlebars.compile($("#ProductsList").html()),

    initialize: function (options) {
        this.render();
    },
    
    render: function () {
        var products = this.collection;
        var self = this;
        var localel = this.el;
        $(localel).empty();
        $.get("../javascripts/template/dashboard.handlebars", function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ products : products.toJSON() }));
            self.delegateEvents();
        },'html');
        return self;
    },

});

DashboardView.ProductAddNew = Backbone.View.extend({
    el: ".content_box",
    
    //template : Handlebars.compile($("#ProductAddNew")),
    
    events: {
        'click #submitAdd' : "submitAdd"
    },
    
    initialize: function (options) {
        this.render();
    },
    
    render: function () {
        var self = this;
        var localel = self.el;
        $(localel).empty();
        $.get('../javascripts/template/newProduct.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template());
            self.delegateEvents();
        },'html');
        
        return self;
    },
    
    submitAdd : function () {
        var self = this;
        var localel = self.el;
        var $form = $(localel).find("#manageForm");
        $form.attr("method", "post");
        $form.attr("enctype", "multipart/form-data");
        $form.attr("action","/PrintFactory/Product/")
       
        $form.submit(function (e) {
            console.log('Upload picture start');
            $(this).ajaxSubmit({
                error: function (xhr){
                    console.log('error' + xhr.status);
                    new ErrorView.Error({ model : 'add a new product failed, please try again.' }).el;
                },
                success: function (response){
                    if (response.error) {
                        console.log('Error' + response.error);
                    }
                    console.log("Success upload picture");
                    window.location.href='/#Admin/dashboard';
                }
            });
            e.preventDefault();
        });


    },


});

DashboardView.ProductEdit = Backbone.View.extend({
    el: ".content_box",
    
    //template : Handlebars.compile($("#ProductEdit")),
    
    events: {
        'click #submit' : "submitEdit",
        'click #deleteImage' : 'deleteImage',
        'click #addImage' : 'addImage'
    },
    
    initialize: function (options) {
        // if this.model is null or undefined, set up it new model
        if (!this.model || typeof (this.model) == "undefined") {
            this.model = new PrintFactory.product();
        }
        this.render();
    },
    
    render: function () {
        var self = this;
        var product = self.model;
        var localel = self.el;
        $(localel).empty();
        $.get('../javascripts/template/editProduct.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'product': product.toJSON() }));
            self.delegateEvents();
        },'html');
       
        return self;
    },
    
    submitEdit : function (e) {

        e.preventDefault();
        var self = this;
        var localel = self.el;
        var localmodel = self.model; 

        var product = new PrintFactory.product({_id: this.$el.find('input[name="ProductID"]').val()});
        product.set('product_name' ,$(localel).find('input[name="ProductName"]').val());
        product.set('product_price' , $(localel).find('input[name="ProductPrice"]').val());
        product.set('product_description' , $(localel).find('textarea[name="ProductDesc"]').val());

        product.save({ },{
            type: 'PUT',
            success: function () {
                console.log('Product Update');
                window.location.href = '/#Admin/dashboard';
            },
            error: function (res) {
                console.log('Product failed: ' + res.error);
                new ErrorView.Error({ model : 'Edit a product failed, please try again.' }).el;
            }
        });


    },
    
    addImage: function (){
        var self = this;
        var localel = self.el;
        var $form = $(localel).find("#imageForm");
        $form.attr("method", "post");
        $form.attr("enctype", "multipart/form-data");
        $form.attr("action", "/PrintFactory/Product/Update")
        

        $form.submit(function (e) {
            console.log('Upload picture start');
            $(this).ajaxSubmit({
                error: function (xhr) {
                    console.log('error' + xhr.status);
                    new ErrorView.Error({ model : 'edit a product failed, please try again.' }).el;
                },
                success: function (response) {
                    if (response.error) {
                        console.log('Error' + response.error);
                    }
                    console.log("Success upload picture");
                
                    window.location.href = '/#Admin/dashboard';
                }
            });
            e.preventDefault();
        });
    },

    deleteImage : function (){
        var self = this;
        var localel = self.el;
        var urlRoot = '/PrintFactory/Product/:id/Image'
        var productID = $(localel).find("input[name='ProductID']").val();
        var imageNames = [];
        $(localel).find(".imageCheckbox").each(function (index, element) {
            if ($(element).prop("checked")) {
                imageNames.push($(element).prop("name"));
            }
             
        });
        
        var product = new PrintFactory.product();

        product.fetch({
            url : urlRoot,
            data: {
                id : productID,
                image : imageNames
            },
            type: 'DELETE',
            success : function (){
                window.location.href = '/#Admin/dashboard';
            },
            error: function (err){
                console.log("Failed to delete image" + err);
                new ErrorView.Error({ model : 'edit a product failed, please try again.' }).el;
            }
        });
    }
});

DashboardView.ProductDelete = Backbone.View.extend({
    el: ".content_box",
    
    //template : Handlebars.compile($("#ProductDelete")),
    
    events: {
        'click #submit' : "submitDelete"
    },
    
    initialize: function (options) {
        this.render();
    },
    
    render: function () {
        var self = this;
        var product = self.model;
        var localel = self.el;
        $(localel).empty();
        $.get('../javascripts/template/deleteProduct.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'product': product.toJSON() }));
            self.delegateEvents();
        },'html');
        
        return self;
    },
    
    submitDelete : function (e) {
        var self = this;
        var product = self.model;

        self.model.destroy({
            success: function (res){
                if (res.error) {
                    console.log(res.error);
                }
                window.location.href = '/#Admin/dashboard';
            },
            error: function (err) {
                console.log(err);
                new ErrorView.Error({ model : 'delete a product failed, please try again.' }).el;
            }
        });

       
    },
});
