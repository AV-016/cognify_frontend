const BASE_URL = "https://cognify-production-e407.up.railway.app";

const getToken = () => localStorage.getItem("cognify_token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

// AUTH
export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const register = async (name: string, email: string, password: string, age: number, sex: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, age, sex })
  });
  return res.json();
};

// HEALTH
export const getLatestHealth = async () => {
  const res = await fetch(`${BASE_URL}/api/health/latest`, { headers: headers() });
  return res.json();
};

export const syncHealth = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/health/sync`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getHealthHistory = async () => {
  const res = await fetch(`${BASE_URL}/api/health/history`, { headers: headers() });
  return res.json();
};

// MEDICINE
export const getMedicineReminders = async () => {
  const res = await fetch(`${BASE_URL}/api/medicine/reminders`, { headers: headers() });
  return res.json();
};

export const addMedicineReminder = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/medicine/reminder`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateMedicineStatus = async (id: string, status: string) => {
  const res = await fetch(`${BASE_URL}/api/medicine/reminder/${id}/status`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ status, completedAt: new Date().toISOString() })
  });
  return res.json();
};

// EMERGENCY CONTACTS
export const getEmergencyContacts = async () => {
  const res = await fetch(`${BASE_URL}/api/emergency/contacts`, { headers: headers() });
  return res.json();
};

export const addEmergencyContact = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/emergency/contact`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// CAREGIVERS
export const getCareProviders = async () => {
  const res = await fetch(`${BASE_URL}/api/caregiver/patients`, { headers: headers() });
  return res.json();
};

export const addCareProvider = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/caregiver/add`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// EXERCISES
export const getDailyExercises = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/exercises/daily`, { headers: headers() });
  return res.json();
};

export const submitExercise = async (exerciseId: string, score: number) => {
  const res = await fetch(`${BASE_URL}/api/v1/exercises/submit`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ exerciseId, score })
  });
  return res.json();
};

// USER
export const getUser = async () => {
  const res = await fetch(`${BASE_URL}/api/user/me`, { headers: headers() });
  return res.json();
};

export const updateUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/user/me`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};
