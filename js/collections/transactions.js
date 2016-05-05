define([
    'jquery',
    'underscore',
    'backbone',
    'models/transaction'
], function($, _, Backbone, Transaction) {
    'use strict';

    var Transactions = Backbone.Collection.extend({
        model: Transaction
    });

    return Transactions;
});