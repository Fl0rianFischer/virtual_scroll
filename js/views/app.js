define([
    'jquery',
    'underscore',
    'backbone',
    'collections/transactions'
], function($, _, Backbone, Transactions) {
    'use strict';

    var App = Backbone.View.extend({
        el: $('#app'),
        initialize: function() {
            this.data = new Transactions(this.demoData());
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