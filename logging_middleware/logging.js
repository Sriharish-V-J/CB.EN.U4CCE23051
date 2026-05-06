const axios = require('axios');

const Log = async (stack, level, package, message) => {
    const logUrl = 'http://20.207.122.201/evaluation-service/logs';
    
    const logData = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: package.toLowerCase(),
        message: message
    };

    try {
        const response = await axios.post(logUrl, logData);
        console.log('Log sent successfully:', response.data.logID); //
        return response.data;
    } catch (error) {
        console.error('Failed to send log:', error.message);
    }
};

module.exports = { Log };