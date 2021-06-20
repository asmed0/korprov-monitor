config = {
  personnummer: "19810618-3232", //needs to be with dash
  manuell: true, //set to false if you're doing automatic gearbox
  webhook:
    "https://discord.com/api/webhooks/814846909356703774/iB2O3xI7iGZSB4NyQHawJoAAVTYjK67GJiNJHezzfljq1HP7o1KNm9PsbP3_ydmP5ri7",
  anvandpostnummer: false, //if theres more than one office in ur city set to true so it chooses the one u want
  delay: 3000, //in milliseconds
  locations: [
    { stad: "Lund", postnummer: "227 61" },
    { stad: "Vänersborg", postnummer: "421 31" },
  ],
};

module.exports = config;
