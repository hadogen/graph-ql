export async function fetchGraphQL(query) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('Not authenticated');
  
      const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  export async function fetchUserData() {
    const query = `{ user { id login email } }`;
    const response = await fetchGraphQL(query);
    return response.data.user;
  }
  
  export async function fetchXpData() {
    const query = `{
      transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
        amount
        createdAt
      }
    }`;
    const response = await fetchGraphQL(query);
    return response.data.transaction;
  }
  
  export async function fetchProgressData() {
    const query = `{ progress { grade object { name } } }`;
    const response = await fetchGraphQL(query);
    return response.data.progress;
  }