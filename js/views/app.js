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
            var data = new Transactions(this.demoData());
            var $scroller = this.$el.find('#scroller1');
            new VirtualScroll({
                container: $scroller, 
                data: data,
                rowHeight: 25
            });
        },
        demoData: function() {
            var list = [];
            for (var i = 0; i < 100; i++) {
                list.push({ itemId: i});
            }

            return list;
        }
    });

    return App;
});