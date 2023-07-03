
function handleError(err) {
    if (err) {
        console.error(err.message);
        return true;
    } else return false;
}

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
    handleError,
    success, error
};
