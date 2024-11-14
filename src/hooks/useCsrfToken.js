import { useEffect } from 'react';
import axios from 'axios';

const useCsrfToken = () => {
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/csrf_token/', { withCredentials: true });
                const csrfToken = response.data.csrfToken;
                // Store the CSRF token in localStorage for use in API requests
                localStorage.setItem('csrfToken', csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);
};

export default useCsrfToken;
