function error(message) {
    return {
        success: false,
        error: message
    }
}

function success(data) {
    return {
        success: true,
        data: data
    }
}

module.exports = {
    error, success
}
