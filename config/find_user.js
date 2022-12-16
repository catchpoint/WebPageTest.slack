const User = require("../modals/userModal");

const findUser = async (id) => {
  try {
    const user = await User.find({ _id: id });
    // return first user we find
    if (user[0] !== undefined) {
      return user[0];
    }
  } catch (error) {
    console.error(error);
  }
  return false;
};

module.exports = {
  findUser,
};
