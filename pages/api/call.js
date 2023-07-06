const { v4: uuidv4 } = require('uuid');

// Database simulation (replace with your actual database implementation)
const calls = new Map();

export default function handler(req, res) {
    if (req.method === 'POST') {
        const uniqueCode = uuidv4();
        const callData = {
            code: uniqueCode,
            status: 'active',
            participants: [],
        };
        calls.set(uniqueCode, callData);
        res.status(201).json({ code: uniqueCode });
    } else if (req.method === 'GET') {
        const { code } = req.query;
        const call = calls.get(code);

        if (!call || call.status !== 'active') {
            res.status(404).json({ error: 'Call not available' });
        } else {
            res.status(200).json(call);
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
