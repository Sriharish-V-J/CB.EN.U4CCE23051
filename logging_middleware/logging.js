const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BEARER_TOKEN = process.env.BEARER_TOKEN;

const Log = async (stack, level, package, message) => {
    const logUrl = 'http://20.207.122.201/evaluation-service/logs';

    const logData = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: package.toLowerCase(),
        message: message
    };

    try {
        const response = await axios.post(logUrl, logData, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Log sent successfully:', response.data.logID);
        return response.data;
    } catch (error) {
        console.error('Failed to send log:', error.message);
    }
};

module.exports = { Log };