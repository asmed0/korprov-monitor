var axios = require('axios');

function getLocationID(ssn, city, postCode, withPostCode = false) {
	var data = JSON.stringify({
		bookingSession: {
			socialSecurityNumber: ssn,
			licenceId: '5',
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
	});

	var config = {
		method: 'post',
		url: 'https://fp.trafikverket.se/boka/search-information',
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

	locationID = axios(config)
		.then(function (response) {
			if (!withPostCode) {
				for (i = 0; i < response.data.data.locations.length; i++) {
					if (response.data.data.locations[i].location.name === city) {
						console.log(
							`Found location in ${response.data.data.locations[i].location.name} with id ${response.data.data.locations[i].location.id}`
						);
						return response.data.data.locations[i].location.id;
					}
				}
			} else {
				for (i = 0; i < response.data.data.locations.length; i++) {
					//console.log(JSON.stringify(response.data.data.locations))
					if (
						response.data.data.locations[i].location.address.zipCode ===
						postCode
					) {
						console.log(
							`Found location in ${response.data.data.locations[i].location.name} with id ${response.data.data.locations[i].location.id} using postcode query`
						);
						return response.data.data.locations[i].location.id;
					}
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	return locationID;
}

module.exports = getLocationID;
