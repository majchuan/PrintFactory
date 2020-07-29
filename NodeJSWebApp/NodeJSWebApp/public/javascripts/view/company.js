var CompanyView = CompanyView || {};

CompanyView.AboutUS = Backbone.View.extend({
    el: ".content_box",
    
    initialize : function () {
        this.render();
    },
    
    render : function () {
        var self = this;
        var localel = self.el;
        var aCompany = this.model;
        var companyName = aCompany.get('companyname'),
            companyIntro = aCompany.get('companyIntro').split(','),
            background = aCompany.get('background').split(','),
            skillsets = aCompany.get('skillsets').split(',');

        $(localel).empty();
        
        $.get('../javascripts/template/aboutus.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'companyIntro' : companyIntro , 'background' : background , 'skillsets' : skillsets }));
            self.delegateEvents();
        });
        
        return self;
    }
});

CompanyView.CompanyInfo = Backbone.View.extend({
    el: ".content_box",
    
    events : {
        'click #submitCompanyInfo' : 'updateCompanyInfo'
    },
    
    initialize : function () {
        this.render();
    },
    
    render : function () {
        var self = this;
        var localel = self.el;
        var aCompany = this.model;
        var companyID = aCompany.get('_id');
        $(localel).empty();
        $.get('../javascripts/template/companyInfo.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(localel).html(template({ 'id' : companyID }));
            self.delegateEvents();
        });
        
        return self;
    },

    updateCompanyInfo : function (){
        var self = this;
        var localel = self.el;
        var companyIntro = $(localel).find('textarea[name="companyIntro"]').val(),
            background = $(localel).find('textarea[name="background"]').val(),
            skillsets = $(localel).find('textarea[name="skillsets"]').val(),
            companyID = $(localel).find('input[name="companyID"]').val();
        alert(companyID);

        var companyinfo = new PrintFactory.company({
            _id : companyID ,
            companyIntro : companyIntro,
            background : background ,
            skillsets : skillsets
        });

        companyinfo.save({}, {
            type: 'PUT',
            success: function (){
                console.log("Success update company info");
                window.location.href = '/#Admin/dashboard';
            },
            error: function (err){
                console.log('error' + err);
                new ErrorView.Error({ model : 'update company new information failed, please try again.' }).el;
            }
        });
    }

});