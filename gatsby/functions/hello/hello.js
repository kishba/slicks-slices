// Netlify functions are really AWS Lambda functions under the hood!
exports.handler = async (event, context) => {
  console.log(event);
  return {
    statusCode: 200,
    body: 'Hello world!!',
  };
};
