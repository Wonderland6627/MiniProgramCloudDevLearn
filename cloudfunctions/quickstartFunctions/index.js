const getOpenId = require('./getOpenId/index');

const checkLogin = require('./checkLogin/index');
const getJSCode2Session = require('./getJScode2Session/index');

const createStudent = require('./students/createStudent/index');
const bindStudent = require('./students/bindStudent/index');

const updatePwd = require('./stores/updatePwd/index');

const updatePackages = require('./packages_collection/updatePackages/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
      
    case 'checkLogin':
      return await checkLogin.main(event, context);
    case 'getJSCode2Session':
      return await getJSCode2Session.main(event, context);

    case 'createStudent': 
      return await createStudent.main(event, context);
    case 'bindStudent':
      return await bindStudent.main(event, context);

    case 'updatePwd': 
      return await updatePwd.main(event, context);

    case 'updatePackages':
      return await updatePackages.main(event, context);
  }
};