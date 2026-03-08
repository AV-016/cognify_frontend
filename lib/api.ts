const BASE_URL = "";

const getToken = () => localStorage.getItem("cognify_token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

export const api = {
  // AUTH
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (name: string, email: string, password: string, age: number, sex: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, age, sex })
    });
    return res.json();
  },

  forgotPassword: async (email: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  resetPassword: async (token: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    return res.json();
  },

  // USER
  getMe: async () => {
    const res = await fetch(`${BASE_URL}/api/user/me`, { headers: headers() });
    if (res.status === 401) {
      localStorage.removeItem("cognify_token");
      localStorage.removeItem("cognify_user");
      return null;
    }
    return res.json();
  },

  updateMe: async (data: any) => {
    const res = await fetch(`${BASE_URL}/api/user/me`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // HEALTH
  getLatestHealth: async () => {
    const res = await fetch(`${BASE_URL}/api/health/latest`, { headers: headers() });
    return res.json();
  },

  syncHealth: async (data: any) => {
    const res = await fetch(`${BASE_URL}/api/health/sync`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getHealthHistory: async () => {
    const res = await fetch(`${BASE_URL}/api/health/history`, { headers: headers() });
    return res.json();
  },

  // MEDICINE
  getMedicineReminders: async () => {
    const res = await fetch(`${BASE_URL}/api/medicine/reminders`, { headers: headers() });
    return res.json();
  },

  addMedicineReminder: async (data: any) => {
    const res = await fetch(`${BASE_URL}/api/medicine/reminder`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateMedicineStatus: async (id: string, status: string) => {
    const res = await fetch(`${BASE_URL}/api/medicine/reminder/${id}/status`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ status, completedAt: new Date().toISOString() })
    });
    return res.json();
  },

  // EMERGENCY CONTACTS
  getEmergencyContacts: async () => {
    const res = await fetch(`${BASE_URL}/api/emergency/contacts`, { headers: headers() });
    return res.json();
  },

  addEmergencyContact: async (data: any) => {
    const res = await fetch(`${BASE_URL}/api/emergency/contact`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // CAREGIVERS
  getCareProviders: async () => {
    const res = await fetch(`${BASE_URL}/api/caregiver/patients`, { headers: headers() });
    return res.json();
  },

  addCareProvider: async (data: any) => {
    const res = await fetch(`${BASE_URL}/api/caregiver/add`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // EXERCISES
  getDailyExercises: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/exercises/daily`, { headers: headers() });
    return res.json();
  },

  submitExercise: async (exerciseId: string, score: number) => {
    const res = await fetch(`${BASE_URL}/api/v1/exercises/submit`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ exerciseId, score })
    });
    return res.json();
  },

  // EMERGENCY
  getEmergency: async () => {
    const res = await fetch(`${BASE_URL}/api/emergency/contacts`, { headers: headers() });
    return res.json();
  }
};
