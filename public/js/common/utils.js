const BASE_URL = 'http://localhost:8000';

export async function getFetch(url) {
  const requestUrl = BASE_URL + url;

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
  const requestUrl = BASE_URL + url;

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
  const requestUrl = BASE_URL + url;

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
  const requestUrl = BASE_URL + url;

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

/**
 * 이미지 업로드
 *
 * @param image
 * @returns {Promise<string>}
 */
export async function uploadsImage(image) {
  const formData = new FormData();
  formData.append('file', image);

  const requestUrl = `${BASE_URL}/api/v1/uploads/image`;

  return fetch(requestUrl, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  }).then((jsonData) => {
    const imageName = jsonData.filename;
    return `${BASE_URL}/public/images/${imageName}`;
  });
}
