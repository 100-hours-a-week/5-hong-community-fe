export async function fetchDummyMember() {
  try {
    const response = await fetch('/dummy/members.json');
    return await response.json();
  } catch (e) {
    console.log('dummy members.json 로드 실패');
    console.log(e);
  }
}

export async function fetchDummyPosts() {
  try {
    const response = await fetch('/dummy/posts.json');
    return await response.json();
  } catch (e) {
    console.log('dummy posts.json 로드 실패');
    console.log(e);
  }
}
