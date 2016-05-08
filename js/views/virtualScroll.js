define([
    'jquery',
    'underscore',
    'backbone',
    './listItem'
], function($, _, Backbone, ListItem) {
    'use strict';

    /**
    * FUNCTION constructing a new instance of VirtualScroll
    *
    * @param  {Object}  config          object holding all parameters
    * @param  {Object}  container       jQuery object that is the parent elment of the scroller
    * @param  {Object}  data            data source to be rendered in scroller
    * @param  {Number}  height          height of container element, set if specified
    * @param  {Number}  width           width of container element, set if specified
    * @param  {Number}  rowHeight       height of each list item
    */
    var VirtualScroll = Backbone.View.extend({
        tagName: 'ul',
        initialize: function(config) {

            this.$container = config.container;
            this.data = config.data;
            this.containerHeight = config.height;
            this.containerWidth = config.width;
            this.rowHeight = config.rowHeight || 25;
            this.rowsPerScreen = Math.round(this.containerHeight / this.rowHeight);
            this.buffer = this.rowsPerScreen + 3;

            this._setTopBuffer(0);
            this._setScroller()
            this._render(0);

            this.$container.on('scroll', this._onScroll.bind(this));

            this.$container.append(this.$el);
        },
        /**
        * FUNCTION styling container and $el according to config
        */
        _setScroller: function() {
            // Virtual height of list
            this.$el.height(this.rowHeight * this.data.length);
            this.$container.css({
                'position': 'relative',
                'overflow-y': 'scroll'
            });
            if (this.containerHeight) this.$container.height(this.containerHeight);
            if (this.containerWidth) this.$container.width(this.containerWidth);
        },
        /**
        * FUNCTION for initial rendering and updating with _onScroll function
        *
        * @param  {Object}  first           first currently visible item in list
        * @param  {Boolean} direction       scroll direction: true if scrolling down, false if up
        *
        */
        _render: function (first, direction) {
            var self = this;
            var visibleItems = this.data.slice(first, first + this.buffer); // items to be displayed
            var $fragment = $(document.createDocumentFragment());

            var toAdd = (this.current) ? _.difference(visibleItems, this.current) : visibleItems; // determine items to add onto current
            var toRemove = _.difference(this.current, visibleItems); // determine items to be removed

            _.each(toRemove, function(item) {
                self.$el.find('#' + item.attributes.itemId).remove();
            });

            _.each(toAdd, function(item, i) {
                var $item = $(new ListItem({model: item}).render().el);  // is basically the createItemFn from the API specs
                $item.height(self.rowHeight);
                $fragment.append($item);
            });

            this.current = visibleItems; // save currently visible items to compare on next function call

            (direction) ? $fragment.appendTo(this.$el) : $fragment.insertAfter(this.$bufferItem); // decide where to append new list items

            this._setTopBuffer(first);
        },
        /**
        * FUNCTION creates a buffer element at the top of the scroller. 
        * Updates height of buffer according to scroll position.
        *
        * @param  {Object}  first first currently visible item in list     
        *   
        */
        _setTopBuffer: function(first) {
            if (!this.$bufferItem) {
                this.$bufferItem = $('<div id="buffer"></div>');
                this.$bufferItem.prependTo(this.$el);
            }

            this.bufferHeight = first * this.rowHeight;
            this.$bufferItem.height(this.bufferHeight);
        },
        /**
        * FUNCTION fired on scroll.
        *
        * Determines scroll direction and calls _render  
        *   
        */
        _onScroll: function() {
            var scrollPostion = this.$el.position().top;
            var first = Math.abs(parseInt(scrollPostion / this.rowHeight));     // calculate first visisble item in scroller

            this.lastScrollY = (this.lastScrollY) ? this.lastScrollY : 0;
            this.scrollingDown = this.lastScrollY > scrollPostion;

            this._render(first, this.scrollingDown);
            this.lastScrollY = scrollPostion;                                   // save reference to compare with scroll position at nex call        
        },
        setSource: function(newData) {
            this.data = newData;
            this._setTopBuffer(0);
            this._setScroller();
            this._render(0);
            this.$container.scrollTop(0);
        },
        destroy: function() {
            this.$container.off();
        },
        remove: function() {
            this.$container.empty().off().removeAttr('style');
        },
        // I couldn't get isScrolling to work here
        info: function() {
            return {
                scrollTop: this.bufferHeight,
                direction: (this.scrollingDown) ? 1 : -1, // returns only the scroll direction of most recent scroll
                height: this.$el.height()
            }
        }
    });

    return VirtualScroll;

});