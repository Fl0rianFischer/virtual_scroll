define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/virtualScroll.html'
], function($, _, Backbone, scrollTemplate) {
    'use strict';

    var VirtualScroll = Backbone.View.extend({
        template: _.template(scrollTemplate),
        initialize: function($container, data) {
            this.$el = $container;
            this.data = data;
            console.log(this.$el, this.data);
        }
    });

    return VirtualScroll;
});