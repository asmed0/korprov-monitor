var axios = require('axios');
var getLocationID = require('./locationID');
var config = require('./config');

var startMonitor = async function () {
	//placeholders
	var freshstart = true;
	var startValue;
	var initialAvailable;
	var initialAvailableTime;
	var ssn = config.personnummer;
	var delay = config.delay;
	var webhook = config.webhook;
	var gearboxManual = config.manuell;
	var locationID = await getLocationID(
		config.personnummer,
		config.stad,
		config.postnummer,
		config.anvandpostnummer
	);

	await console.log(
		`Starting search for gearbox type ${
			gearboxManual ? 'manual' : 'automatic'
		} with ssn ${ssn} at location ${locationID}`
	);
	setInterval(() => {
		var data = JSON.stringify({
			bookingSession: {
				socialSecurityNumber: ssn,
				licenceId: 5,
				bookingModeId: 0,
				ignoreDebt: false,
				ignoreBookingHindrance: false,
				examinationTypeId: 0,
				excludeExaminationCategories: [],
				rescheduleTypeId: 0,
				paymentIsActive: false,
				paymentReference: null,
				paymentUrl: null,
			},
			occasionBundleQuery: {
				startDate: '2021-02-25T23:00:00.000Z',
				locationId: locationID,
				nearbyLocationIds: [],
				languageId: 13,
				vehicleTypeId: (gearboxManual ? 2 : 4),
				tachographTypeId: 1,
				occasionChoiceId: 1,
				examinationTypeId: 12,
			},
		});

		var config = {
			method: 'post',
			url: 'https://fp.trafikverket.se/boka/occasion-bundles',
			headers: {
				Connection: 'keep-alive',
				Pragma: 'no-cache',
				'Cache-Control': 'no-cache',
				'sec-ch-ua':
					'"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
				Accept: 'application/json, text/javascript, */*; q=0.01',
				'X-Requested-With': 'XMLHttpRequest',
				'sec-ch-ua-mobile': '?0',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
				'Content-Type': 'application/json',
				Origin: 'https://fp.trafikverket.se',
				'Sec-Fetch-Site': 'same-origin',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Dest': 'empty',
				Referer: 'https://fp.trafikverket.se/boka/',
				'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8',
			},
			data: data,
		};

		axios(config)
			.then(function (response) {
				//initialization
				if (freshstart === true) {
					initialAvailable = response.data.data[0].occasions[0].date;
					start = response.data.data[0].occasions[0].date;
					initialAvailableTime = response.data.data[0].occasions[0].time;
					freshstart = false;
				} else if (
					initialAvailable !== response.data.data[0].occasions[0].date &&
					initialAvailableTime !== response.data.data[0].occasions[0].time &&
					startValue !== response.data.data[0].occasions[0].date
				) {
					var axios = require('axios');
					var data = JSON.stringify({
						content: `New time available on ${response.data.data[0].occasions[0].date} in ${response.data.data[0].occasions[0].locationName} at ${response.data.data[0].occasions[0].time}`,
						embeds: null,
					});

					var config = {
						method: 'post',
						url: webhook,
						headers: {
							'Content-Type': 'application/json',
						},
						data: data,
					};
					axios(config)
						.then(
							console.log(
								`New time sent to webhook on ${response.data.data[0].occasions[0].date} in ${response.data.data[0].occasions[0].locationName} at ${response.data.data[0].occasions[0].time}`
							),
							(initialAvailable = response.data.data[0].occasions[0].date),
							(initialAvailableTime = response.data.data[0].occasions[0].time)
						)
						.catch(function (error) {
							console.log(error);
						});
				} else {
					console.log('No new times availabe');
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}, delay);
};

startMonitor();
