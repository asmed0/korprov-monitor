config = {
	personnummer: '20011102-XXX', //needs to be with dash
	stad: 'Vänersborg', //Needs to be exact
	postnummer: '', //postcode of the postoffice, not ur personal
	manuell: true, //set to false if you're doing automatic gearbox
	webhook: 'https://discord.com/api/webhooks/',
	anvandpostnummer: false, //if theres more than one office in ur city set to true so it chooses the one u want
	delay: 3000, //in milliseconds
};

module.exports = config;
