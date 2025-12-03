
module.exports = {
    success: (data) => {
        return {
            success: true,
            data: data
        }
    },
    error: (message) => {
        return {
            success: false,
            message: message
        }
    }
}
