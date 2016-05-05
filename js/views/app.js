define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    'use strict';

    var App = Backbone.View.extend({
        el: $('#app'),
        initialize: function() {
            
        }
    });

    return App;
});