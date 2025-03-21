var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let {check_authentication,check_authorization} = require('../utils/check_auth')
let constants = require('../utils/constants')

/* GET users listing. */
router.get('/',check_authentication,check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let users = await userController.GetAllUser();
    CreateSuccessRes(res, 200, users);
  } catch (error) {
    next(error)
  }
});
router.get('/:id', check_authentication, async function (req, res, next) {
  try {
      let userId = req.params.id;
      let loggedInUserId = req.user.id;  // ID của user đăng nhập
      let loggedInUserRole = req.user.role;  // Role của user đăng nhập

      if (loggedInUserId !== userId && loggedInUserRole !== 'admin' && loggedInUserRole !== 'mod') {
          return CreateErrorRes(res, 403, "Bạn không có quyền xem thông tin user này");
      }

      let user = await userController.GetUserById(userId);
      if (!user) {
          return CreateErrorRes(res, 404, "Không tìm thấy user");
      }

      CreateSuccessRes(res, 200, user);
  } catch (error) {
      CreateErrorRes(res, 500, error);
  }
});

router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessRes(res, 200, newUser);
  } catch (error) {
    next(error);
  }
})
router.put('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updateUser = await userController.UpdateUser(req.params.id, req.body);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
})



module.exports = router;
