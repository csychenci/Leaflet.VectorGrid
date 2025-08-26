
// The geojson/topojson is sliced into tiles via a web worker.
// Worker code is inlined to avoid complex blob imports



// Import worker using rollup-plugin-web-worker-loader
import SlicerWorker from 'web-worker:./slicerWebWorker.js';

/*
 * 🍂class VectorGrid.Slicer
 * 🍂extends VectorGrid
 *
 * A `VectorGrid` for slicing up big GeoJSON or TopoJSON documents in vector
 * tiles, leveraging [`geojson-vt`](https://github.com/mapbox/geojson-vt).
 *
 * 🍂example
 *
 * ```
 * var geoJsonDocument = {
 * 	type: 'FeatureCollection',
 * 	features: [ ... ]
 * };
 *
 * L.vectorGrid.slicer(geoJsonDocument, {
 * 	vectorTileLayerStyles: {
 * 		sliced: { ... }
 * 	}
 * }).addTo(map);
 *
 * ```
 *
 * `VectorGrid.Slicer` can also handle [TopoJSON](https://github.com/mbostock/topojson) transparently:
 * ```js
 * var layer = L.vectorGrid.slicer(topojson, options);
 * ```
 *
 * The TopoJSON format [implicitly groups features into "objects"](https://github.com/mbostock/topojson-specification/blob/master/README.md#215-objects).
 * These will be transformed into vector tile layer names when styling (the
 * `vectorTileLayerName` option is ignored when using TopoJSON).
 *
 */

L.VectorGrid.Slicer = L.VectorGrid.extend({

	options: {
		// 🍂section
		// Additionally to these options, `VectorGrid.Slicer` can take in any
		// of the [`geojson-vt` options](https://github.com/mapbox/geojson-vt#options).

		// 🍂option vectorTileLayerName: String = 'sliced'
		// Vector tiles contain a set of *data layers*, and those data layers
		// contain features. Thus, the slicer creates one data layer, with
		// the name given in this option. This is important for symbolizing the data.
		vectorTileLayerName: 'sliced',

		extent: 4096,	// Default for geojson-vt
		maxZoom: 14  	// Default for geojson-vt
	},

	initialize: function(geojson, options) {
		L.VectorGrid.prototype.initialize.call(this, options);

		// Create a shallow copy of this.options, excluding things that might
		// be functions - we only care about topojson/geojsonvt options
		var slicerOptions = {};
		for (var i in this.options) {
			if (i !== 'rendererFactory' &&
				i !== 'vectorTileLayerStyles' &&
				typeof (this.options[i]) !== 'function'
			) {
				slicerOptions[i] = this.options[i];
			}
		}

		// Create worker with bundled dependencies
		this._worker = new SlicerWorker();

		// Send initial data to worker
		this._worker.postMessage(['slice', geojson, slicerOptions]);

	},

	_getVectorTilePromise: function(coords) {
		var _this = this;

		var p = new Promise(function waitForWorker(res) {
			_this._worker.addEventListener('message', function recv(m) {
				if (m.data.coords &&
				    m.data.coords.x === coords.x &&
				    m.data.coords.y === coords.y &&
				    m.data.coords.z === coords.z) {

					res(m.data);
					_this._worker.removeEventListener('message', recv);
				}
			});
		});

		this._worker.postMessage(['get', coords]);

		return p;
	},

});


L.vectorGrid.slicer = function (geojson, options) {
	return new L.VectorGrid.Slicer(geojson, options);
};

