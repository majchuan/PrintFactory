var ProductsView = ProductsView || {};

ProductsView.Products = Backbone.View.extend( {
    el: ".content_box" ,
    
    //template : Handlebars.compile($("#ProductsList-Template").html()) ,
    
    initialize: function () {
        this.CurrentPageNumber = 1;
        this.TotalPagesNumber = 1;
        this.sortByValue = 0;
        this.pageSize = 9;
        this.render();

    },
    
    events: {
        'change #selectSortBy' : 'SortProducts',
        'change #selectPageSize' : 'SortProducts',
        'click .previous' : 'PrevPage',
        'click .next' : 'NextPage',
        'click .priceBrowserBy' : 'browserByPrice'
    },
    
    render : function () {
        this.TotalPagesNumber = Math.ceil(this.collection.size() / this.pageSize);
        if (this.CurrentPageNumber > this.TotalPagesNumber) {
            this.CurrentPageNumber = this.TotalPagesNumber;
        }
        var collectionArray = this.collection.toArray();
        var aCurrentPageNumber = this.CurrentPageNumber;
        var aTotalPageNumber = this.TotalPagesNumber;
        var self = this;
        var localel = self.el;
        $(localel).empty();
        $.get('../javascripts/template/products.handlebars', function (data) {
            var products = [];
            var collectionArraySize = collectionArray.length < self.pageSize * (self.CurrentPageNumber) ? 
            collectionArray.length : self.pageSize * (self.CurrentPageNumber);
            for (i = self.pageSize * (self.CurrentPageNumber - 1) ; i < collectionArraySize; i++) {
                products.push(collectionArray[i]);
            }
            
            var sortedProducts = [];
            sortedProducts = _.sortBy(products, function (product) {
                return 'product_price';
            });

            if (self.sortByValue == 0) {
                sortedProducts = sortedProducts.reverse();
            }
            var template = Handlebars.compile(data);
            var arrayProducts = [];
            var arrayProducts2 = [];
            var arrayProducts3 = [];
            var price1 = 0, price2 = 0, price3 = 0;
            for (i = 0 ; i < sortedProducts.length ; i++) {
                if (!_.isUndefined(sortedProducts[i])) {
                    var _id = sortedProducts[i].get('_id');
                    var _product_name = sortedProducts[i].get('product_name');
                    var _product_description = sortedProducts[i].get('product_description');
                    var _product_picture = sortedProducts[i].get('product_picture');
                    var _product_price = sortedProducts[i].get('product_price');
                    
                    switch (true) {
                        case (_product_price < 200):
                            price1++;
                            break;
                        case (_product_price < 400 && _product_price >= 200):
                            price2++;
                            break;
                        case (_product_price >= 400):
                            price3++;
                            break;
                    }

                    if (i < 3) {
                        arrayProducts.push({
                            _id: _id, 
                            product_name : _product_name , 
                            product_description : _product_description , 
                            product_picture : _product_picture ,
                            product_price : _product_price
                        });
                    }
                    
                    if (i > 2 && i < 6) {
                        arrayProducts2.push({
                            _id: _id, 
                            product_name : _product_name , 
                            product_description : _product_description , 
                            product_picture : _product_picture ,
                            product_price : _product_price
                        });
                    }
                    
                    if (i > 5 && i < 9) {
                        arrayProducts3.push({
                            _id: _id, 
                            product_name : _product_name , 
                            product_description : _product_description , 
                            product_picture : _product_picture ,
                            product_price : _product_price
                        });
                    }
                }
               
            }
            $(localel).html(template({
                'products': arrayProducts, 
                'products2': arrayProducts2,
                'products3' : arrayProducts3,
                'CurrentPageNumber' : aCurrentPageNumber , 
                'TotalPagesNumber' : aTotalPageNumber,
                'price1' : price1,
                'price2' : price2,
                'price3' : price3
            }));
            self.delegateEvents();
        });
        

        return self;
    },

    SortProducts : function (){
        this.sortByValue = $('#selectSortBy').val();
        this.render();
    },

    PrevPage : function (){
        //alert('action prev');
        this.CurrentPageNumber = $('#CurrentPageNum').text();

        if (this.CurrentPageNumber == 1) {
            return this;
        }
        
        if (this.CurrentPageNumber > 1) {
            this.CurrentPageNumber = this.CurrentPageNumber - 1;
        }

        this.render();
    },

    NextPage : function (){
        //alert('action next');
        this.CurrentPageNumber = $('#CurrentPageNum').text();
        
        if (this.CurrentPageNumber < this.TotalPageNumber) {
            this.CurrentPageNumber = this.CurrentPageNumber + 1;
        }
        
        this.render();
    },

    browserByPrice : function (e){
        var self = this;
        var index = $(e.currentTarget).data('index');
        var products = new PrintFactory.products();
        var minPrice = 0;
        var maxPrice = 0;
        switch (true) {
            case index == 1:
                minPrice = 0, maxPrice = 200;
                break;
            case index == 2:
                minPrice = 200, maxPrice = 400;
                break;
            case index == 3:
                minPrice = 400, maxPrice = 400;
                break;
        }

        products.fetch({
            url: '/PrintFactory/Price/Products',
            data : {
                minPrice : minPrice,
                maxPrice : maxPrice
            },
            type : 'POST',
            success : function (data) {
                self.collection = data;
                self.render();
            },
            error: function (err) {
                console.log(err);
                //window.location.href = '/'
                new ErrorView.Error({ model : 'browser a price failed, please try again.' }).el;
            }

        });
    }
});

ProductsView.Product = Backbone.View.extend({
    el: ".content_box" ,
    
    //template : Handlebars.compile($("#Product-Template").html()), 
    
    initialize: function () {
        this.render();
    },
    
    render : function () {
        var product = this.model;
        var self = this;
        var localel = self.el;
        $(localel).empty();
        $.get('../javascripts/template/productDetail.handlebars', function (data) {
            var template = Handlebars.compile(data);
            var selectedProduct = {
                _id: product.get("_id") , 
                product_name : product.get("product_name") , 
                product_description : product.get("product_description") , 
                product_picture : product.get("product_picture") ,
                product_price : product.get("product_price")}
            $(localel).html(template({ 'product': selectedProduct }));
        });
        return self;
    }
});