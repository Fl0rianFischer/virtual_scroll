define([
    'jquery',
    'underscore',
    'backbone',
    './listItem'
], function($, _, Backbone, listItem) {
    'use strict';

    var VirtualScroll = Backbone.View.extend({
        initialize: function($container, data) {
            this.$el = $container;
            this.data = data;

            this.render();
        },
        render: function() {
            var $el = this.$el;

            this.data.each(function(list) {
                var item = new listItem({model: list});
                $el.append(item.render().el)
            });
        }
    });

    return VirtualScroll;
});