var original = new ol.style.Style({
	stroke: new ol.style.Stroke({
		width: 4,
		color: 'green'
	}),
})

var changed = new ol.style.Style({
	stroke: new ol.style.Stroke({
		width: 8,
		color: 'green'
	}),
	fill: new ol.style.Fill(
		{
			color: 'green'
		}
	)
});

var vector = new ol.layer.Vector(
	{
		name: 'sample',
		source: new ol.source.Vector(),
		style: original
	})


var popup = new ol.Overlay.Popup (
	{	popupClass: "default", 
		closeBox: true,
		onshow: function(){ console.log("You opened the box"); },
		onclose: function(){ console.log("You close the box"); },
		positioning: 'auto',
		autoPan: true,
		autoPanAnimation: { duration: 250 }
	});

	
var map = new ol.Map
	({
		target: 'map',
		view: new ol.View
			({
				zoom: 3,
				center: [0, 0]

			}),
		layers:
			[new ol.layer.Tile({ source: new ol.source.OSM() }),
				vector
			],
		overlays: [popup]
	});

var mainBar = new ol.control.Bar();
map.addControl(mainBar);


var nested = new ol.control.Bar ({ toggleOne: true, group:true });
mainBar.addControl (nested);


//----------------------------------------------------------------------------
//interactions
var select = new ol.interaction.Select({
	hitTolerance: 1,
	condition: ol.events.condition.singleClick
});
map.addInteraction(select);
select.setActive(false);

var draw = new ol.interaction.Draw({
	source: vector.getSource(),
	type: 'Polygon',
});
map.addInteraction(draw);
select.setActive(false);

//--------------------------------------------------------------------------
//toggles

var actice = true;

var selection = new ol.control.Toggle (
	{	
		html: '<i class="fa fa-hand-pointer-o"></i>',
		className: "selection",
		title: "Select",
		active: true,
		interaction: new ol.interaction.Select({
			hitTolerance: 1,
			condition: ol.events.condition.singleClick
		}),
		onToggle: function (active) {
			if(active) {
				select.setActive(true);
			} else {
				select.setActive(false);
			}
		}
	});
nested.addControl ( selection );

//----------------------------------------------------------------------------

var drawing = new ol.control.Toggle(
	{
		html: '<i class="fa fa-pencil"></i>',
		className: "drawing",
		title: "Drawing",
		interaction: draw,
		onToggle: function (active) {
			if (active) {
				draw.on(['drawend'], function(evt) {
					var features = evt.feature;
					console.log(evt);
					var content = "";
					content += `<label>ID :</label><input type="text" id="input"><br>
					<button style="margin-left:100px" onclick="${content += features.set('id', $("input").val())}">SET</button><br>`;
					popup.show(features.getGeometry().getFirstCoordinate(), content); 
				});
			}else{
				draw.setActive(false);
				select.setActive(false);
			}
		}
	});

nested.addControl(drawing)


//---------------------------------------------------------------


var popuping = new ol.control.Toggle (
	{	html: '<i class="fa fa-question-circle "></i>',
		className: "popup",
		title: "Popup",
		interaction: select, 
		onToggle: function(active) {
			if (active) {
				select.getFeatures().on(['add'], function(e) {
					var features = e.element;
					var content = "";
					content += features.get('id');
					popup.show(features.getGeometry().getFirstCoordinate(), content); 
				});
			} else {
					
			}
		}
	});
nested.addControl ( popuping );





