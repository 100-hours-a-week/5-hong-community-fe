export async function getFetch(url) {
  const baseUrl = 'http://localhost:8000';
  const requestUrl = baseUrl + url;

  return fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  });
}

export async function postFetch(url, data) {
  const baseUrl = 'http://localhost:8000';
  const requestUrl = baseUrl + url;

  return fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  });
}

export async function putFetch(url, data) {
  const baseUrl = 'http://localhost:8000';
  const requestUrl = baseUrl + url;

  return fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(response => {
    if (response.ok) {
      return;  // TODO: response json 없음 BE 에서 수정해야함
    }
    throw new Error();
  });
}

export async function deleteFetch(url) {
  const baseUrl = 'http://localhost:8000';
  const requestUrl = baseUrl + url;

  return fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    credentials: 'include',
  }).then(response => {
    if (response.ok) {
      return;
    }
    throw new Error();
  });
}
