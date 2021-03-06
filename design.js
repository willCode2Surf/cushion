'use strict';

var util = require('util'),
    Document = require('./document.js').Document;


/**
 * design document object
 *
 * @constructor
 * @param {string|null} id string if you have document id, null if not
 * @param {cushion.Connection} connection cushion connection object
 * @param {cushion.Database} database cushion database object
 */
var Design = function(id, revision, connection, database) {
  Document.call(this, id, revision, connection, database);
};

util.inherits(Design, Document);


/**
 * compacts the design document
 *
 * @param {function(error, started)} callback function that will be called,
 *     after compaction was started or if there was an error
 */
Design.prototype.compact = function(callback) {
  this._database.compact(this._id.substr(8), callback);
};


/**
 * get, create, update or delete a list function
 *
 * @param {string} name name of the list function
 * @param {?string} content string representation of the list function; if you
 *     set this to null, the list function will be deleted
 * @return {cushion.Design|string} if you save a list function, you will get
 *     this design document, otherwise the string representation of the specific
 *     list function
 */
Design.prototype.list = function(name, content) {
  if (content) {
    this.body('lists', name, ((content === null) ? undefined : content));
  }

  return ((content !== undefined) ?
    this :
    (this._body.lists) ? this._body.lists[name] : undefined
  );
};


/**
 * get or set rewrites
 * if you want to get the
 *
 * @param {?array.<object>} rewrites list ob rewrite objects
 *     {string} from url source
 *     {string} to url source
 *     {?string} method http method
 *     {?object} query url query params
 */
Design.prototype.rewrites = function(rewrites) {
  if (rewrites) {
    this.body('rewrites', rewrites);
  }

  return ((rewrites) ? this : (this.body().rewrites || []));
};


/**
 * get, create, update or delete a show function
 *
 * @param {string} name name of the show function
 * @param {?string} content string representation of the show function; if you
 *     set this to null, the show function will be deleted
 * @return {cushion.Design|string} if you save a show function, you will get
 *     this design document, otherwise the string representation of the specific
 *     show function
 */
Design.prototype.show = function(name, content) {
  if (typeof(content) !== undefined) {
    this.body('shows', name, ((content === null) ? undefined : content));
  }

  return ((content !== undefined) ?
    this :
    (this._body.shows) ? this._body.shows[name] : undefined
  );
};


/**
 * sets or get the validate doc update handler
 * if you set the handler argument, you will set the handler, otherwise you will
 * get the source
 *
 * @param {?string} handler validate doc update function as string
 * @return {cushion.Design|string} if you set the handler, you will get the
 *     design document, otherwise the string representation of the validation
 *     handler
 */
Design.prototype.validateHandler = function(handler) {
  if (arguments.length > 0) {
    this.body('validate_doc_update', handler);

    return this;
  }

  return this.body('validate_doc_update');
};


/**
 * get, create, update or delete a view
 *
 * @param {string} name name of the view
 * @param {string} map string representation of the map function; if you set
 *     this to null, the view will be deleted
 * @param {?string} reduce string representation of the reduce function
 * @return {cushion.Design|object} if you set a view, you will get this design
 *     document, otherwise you will get the view object with the string
 *     representations of the map and reduce functions
 */
Design.prototype.view = function(name, map, reduce) {
  var view = {};

  if (reduce) {
    view.reduce = reduce;
  }

  if (map !== undefined) {
    view.map = map;

    this.body('views', name, ((map === null) ? undefined : view));
  }

  return ((map !== undefined) ?
    this :
    (this._body.views) ? this._body.views[name] : undefined
  );
};


/**
 * returns some infos about the design document and the views
 *
 * @param {function(error, info)} callback function that will be called, after
 *     getting the infos or if there was an error
 */
Design.prototype.viewInfo = function(callback) {
  this._connection.request({
    'method': 'GET',
    'path': this._database.name() + '/' + this._id + '/_info',
    'callback': callback
  });
};


exports.Design = Design;
