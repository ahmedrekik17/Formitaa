const {register, login, logout, getAllUsers, deleteAll,deleteOneUser, updateUser, getLoggedUser} = require('../controllers/user-controller')


module.exports = (app) => {
app.post('/api/register',register);
app.post('/api/login',login);
app.post('/api/logout', logout)
app.get('/api/users',getAllUsers);
app.get('/api/loggeduser',getLoggedUser);

app.delete('/api/delete',deleteAll);
app.delete('/api/user/:id', deleteOneUser);
app.put('/api/user/:id',updateUser)

}
