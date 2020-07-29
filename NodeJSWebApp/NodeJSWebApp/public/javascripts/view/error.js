var ErrorView = ErrorView || {};

ErrorView.Error = Backbone.View.extend({
    
    el: '.content_box',
    
    initialize: function (options) {
        this.render();
    },
    
    render: function () {
        var message = this.model;
        var localel = this.el;
        $(localel).empty();
        $.get('../javascripts/template/error.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'message': message }));
        }, 'html');
        
        return this;
    }
});