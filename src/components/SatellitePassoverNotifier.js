import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"


const SatellitePassoverNotifier = () => {
  const [username, setUsername] = useState('');
  const [notification, setNotification] = useState('');

  const handleNotify = () => {
    // Placeholder for actual notification logic
    setNotification(`User ${username} will be notified of the next satellite passover.`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Satellite Passover Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-foreground">
            Username:
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        {notification && <p className="mt-2 text-green-600">{notification}</p>}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleNotify}>
          Notify Me
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SatellitePassoverNotifier;