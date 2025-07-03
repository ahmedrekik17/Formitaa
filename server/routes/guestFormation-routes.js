const {getGuestsByTraining,registerGuest} = require("../controllers/guestFormation-controller");


module.exports = (app) => {
app.post('/api/guest/register', registerGuest);
app.get('/api/guest/by-training/:trainingId', getGuestsByTraining);
}