import axios from 'axios';

const BASE_URL = 'https://cognify-production-e407.up.railway.app';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cognify_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cognify_token');
            localStorage.removeItem('cognify_user');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

// Central API Export
export const api = {
    // AUTH ROUTES
    async register(data: any) {
        const res = await apiClient.post('/api/auth/register', data);
        return res.data;
    },
    async login(email?: string, password?: string) {
        const res = await apiClient.post('/api/auth/login', { email, password });
        return res.data;
    },
    async forgotPassword(email: string) {
        const res = await apiClient.post('/api/auth/forgot-password', { email });
        return res.data;
    },
    async resetPassword(token: string, password: string) {
        const res = await apiClient.post('/api/auth/reset-password', { token, password });
        return res.data;
    },

    // USER ROUTES
    async getMe() {
        const res = await apiClient.get('/api/user/me');
        return res.data;
    },
    async updateProfile(data: any) {
        const res = await apiClient.patch('/api/user/me', data);
        return res.data;
    },

    // HEALTH ROUTES
    async getLatestHealth() {
        const res = await apiClient.get('/api/health/latest');
        return res.data;
    },
    async syncHealthData(data?: any) {
        // Keeping it optional parameter in case we just trigger a backend sync, or pass payload
        const res = await apiClient.post('/api/health/sync', data || {});
        return res.data;
    },
    async getHealthHistory() {
        // Retaining this for History page if applicable
        const res = await apiClient.get('/api/health/history');
        return res.data;
    },

    // MEDICINE ROUTES
    async getMedicineReminders() {
        const res = await apiClient.get('/api/medicine/reminders');
        return res.data;
    },
    async addMedicineReminder(data: { name: string, dosage: string, frequency: string, time: string }) {
        const res = await apiClient.post('/api/medicine/reminder', data);
        return res.data;
    },
    async updateMedicineStatus(id: string, data: { status: 'TAKEN' | 'MISSED' | 'PENDING', completedAt?: string }) {
        const res = await apiClient.put(`/api/medicine/reminder/${id}/status`, data);
        return res.data;
    },

    // EMERGENCY ROUTES
    async getEmergencyContacts() {
        const res = await apiClient.get('/api/emergency/contacts');
        return res.data;
    },
    async addEmergencyContact(data: { name: string, phoneNumber: string, relationship: string }) {
        const res = await apiClient.post('/api/emergency/contact', data);
        return res.data;
    },

    // GAMES/EXERCISES ROUTES
    async getDailyExercises() {
        const res = await apiClient.get('/api/v1/exercises/daily');
        return res.data;
    },
    async getExerciseDetails(id: string) {
        const res = await apiClient.get(`/api/v1/exercises/${id}`);
        return res.data;
    },
    async submitExerciseResult(data: { exerciseId: string, score: number }) {
        const res = await apiClient.post('/api/v1/exercises/submit', data);
        return res.data;
    },

    // CAREGIVER ROUTES
    async getCaregiverPatients() {
        const res = await apiClient.get('/api/caregiver/patients');
        return res.data;
    },
    async addCaregiver(data: {
        name: string;
        email: string;
        specialty: string;
        phoneNumber: string;
        hospitalName: string;
    }) {
        const res = await apiClient.post('/api/caregiver/add', data);
        return res.data;
    }
};
