// src/components/RateCalculation.js
import React, { useState } from 'react';
import axios from 'axios';

const RateCalculation = () => {
    const [roomTypeId, setRoomTypeId] = useState('');
    const [rate, setRate] = useState(null);

    const handleCalculate = async () => {
        const response = await axios.get(`http://localhost:5050/api/rate/${roomTypeId}`);
        setRate(response.data.price);
    };

    return (
        <div>
            <h2>Rate Calculation</h2>
            <input
                type="number"
                placeholder="Room Type ID"
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                required
            />
            <button onClick={handleCalculate}>Calculate Rate</button>
            {rate !== null && <h3>Rate: ${rate}</h3>}
        </div>
    );
};

export default RateCalculation;