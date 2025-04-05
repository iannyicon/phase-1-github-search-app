document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const repoList = document.getElementById('repos-list');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
  
      userList.innerHTML = '';
      repoList.innerHTML = '';
  
      try {
        const res = await fetch(`https://api.github.com/search/users?q=${query}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const data = await res.json();
        displayUsers(data.items);
      } catch (error) {
        userList.innerHTML = `<li>Error fetching users</li>`;
      }
    });
  
    function displayUsers(users) {
      if (users.length === 0) {
        userList.innerHTML = '<li>No users found</li>';
        return;
      }
  
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${user.avatar_url}" width="50" style="vertical-align: middle; border-radius: 50%;">
          <strong>${user.login}</strong>
          - <a href="${user.html_url}" target="_blank">Profile</a>
        `;
        li.addEventListener('click', () => fetchRepos(user.login));
        userList.appendChild(li);
      });
    }
  
    async function fetchRepos(username) {
      repoList.innerHTML = `<li>Loading ${username}'s repos...</li>`;
  
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const repos = await res.json();
  
        repoList.innerHTML = '';
        if (repos.length === 0) {
          repoList.innerHTML = '<li>No repositories found</li>';
          return;
        }
  
        repos.forEach(repo => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
          repoList.appendChild(li);
        });
      } catch (error) {
        repoList.innerHTML = `<li>Error fetching repos</li>`;
      }
    }
  });

  