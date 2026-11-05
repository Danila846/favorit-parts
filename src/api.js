const API_URL = '/api/price';
const API_KEY = import.meta.env.VITE_API_KEY;

async function request(params) {
	const query = new URLSearchParams({ key: API_KEY, ...params });

	let response;
	try {
		response = await fetch(`${API_URL}?${query}`);
	} catch {
		throw new Error('Не удалось связаться с сервером. Проверьте подключение к сети.');
	}
	if (!response.ok) {
		throw new Error(`Ошибка сервера: ${response.status}`);
	}

	let data;
	try {
		data = await response.json();
	} catch {
		throw new Error('Сервер вернул некорректный ответ.');
	}
	if (data.error) {
		throw new Error(Array.isArray(data.error) ? data.error.join('; ') : String(data.error));
	}

	return (data.goods || []).filter((item) => item && item.brand);
}

export function fetchGoodsByNumber(number) {
	return request({ number });
}

export function fetchAnalogues(number, brand) {
	return request({ number, brand, analogues: 'on' });
}
