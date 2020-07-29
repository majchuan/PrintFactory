var AppRouter = Backbone.Router.extend( {
    routes: {
        '': 'index',
        'products': 'productList',
        'detail/:id' : 'productDetail',
        'contact': 'contact',
        'login' : 'login',
        'logout': 'logout',
        'about' : 'aboutUS',
        'Admin/dashboard' : 'dashboard',
        'Admin/new' : 'newProduct',
        'Admin/edit/:id' : 'editProduct',
        'Admin/delete/:id' : 'deleteProduct',
        'Admin/managePassword' : 'managePassword',
        'Admin/updateCompanyInfo' : 'updateCompanyInfo'
    },
    
    initialize : function () { 

    },
    
    index: function () {
        var products = new PrintFactory.products(),
            company = new PrintFactory.company(),
            user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        });
        
        company.fetch({
            success : function (result){
                if (loginUser) {
                    $("#admin").css('display' , 'inline');
                }
                new IndexView.Search().el;
                new IndexView.Login({ model : loginUser }).el;
                new CompanyView.AboutUS({model : result}).el;
            },
            error: function (e){
                console.log('index service request failure');
                new ErrorView.Error({ model : 'home page failed, please click below link to back home page.' }).el;
            }
        });
    },
    
    productList: function () {
        var products = new PrintFactory.products();
        var user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        })
        products.fetch({
            success: function (collection) {
                if (loginUser) {
                    $('#admin').css('display', 'inline');
                }
                new IndexView.Search().el;
                new IndexView.Login().el;
                var productsview = new ProductsView.Products({ collection: products }).el;
            },
            error: function (e) {
                console.log("product List failed")
                new ErrorView.Error({ model : 'product List failed, please click below link to back home page.' }).el;
            },
            reset: true
        });
    },
    
    productDetail: function (id) {
        var product = new PrintFactory.product({ _id: id });
        var user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) { 
            loginUser = aUser.get('user');
        })
        product.fetch({
            success: function (data) {
                if (loginUser) {
                    $("#admin").css('display' , 'inline');
                }
                new IndexView.Search().el;
                new IndexView.Login({ model : loginUser}).el;
                var productview = new ProductsView.Product({ model: data , user:loginUser }).el;
            },
            error: function (e) {
                console.log("proudct detail failed");
                new ErrorView.Error({ model : 'product detail failed, please click below link to back home page.' }).el;
            }
        });
    },
    
    contact: function () {
        var user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        })
        if (loginUser) {
            $("#admin").css('display' , 'inline');
        }
        new IndexView.Search().el;
        new IndexView.Login().el;
        var contactview = new ContactView.ContactForm().el;
    },
    
    dashboard: function () {
        var products = new PrintFactory.products();
        var user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        })
        products.fetch({
            success: function (data) {
                if (loginUser) {
                    $("#admin").css('display' , 'inline');
                }
                new IndexView.Search().el;
                new IndexView.Login({model:loginUser}).el;
                var dashboardview = new DashboardView.ListProducts({ collection: data }).el;
            },
            error: function (err) {
                console.log("admin dashboard failed " + err);
                new ErrorView.Error({ model : 'admin dashboard failed, please click below link to back home page.' }).el;
            },
            reset : true
        });
    },
    
    newProduct : function () {
        var user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        })
        if (loginUser) {
            $("#admin").css('display' , 'inline');
        }
        new IndexView.Search().el;
        new IndexView.Login().el;
        var newProductView = new DashboardView.ProductAddNew().el;
    },
    
    editProduct: function (id) {
        var user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        })
        var product = new PrintFactory.product({ _id: id });
        product.fetch({
            success: function (data) {
                if (loginUser) {
                    $("#admin").css('display' , 'inline');
                }
                new IndexView.Search().el;
                new IndexView.Login().el;
                var editProductView = new DashboardView.ProductEdit({ model: data }).el;
            },
            error: function () {
                console.log("admin edit product failed");
                new ErrorView.Error({ model : 'edit product failed, please click below link to back home page.' }).el;
            }
        });
    },
    
    deleteProduct : function (id) {
        var user = new PrintFactory.user();
        var loginUser
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        })

        var product = new PrintFactory.product({ _id: id });
        
        product.fetch({
            success: function (data) {
                if (loginUser) {
                    $("#admin").css('display' , 'inline');
                }
                new IndexView.Search().el;
                new IndexView.Login().el;
                var deleteProductView = new DashboardView.ProductDelete({ model: data }).el;
            },
            error: function () {
                console.log("admin delete product failed to load product");
                new ErrorView.Error({ model : 'delete product failed, please click below link to back home page.' }).el;
            }
        });
    },
    
    login: function () {
        var loginView = new LoginView.login().el;
    },
    
    logout: function (){
        var user = new PrintFactory.user();
        user.fetch({
            url: '/Logout',
            success: function (){
                $("#admin").css('display' , 'none');
                window.location.href='/'
            },
            error: function (err){
                if (err) {
                    console.log(err);
                    new ErrorView.Error({ model : 'logout failed, please click below link to back home page.' }).el;
                }
            }
        });
    },

    aboutUS: function (){
        new IndexView.Search().el;
        new IndexView.Login().el;
        var companyView = new CompanyView.aboutUS().el;
    },

    managePassword : function (){
        var user = new PrintFactory.user();
        user.getLoginUser(function (aUser) {
            if (aUser.get('user')) {
                new IndexView.Search().el;
                new LoginView.password({ model : aUser.get('user') }).el;
            }
        });  
    },

    updateCompanyInfo : function (){
        var company = new PrintFactory.company(),
            user = new PrintFactory.user(),
            loginUser;
        user.getLoginUser(function (aUser) {
            loginUser = aUser.get('user');
        });
        
        company.fetch({
            success : function (result) {
                if (loginUser) {
                    $("#admin").css('display' , 'inline');
                }
                new IndexView.Search().el;
                new IndexView.Login({ model : loginUser }).el;
                new CompanyView.CompanyInfo({ model : result }).el;
            },
            error: function (e) {
                console.log('update company info service request failure');
                new ErrorView.Error({ model : 'update company infor page failed, please click below link to back home page.' }).el;
            }
        });
    }

});


function AppInit(){
    app = new AppRouter();
    Backbone.history.start();
}

$(function () {
    $.ajaxSetup({ cache: false });
    AppInit();
});