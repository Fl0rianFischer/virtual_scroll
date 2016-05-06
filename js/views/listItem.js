define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/itemTemplate.html'
], function($, _, Backbone, itemTemplate) {
    'use strict';

    var ListItem = Backbone.View.extend({
        tagName: 'li',
        template: _.template(itemTemplate),
        initialize: function() {
            this.model.on('change', this.render, this);
        },
        render: function() {
            var $el = $(this.el);
            $el.attr('id', this.model.get('itemId'));
            $el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return ListItem;
});