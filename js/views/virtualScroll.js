define([
    'jquery',
    'underscore',
    'backbone',
    './listItem'
], function($, _, Backbone, ListItem) {
    'use strict';

    var VirtualScroll = Backbone.View.extend({
        tagName: 'ul',
        initialize: function(config) {
            var self = this;

            this.$container = config.container;
            this.data = config.data;
            this.containerHeight = config.height || this.$container.height();
            this.containerWidth = config.width || this.$container.width();
            this.rowHeight = config.rowHeight || 25;
            this.rowsPerScreen = Math.round(this.containerHeight / this.rowHeight);
            this.buffer = this.rowsPerScreen * 3;
            this.bufferLength = this.buffer * this.rowHeight;

            this.setScroller(this.rowHeight * this.data.length)
            this.append(0);

            this.$container.on('scroll', this.onScroll.bind(this));

            this.$container.append(this.$el);

            this.lastScrollY;
        },
        setScroller: function(h) {
            // Virtual height      
            this.$el.height(h);
            this.$container.css('position', 'relative');
        },
        append: function (first, direction) {
            var self = this;
            var visibleItems = this.data.slice(first, first + this.buffer);
            var $fragment = $(document.createDocumentFragment());

            var diff = (this.current) ? _.difference(visibleItems, this.current) : visibleItems;
            
            _.each(diff, function(listItem, i) {
                var $item = $(new ListItem({model: listItem}).render().el);
                $item.height(self.rowHeight);
                $fragment.append($item)
            });

            this.current = visibleItems;
            $fragment.appendTo(this.$el);
        },
        onScroll: function() {
            var scrollPostion = this.$el.position().top;

            this.lastScrollY = (this.lastScrollY) ? this.lastScrollY : 0;

            if (Math.abs(scrollPostion - this.lastScrollY) > this.containerHeight) {
                var first = Math.abs(parseInt(scrollPostion / this.rowHeight));
                this.append(first, (this.lastScrollY > scrollPostion));
                this.lastScrollY = scrollPostion;
            }
        }
    });

    return VirtualScroll;

});