function success(data) {
    return {
        success: true,
        data: data
    }
}

function error(error) {
    return {
        success: false,
        error: error
    }
}

module.exports = {
    success, error,
    invalidArgs: error('Invalid arguments'),
    emailInUse: error('Email already in use'),
    chatAlreadyExists: error('A chat with that name already exists'),
    loginFailed: error('Invalid email or password'),
    invalidToken: error('Invalid token'),
    notLoggedIn: error('You need to be logged in to perform this action'),
    notOwner: error('You need to be the owner of this chat to perform this action')
};
