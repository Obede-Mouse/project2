/**
 *
 * These are a collection of Geometry functions under the namespace "geom"
 *
 * Well, it is good enough for what I currently need, I'm not aiming to build an exhaustive library.
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @access      public
 *
 */

var geom = {

  /**
   * Distance Formula
   */
  getDistance: function(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  },

  /**
   * Mid-Point Formula
   */
  getMidPoint: function(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  },

  /**
   * Returns an object containing all bounding-box related information
   * relative to an SVG coordinate system, i.e. top-left is 0,0
   * @param w
   * @param h
   * @param cx (Optional)
   * @param cy (Optional)
   * @param undefined (Optional) (Do not pass in this parameter)
   * @return {Object}
   */
  getBoundingBox: function(w, h, cx, cy, undefined) {
    if (cx === undefined && cy === undefined) {
      cx = w / 2;
      cy = h / 2;
    }
    return {
      width: w,
      height: h,
      center: {
        x: cx,
        y: cy
      },
      top: {
        x: cx,
        y: cy - h / 2
      },
      bottom: {
        x: cx,
        y: cy + h / 2
      },
      left: {
        x: cx - w / 2,
        y: cy
      },
      right: {
        x: cx + w / 2,
        y: cy
      },
      topLeft: {
        x: cx - w / 2,
        y: cy - h / 2
      },
      topRight: {
        x: cx + w / 2,
        y: cy - h / 2
      },
      bottomLeft: {
        x: cx - w / 2,
        y: cy + h / 2
      },
      bottomRight: {
        x: cx + w / 2,
        y: cy + h / 2
      }
    };
  },

  /**
   * Check if point C is the mid-point of A and B
   */
  isMidPoint: function(a, b, c) {
    return geom.coordinatesAreEqual(c, geom.getMidPoint(a, b));
  },

  /**
   * Gradient Formula (i.e. Slope)
   */
  getSlope: function(a, b) {
    return (b.y - a.y) / (b.x - a.x);
  },


  /**
   * Get the angle of the slope produced by coordinates A and B.
   * It convert the Inverse-Tangent of the slope to Degrees and returns it.
   */
  getAngle: function(a, b) {
    return geom.toDegrees(Math.atan(geom.getSlope(a, b)));
  },


  /**
   * Accepts any number of coordinate objects as arguments and return true they are all collinear.
   * i.e. all points lie on the same straight line.
   */
  isCollinear: function() {
    var a = arguments;
    if (a.length <= 1) {
      // hmm... what to do here, should we throw an error?
    } else {
      var s1 = geom.getSlope(a[0], a[1]); // get the first slope

      for (var i = 1, j = a.length - 1; i < j; i++) {
        var s2 = geom.getSlope(a[i], a[i + 1]);

        if (s1 != s2) {
          return false;
        }

        return true;
      }
    }
  },


  /**
   *
   * Gets the number of distinct diagonals of a polygon
   *
   * @author      Terry Young <terryyounghk [at] gmail.com>
   * @access      public
   *
   * @param       v
   *                number of vertices of the polygon
   *
   */
  getDiagonals: function(v) {
    return (v * (v - 3)) / 2;
  },


  /**
   * This function returns the x,y coordinates where two lines L1 and L2 intersect, given that
   * L1 is defined by two points A(x1,y1) and B(x2,y2), and L2 is defined by two points C(x3,y3) and D(x4,y4).
   *
   * "g" is an optional parameter.
   *
   * When g is false, then our aim is to return a line-segment intersection,
   * (i.e. L1 and L2 are line segments, and may or may not intersect even when they are parallel)
   * where as when true, we find the line-line intersection.
   * (i.e. L1 and L2 are infinitely long lines, that the only case they do not collide is when they are parellel,
   * and that if there's an intersection, it does not necessarily situate at the point within any of the two line segments)
   *
   * @credits       This is a modified version inspired by
   *                http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
   */
  getIntersection: function(a, b, c, d, g) {
    var s1_x = b.x - a.x,
      s1_y = b.y - a.y,
      s2_x = d.x - c.x,
      s2_y = d.y - c.y;

    var s = (-s1_y * (a.x - c.x) + s1_x * (a.y - c.y)) / (-s2_x * s1_y + s1_x * s2_y),
      t = (s2_x * (a.y - c.y) - s2_y * (a.x - c.x)) / (-s2_x * s1_y + s1_x * s2_y);

    g = !! g; // convert to boolean

    // if these are NaN, we've found a collinear case
    // if any of these are +Inifinity or -Infinity,
    var x = a.x + (t * s1_x),
      y = a.y + (t * s1_y);


    if ((g || (s >= 0 && s <= 1 && t >= 0 && t <= 1))) { // && isFinite(x) && isFinite(y)) {

      // Collision detected
      return {
        x: x,
        y: y
      };
    }

    return false; // No collision
  },

  /**
   * Helper function: returns an {x: ..., y: ...} object by accepting two values
   */
  point: function(x, y) {
    return {
      'x': x,
      'y': y
    };
  },


  /**
   * Helper function: takes in a coordinate and returns a formatted string. e.g. 5,-11
   * "cts" means Coordinates To String
   */
  cts: function(c) {
    return [c.x, c.y].join(',');
  },

  /**
   * Helper function: takes in two {x: ... y: ...} objects and see if they are equal
   */
  coordinatesAreEqual: function(a, b) {
    return (a.x === b.x && a.y === b.y);
  },

  /**
   * Helper function: expects a Radian and converts to Degress
   */
  toDegrees: function(rad) {
    return rad * 180 / Math.PI;
  },

  /**
   * Helper function: expects a Radian and converts to Degress
   */
  toRadians: function(deg) {
    return deg * Math.PI / 180;
  }

};


/**
 *
 * This is an extension to RaphaelJS for drawing Arcs
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @access      public
 *
 */

window.RaphaelExtensions = {
	ca: {

		/**
		 * @usage make an arc at 50,50 with a radius of 30 that grows from 0 to 40 of 100 with a bounce
		 * var my_arc = archtype.path().attr({
		 *      "stroke": "#f00",
		 *      "stroke-width": 14,
		 *      arc: [50, 50, 0, 100, 50]
		 * });
		 *
		 * my_arc.animate({
		 *      arc: [50, 50, amount, 100, 50]
		 * }, 1500, "bounce");
		 *
		 * @param cx
		 * @param cy
		 * @param value
		 * @param total
		 * @param radius
		 * @param startingIncline
		 * @param endingIncline
		 * @return {Object}
		 */
		gaugeArc: function (cx, cy, value, total, radius, startingIncline, endingIncline) {
			startingIncline = (startingIncline === undefined)
				? 0
				: Math.max(-89, Math.min(89, startingIncline));
			endingIncline = (startingIncline === undefined)
				? 180 - startingIncline
				: Math.max(91, Math.min(269, endingIncline));

			var alpha = Math.abs(endingIncline - startingIncline) / total * value,
				a = (180 - alpha) * Math.PI / 180,
				x = cx + radius * Math.cos(a),
				y = cy - radius * Math.sin(a),
				path;

			path = [
				["M", cx - radius, cy],
				["A", radius, radius,
					0,
					+(alpha > 180),
					1,
					x,
					y]
			];
			return {
				path: path
			};
		},

		gaugeArcZone: function (cx, cy, fromPercentage, toPercentage, radius, startingIncline, endingIncline) {
			var arc = this.paper.path().attr({
					gaugeArc: [cx, cy, 100, 100, radius, startingIncline, endingIncline]
				}),
				length = arc.getTotalLength(),
				path = arc.getSubpath(length * fromPercentage, length * toPercentage);

			arc.remove();

			return {
				path: path
			}
		}
	}
};
