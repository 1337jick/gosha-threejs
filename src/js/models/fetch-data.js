export default async function fetchData(
    url,
    method = 'POST',
    data = false,
    convertDataToJSON = true
) {
    const options = {
        method: method,
    };
    if (method === 'POST' && data !== false) {
        if (convertDataToJSON) {
            options.body = JSON.stringify(data);
            options.header = {
                'Content-Type': 'application/json',
            };
        } else {
            options.body = data;
        }
    }
    const response = await fetch(url, options);
    const res = await response.json();
    const status = response.status >= 400 ? 'error' : 'success';
    return {
        status: status,
        body: res,
    };
}
