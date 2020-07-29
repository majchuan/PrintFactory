var ContactView = ContactView || {};

ContactView.ContactForm = Backbone.View.extend({
    el: ".content_box",
    
    events: {
        'click #submit' : "submit"
    },

    initialize : function (){
        this.render();
    },

    render : function (){
        var self = this;
        var localel = self.el;
        
        $(localel).empty();

        $.get('../javascripts/template/contact.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template());
            self.delegateEvents();
        });

        return self; 
    },

    submit : function (){
        var self = this;
        var name = $("input[name='UserName']").val();
        var email = $("input[name='EmailAddress']").val();
        var subject = $("input[name='EmailSubject']").val();
        var message = $("textarea[name='Message']").val();

        var contactForm = new PrintFactory.contact();
        contactForm.fetch({
            data: {
                Name : name, 
                Email : email, 
                Subject : subject, 
                Message : message
            },
            type : 'POST',
            success: function (){
                self.render();
            },
            error: function (err){
                console.log(err);
                new ErrorView.Error({ model : 'Send Contact form failed, please try again.' }).el;
            }
        });
    }
});