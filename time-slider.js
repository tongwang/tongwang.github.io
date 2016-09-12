L.Control.YearSliderControl = L.Control.extend({
    options: {
        position: 'topright',
        layers: null,
        timeAttribute: 'time',
        maxValue: -1,
        minValue: 0
    },

    initialize: function (options) {
        if (options.layers) {
            options.layers = options.layers.sort(function(a, b){return a.options["year"]-b.options["year"]});
        }
        L.Util.setOptions(this, options);
    },

    // Sets the position of the control
    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
        this.startSlider();
        return this;
    },

    onAdd: function (map) {
        this.options.map = map;

        // Create a control sliderContainer with a jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'slider', this._container);
        $(sliderContainer).append('<div id="leaflet-slider" style="width:200px"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="margin-top:13px; text-align:center;"></div></div>');
        //Prevent map panning/zooming while using the slider
        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
        });

        var options = this.options;

        return sliderContainer;
    },

    onRemove: function (map) {
        $('#leaflet-slider').remove();
    },

    slide_handler: function (e, ui) {
        $('#slider-timestamp').html("<b>Year " + $("#leaflet-slider").slider("value") + "</b>");
        var map = _options.map;
        var layers = _options.layers;

        var year = $("#leaflet-slider").slider("value");
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].options["year"] > year) {
                layers[i].setOpacity(0);
            } else {
                if (i+1 < layers.length && layers[i+1].options["year"] > year) {
                    layers[i].setOpacity(1);
                } else if (i+1 >= layers.length) {
                    layers[i].setOpacity(1);
                } else {
                    layers[i].setOpacity(0);
                }
            }
        }
    },

    startSlider: function () {
        _options = this.options;
        _extractTimestamp = this.extractTimestamp
        var index_start = _options.minValue;
        $("#leaflet-slider").slider({
            value: _options.value,
            min: _options.minValue,
            max: _options.maxValue,
            step: 1,
            slide: this.slide_handler
        });
        
        // display initial year label and layers
        this.slide_handler();
    }
});

L.control.yearSliderControl = function (options) {
    return new L.Control.YearSliderControl(options);
};
