

L.SVG.Tile = L.SVG.extend({

	initialize: function (tileCoord, tileSize, options) {
		L.SVG.prototype.initialize.call(this, options);
		this._tileCoord = tileCoord;
		this._size = tileSize;

		this._initContainer();
		this._container.setAttribute('width', this._size.x);
		this._container.setAttribute('height', this._size.y);
		this._container.setAttribute('viewBox', [0, 0, this._size.x, this._size.y].join(' '));
		if (options.interactive) {
			this._container.style.pointerEvents = 'auto';
		}
		this._layers = {};
		if (options.style) {
			for (let styleName in options.style) {
				this._container.style[styleName] = options.style[styleName];
			}
		}
	},

	getCoord: function () {
		return this._tileCoord;
	},

	getContainer: function () {
		return this._container;
	},

	onAdd: L.Util.falseFn,

	addTo: function (map) {
		this._map = map;
		if (this.options.interactive) {
			for (var i in this._layers) {
				var layer = this._layers[i];
				// By default, Leaflet tiles do not have pointer events.
				layer._path.style.pointerEvents = 'auto';
				this._map._targets[L.stamp(layer._path)] = layer;
			}
		}
	},
	isTextOverlapping(svgElement, tempText, buffer, type) {
		// 将临时文本元素添加到SVG中，但不显示在屏幕上
		svgElement.appendChild(tempText);

		// 获取临时文本元素的边界框
		var tempTextBBox = tempText.getBBox();

		// 遍历SVG中的所有文本元素，检查是否与临时文本元素有重叠
		var textElements = svgElement.getElementsByClassName(type);
		for (var i = 0; i < textElements.length; i++) {
			var textElement = textElements[i];
			if (textElement === tempText) {
				continue; // 跳过与自身比较
			}

			// 获取当前文本元素的边界框
			var svgBBox = svgElement.getBBox()
			var textBBox = textElement.getBBox();
			textBBox.width += buffer
			textBBox.height += buffer
			// 检查两个文本元素的边界框是否有重叠
			if ((tempTextBBox.x < textBBox.x + textBBox.width &&
				tempTextBBox.x + tempTextBBox.width > textBBox.x &&
				tempTextBBox.y < textBBox.y + textBBox.height &&
				tempTextBBox.y + tempTextBBox.height > textBBox.y)
				|| (tempTextBBox.x + tempTextBBox.width > svgBBox.x + svgBBox.width || tempTextBBox.y + tempTextBBox.height > svgBBox.y + svgBBox.height
					|| tempTextBBox.x < 0 || tempTextBBox.y < 0)
			) {
				// 有重叠，返回true
				tempText.setAttribute('visibility', 'hidden');
				if (tempText.textContent) {
					if (tempText.textContent > textElement.textContent) {
						svgElement.removeChild(textElement);
					} else {
						svgElement.removeChild(tempText);
					}
				}

				return true;
			}
		}

		// 没有重叠，返回false
		svgElement.removeChild(tempText);
		return false;
	},

	removeFrom: function (map) {
		if (this.options.interactive) {
			for (var i in this._layers) {
				var layer = this._layers[i];
				delete this._map._targets[L.stamp(layer._path)];
			}
		}
		delete this._map;
	},

	_initContainer: function () {
		L.SVG.prototype._initContainer.call(this);
		var rect = L.SVG.create('rect');
	},

	/// TODO: Modify _initPath to include an extra parameter, a group name
	/// to order symbolizers by z-index

	_addPath: function (layer) {
		this._rootGroup.appendChild(layer._path);
		this._layers[L.stamp(layer)] = layer;
	},

	_updateIcon: function (layer) {
		const icon = layer.options.icon,
			iconOptions = icon.options,
			point = L.point(iconOptions.iconSize),
			anchor = iconOptions.iconAnchor || point && point.divideBy(2, true),
			subtract = layer._point.subtract(anchor)
		if (iconOptions.iconUrl) {
			const path = layer._path = L.SVG.create('image');
			if (iconOptions.className) {
				path.classList.add(iconOptions.className);
			}
			path.setAttribute('x', subtract.x);
			path.setAttribute('y', subtract.y);
			path.setAttribute('width', point.x + 'px');
			path.setAttribute('height', point.y + 'px');
			path.setAttribute('href', iconOptions.iconUrl);
			if (iconOptions.rotationAngle) {
				path.style.transform = "rotate(" + iconOptions.rotationAngle + "deg)"
				path.style.transformOrigin = (subtract.x + point.x / 2) + "px " + (subtract.y + point.y / 2) + "px"
			}
			if (iconOptions.className && !!iconOptions.overlap) {
				this.isTextOverlapping(this._container, path, 5, iconOptions.className);
			}
		} else if (iconOptions.text) {
			const path = layer._path = L.SVG.create("text")
			path.classList.add(iconOptions?.className);
			path.setAttribute('x', subtract.x);
			path.setAttribute('y', subtract.y);
			path.textContent = iconOptions.text;
			path.setAttribute('font-family', 'Arial');
			path.setAttribute('font-size', '13');
			path.setAttribute('fill', 'black');
			if (iconOptions.className && !!iconOptions.overlap) {
				this.isTextOverlapping(this._container, path, 30, iconOptions.className);
			}
		}
		// var path = layer._path = L.SVG.create('image'),
		// 	icon = layer.options.icon,
		// 	options = icon.options,
		// 	size = L.point(options.iconSize),
		// 	anchor = options.iconAnchor ||
		// 		size && size.divideBy(2, true),
		// 	p = layer._point.subtract(anchor);
		// path.setAttribute('x', p.x);
		// path.setAttribute('y', p.y);
		// path.setAttribute('width', size.x + 'px');
		// path.setAttribute('height', size.y + 'px');
		// path.setAttribute('href', options.iconUrl);
	}
});


L.svg.tile = function (tileCoord, tileSize, opts) {
	return new L.SVG.Tile(tileCoord, tileSize, opts);
}

