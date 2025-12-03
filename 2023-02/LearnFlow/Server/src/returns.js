
const error = (error) => { return { success: false, error: error }; };
const success = (data) => { return { success: true, data: data }; };

module.exports = {
    error, success,    

    userNotFound: error('User not found'),
    invalidPassword: error('Invalid password'),
    invalidToken: error('Invalid token'),
    invalidUsername: error('Invalid username'),
    invalidEmail: error('Invalid email'),
    accountExists: error('User already exists'),
    unknownError: error('Unknown error'),
    invalidArguments: error('Invalid arguments')
}
