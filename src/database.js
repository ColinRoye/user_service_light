const mongoose = require('mongoose');
const User = mongoose.model("UserService");
const env = require("./env");
const debug = require("./debug");



module.exports = {
  getUserByEmail: async (email) => {
    return await User.find({
      email: email
    }).limit(1)
  },
  addUser: async (email) => {
    let user = new User;
    user.email = email;
    user.followers = [];
    user.following = [];
    await user.save();
    return user
  },



  follow: async (username, userEmail, followname, followsUserEmail, followOption) => {
    debug.log("FOLLOW_DATABASE: top")
    debug.log("FOLLOW_DATABASE: userEmail " + userEmail)
    debug.log("FOLLOW_DATABASE: username " + username)
    debug.log("FOLLOW_DATABASE: followsUserEmail " + followsUserEmail)
    debug.log("FOLLOW_DATABASE: followname " + followname)


    let user = await User.find({
      email: userEmail
    }).limit(1);
    let followsUser = await User.find({
      email: followsUserEmail
    }).limit(1);

    if (!user) {
      debug.log("FOLLOW_DATABASE: user NOT defined")
      user = new User;
      user.email = userEmail;
      user.followers = [];
      user.following = [];
      debug.log("FOLLOW_DATABASE: user is defined to " + JSON.stringify(user))
      // await user.save();
      user.save();


    }
    if (!followsUser) {
      debug.log("FOLLOW_DATABASE: followUser NOT defined")
      followsUser = new User;
      followsUser.email = followsUserEmail;
      followsUser.followers = [];
      followsUser.following = [];
      // await followsUser.save();
      followsUser.save();

    }


    if (followOption === true) {
      console.log("FOLLOWING OPTION")
      user.following.push(followname);
      followsUser.followers.push(username);
    } else {
      console.log("UNFOLLOWING OPTION")
      user.following = user.following.filter((elm) => {
        return elm != followname
      })
      followsUser.followers = followsUser.followers.filter((elm) => {
        return elm != username
      })
    }



    debug.log("FOLLOW_DATABASE: User follows array" + JSON.stringify(user))
    debug.log("FOLLOW_DATABASE: User follows array" + JSON.stringify(followsUser))

    // await User.updateOne({email:userEmail}, {$push:{'following': followname}})
    // await User.updateOne({email:followsUserEmail}, {$push:{'followers': username}})
    // await followsUser.save();
    // await user.save();
    followsUser.save();
    user.save();


  },
  unfollow: async (username, userEmail, followname, followsUserEmail) => {
    debug.log("UNFOLLOW_DATABASE: top")
    // debug.log("FOLLOW_DATABASE: userEmail "+userEmail)
    // debug.log("FOLLOW_DATABASE: username "+username)
    // debug.log("FOLLOW_DATABASE: followsUserEmail "+followsUserEmail)
    // debug.log("FOLLOW_DATABASE: followname "+followname)
    //
    //
    // let user = await User.findOne({email: userEmail});
    // let followsUser = await User.findOne({email: followsUserEmail});
    //
    // if(!user){
    //      debug.log("FOLLOW_DATABASE: user NOT defined")
    //      user = new User;
    //      user.email = userEmail;
    //      user.followers = [];
    //      user.following = [];
    //      debug.log("FOLLOW_DATABASE: user is defined to " + JSON.stringify(user))
    //      await user.save();
    //
    //
    // }
    // if(!followsUser){
    //      debug.log("FOLLOW_DATABASE: followUser NOT defined")
    //      followsUser = new User;
    //      followsUser.email = followsUserEmail;
    //      followsUser.followers = [];
    //      followsUser.following = [];
    //      await followsUser.save();
    //
    // }
    //
    // user.following = user.following.filter((elm)=>{return elm != followname})
    // followsUser.following = followsUser.following.filter((elm)=>{return elm != username})
    //
    //
    // debug.log("UNFOLLOW_DATABASE: User follows array" + user.following)
    // debug.log("UNFOLLOW_DATABASE: User follows array" + followsUser.following)
    // //
    // await User.updateOne({email:userEmail}, {$set: {'following': user.following}})
    // await User.updateOne({email:followsUser}, {$set:{'followers': followsUser.following}})
    //
    //
    // return user.follows;
  },

}