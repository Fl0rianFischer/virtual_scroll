define([
    'jquery',
    'underscore',
    'backbone',
    'collections/transactions',
    './virtualScroll'
], function($, _, Backbone, Transactions, VirtualScroll) {
    'use strict';

    var App = Backbone.View.extend({
        el: $('#app'),
        initialize: function() {
            var self = this;
            var data = new Transactions(this.demoData(3000));

            var scroller1 = new VirtualScroll({
                container: this.$el.find('#scroller1'), 
                data: data,
                rowHeight: 25,
                height: 300
            });

            var scroller2 = new VirtualScroll({
                container: this.$el.find('#scroller2'), 
                data: data,
                rowHeight: 30,
                height: 400
            });

            this.$el.find('#setSource').on('click', function() {
                console.log('ka')
                scroller1.setSource(new Transactions(self.demoData(6000)))
            });

        },
        demoData: function(size) {
            var list = [];
            for (var i = 0; i < size; i++) {
                list.push({ itemId: i});
            }

            return list;
        }
    });

    return App;
});