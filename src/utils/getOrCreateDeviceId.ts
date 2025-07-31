export const getOrCreateDeviceId = (): string => {
    const existingId = localStorage.getItem("device_id");
    if (existingId) return existingId;
  
    const newId = crypto.randomUUID(); // Use UUID for uniqueness
    localStorage.setItem("device_id", newId);
    return newId;
  };
  