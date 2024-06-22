const BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiRequest = async(endpoint, method = 'GET', body = null, headers = {}) => {
    const config = {
        method,
        headers: {
            'Content-Type' : 'application/json',
            ...headers
        }
    }

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, config);
        const data =  await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }
        return {
            ok: true,
            data
        };
    } catch (error) {
        return {
            ok: false,
            message: error.message
        }
    }
} 

export default apiRequest;