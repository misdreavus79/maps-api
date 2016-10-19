const options = {
					center: {lat: 37.540, lng: -96.546},
					zoom: minZoomLevel,
					mapTypeControl: false,
					streetViewControl: false,
					scrollwheel: false,
					styles: [
						{
							featureType: 'water',
							elementType: 'geometry',
							stylers: [
								{ color: '#fbf1e6' },
								{ visibility: 'simplified' }
							]
						},
						{
							featureType: 'road.highway',
							elementType: 'geometry',
							stylers: [
								{ color: '#FFFFFF' },
								{ visibility: 'on' }
							]
						}, 
						{
							featureType: 'road',
							elementType: 'labels',
							stylers: [
								{ visibility: 'off' }
							]
						},
						{
							featureType: 'administrative.locality',
							elementType: 'labels.text',
							stylers: [
								{ visibility: 'simplified' },
								{ color: '#f186ce' }
							]
						}, 
						{
							featureType: 'administrative.province',
							elementType: 'labels.text',
							stylers: [
								{ visibility: 'off' },
							]
						},
						{
							featureType: 'administrative.country',
							elementType: 'labels.text',
							stylers: [
								{ visibility: 'off' },
							]
						},
						{
							featureType: 'landscape',
							elementType: 'all',
							stylers: [
								{ visibility: 'on' },
								{ color: '#f6f6f6' }
							]
						}, 
						{
							featureType: 'poi',
							elementType: 'all',
							stylers: [
								{ visibility: 'on' },
								{ color: '#ffffff' }
							]
						}
					]
				};

export default options;