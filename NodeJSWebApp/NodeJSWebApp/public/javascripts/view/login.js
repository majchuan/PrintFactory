var LoginView = LoginView || {};

LoginView.login = Backbone.View.extend({
    el: ".content_box",
    
    events: {
        'click #submit' : "submit"
    },
    
    initialize : function () {
        this.render();
    },
    
    render : function () {
        var self = this;
        var localel = self.el;
        
        $(localel).empty();
        
        var image = new PrintFactory.image();
        image.fetch({
            success: function (data){
                image.image_name = data.get('product_picture')[0];
            },
            error: function (){
                console.log('unable to get random image from server');
            }
        });

        $.get('../javascripts/template/login.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({'image' : image }));
            self.delegateEvents();
        });
        
        return self;
    },
    
    submit : function (e) {
        e.preventDefault();

        var self = this;
        var userForm = new PrintFactory.user();
 

        userForm.save({
            username : $("input[name='UserName']").val() ,
            password : $("input[name='Password']").val()
        } ,
         {
            error: function (){
                console.log('failed to post to server');
                new ErrorView.Error({ model : 'user does not find , or password not correct, please try again.' }).el;
            },
            success: function (data){
                if (data.get('user')) {
                    window.location.href = '/#Admin/dashboard';
                } else {
                    new ErrorView.Error({ model : 'user does not find , or password not correct, please try again.' }).el;
                }
            }
        });
   
    }
});

LoginView.password = Backbone.View.extend({
    el: ".content_box",
    
    events: {
        'click #submitPassword' : "submit"
    },
    
    initialize : function () {
        this.render();
    },
    
    render : function () {
        var self = this;
        var localel = self.el;
        var aUser = self.model;
        
        $(localel).empty();
        
        $.get('../javascripts/template/managePassword.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({user : aUser }));
            self.delegateEvents();
        });
        
        return self;
    },
    
    submit : function (e) {
        e.preventDefault();
        
        var self = this;
        var localel = self.el;
        var userForm = new PrintFactory.user();
        var userID = $(localel).find('input[name="UserID"]').val();
        var userName = $(localel).find('input[name="UserName"]').val();
        var userOldPassword = $(localel).find('input[name="OldPassword"]').val();
        var userNewPassword = $(localel).find('input[name="NewPassword"]').val();
        var userConfirmNewPassword = $(localel).find('input[name="ConfirmPassword"]').val();

        userForm.fetch({
            url: '/UpdateUserPassword',
            data: {
                '_id': userID , 
                'username': userName ,
                'oldPassword' : userOldPassword ,
                'newPassword' : userNewPassword , 
                'confirmNewPassword' : userConfirmNewPassword
            } ,
            type: 'PUT',
            success : function (data) {
                window.location.href = '/#Admin/dashboard';
            },
            error: function (err) {
                if (err) {
                    console.log(err);
                }
                new ErrorView.Error({ model : 'login error, please try again.' }).el;
            }
        });

    }
});