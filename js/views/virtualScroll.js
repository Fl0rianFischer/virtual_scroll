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

            this._setTopBuffer(0);
            this._setScroller(this.rowHeight * this.data.length)
            this.render(0);

            this.$container.on('scroll', this.onScroll.bind(this));

            this.$container.append(this.$el);
        },
        _setScroller: function(h) {
            // Virtual height      
            this.$el.height(h);
            this.$container.css('position', 'relative');
        },
        render: function (first, direction) {
            var self = this;
            var visibleItems = this.data.slice(first, first + this.buffer);
            var $fragment = $(document.createDocumentFragment());

            var toAdd = (this.current) ? _.difference(visibleItems, this.current) : visibleItems;
            var toRemove = _.difference(this.current, visibleItems);

            _.each(toRemove, function(item) {
                self.$el.find('#' + item.attributes.itemId).remove();
            })

            _.each(toAdd, function(item, i) {
                var $item = $(new ListItem({model: item}).render().el);
                $item.height(self.rowHeight);
                $fragment.append($item)
            });

            this.current = visibleItems;

            if (direction) {
                $fragment.appendTo(this.$el) 
            } else {
                $fragment.insertAfter(this.$el.find('#buffer'));
            }

            this._setTopBuffer(first);
        },
        _setTopBuffer: function(first) {
            if (!this.$bufferItem) {
                this.$bufferItem = $('<div id="buffer"></div>');
                this.$bufferItem.prependTo(this.$el);
            }

            this.$el.find('#buffer').css('height', first * this.rowHeight);
        },
        onScroll: function() {
            var scrollPostion = this.$el.position().top;

            this.lastScrollY = (this.lastScrollY) ? this.lastScrollY : 0;

            if (Math.abs(scrollPostion - this.lastScrollY) > this.containerHeight) {
                var first = Math.abs(parseInt(scrollPostion / this.rowHeight));
                this.render(first, (this.lastScrollY > scrollPostion));
                this.lastScrollY = scrollPostion;
            }
        }
    });

    return VirtualScroll;

});