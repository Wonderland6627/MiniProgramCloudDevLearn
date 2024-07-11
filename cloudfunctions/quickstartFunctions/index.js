const getOpenId = require('./getOpenId/index');

const fetchStoresList = require('./fetchStoresList/index')
const checkLogin = require('./checkLogin/index');
const getJSCode2Session = require('./getJScode2Session/index')

const createStudent = require('./students/createStudent/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
      
    case 'fetchStoresList':
      return await fetchStoresList.main(event, context);
    case 'checkLogin':
      return await checkLogin.main(event, context);
    case 'getJSCode2Session':
      return await getJSCode2Session.main(event, context);

    case 'createStudent': 
      return await createStudent.main(event, context);
  }
};
        
