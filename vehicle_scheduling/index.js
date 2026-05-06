const express = require('express');
const { Log } = require('../logging_middleware/logging');
const app = express();
const axios = require('axios');
const { getBestSchedule } = require('./scheduler');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BEARER_TOKEN = process.env.BEARER_TOKEN;

const BASE_URL = 'http://20.207.122.201/evaluation-service';

app.get('/scheduler', async (req, res) => {
    try {
        await Log("backend", "info", "controller", "Starting maintenance scheduling process");
        
        // 1. Fetch Depots and Vehicles
        const [depotsRes, vehiclesRes] = await Promise.all([
            axios.get(`${BASE_URL}/depots`, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }),
            axios.get(`${BASE_URL}/vehicles`, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
        ]);

        const depots = depotsRes.data.depots;
        const tasks = vehiclesRes.data.vehicles;

        console.log(`Fetched ${depots.length} depots and ${tasks.length} vehicles`);

        // 2. Process the Scheduling Logic
        const results = depots.map(depot => {
            const outcome = getBestSchedule(tasks, depot.MechanicHours);
            return {
                depotID: depot.ID,
                maxHours: depot.MechanicHours,
                totalImpactScore: outcome.totalImpact,
                selectedTasks: outcome.tasks
            };
        });

        await Log("backend", "info", "domain", "Scheduling optimization complete");

        // 3. SEND THE RESPONSE
        res.json({
            success: true,
            data: results
        });

    } catch (error) {
        await Log("backend", "error", "controller", `Scheduler failed: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3001, () => {
    console.log('Scheduler running on port 3001');
});