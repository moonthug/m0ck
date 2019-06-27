const posts = [
  { id: 1, content: 'hello There' }
];

const getPosts = count => {
  const posts = [];
  for(let i = 0; i < count; i++) {
    posts.push({
      id: i,
      content: 'Message ' + Math.random()
    })
  }
  return posts;
};

module.exports = {
  description: 'Get all posts',
  request: {
    query: {
      user: 1
    }
  },
  response: {
    statusCode: 200,
    body: {
      data: getPosts(5)
    }
  }
};
