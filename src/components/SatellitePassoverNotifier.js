import React, { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const SatellitePassoverNotifier = ({ latitude, longitude }) => {
  const [username, setUsername] = useState('');
  const [notification, setNotification] = useState('');

  const handleNotify = async () => {
    const message = `User ${username} will be notified of the next satellite passover at latitude ${latitude} and longitude ${longitude}.`;

    try {
      const response = await axios.post('/api/notify', {
        username,
        latitude,
        longitude,
        message,
      });

      if (response.status === 201) {
        setNotification('Notification saved to database');
      } else {
        setNotification('Error saving notification');
      }
    } catch (error) {
      setNotification('Error saving notification');
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Satellite Passover Notifier</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <Button onClick={handleNotify}>Notify</Button>
          {notification && <p>{notification}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default SatellitePassoverNotifier;