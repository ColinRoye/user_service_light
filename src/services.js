const debug = require("./debug");
const env = require("./env");
const db = require("./database");
const uuid = require("uuid/v1")
const axios = require("axios")

//export db agnostic services
module.exports={
     addUser: async(email)=>{
          debug.log("ADDUSER_SERVICE:" + email)
          if(email !== null){
               return await db.addUser(email);
          }
          return "error"
     },
     follow: async(username, followsUserUsername, follow)=>{
          debug.log("FOLLOW_SERVICE: TOP")
          debug.log("FOLLOW_SERVICE: USERNAME " + username)
          debug.log("FOLLOW_SERVICE: USERNAME " + followsUserUsername)

          let ret = {};
          let userCheck = (await axios.get(env.baseUrl + '/account/' + username)).data;
          debug.log("FOLLOW_SERVICE: USERCHECK " + userCheck);
          let followsUserCheck = (await axios.get(env.baseUrl + '/account/' + followsUserUsername)).data;
          debug.log("FOLLOW_SERVICE: FOLLOWUSERCHECK " + followsUserCheck);

          if(userCheck && followsUserCheck){
               debug.log("FOLLOW_SERVICE: BOTH USERS EXIST")

               ret.debug = await db.follow(username, userCheck, followsUserUsername, followsUserCheck, follow);
               ret.status = env.statusOk;
          }else{
               if(userCheck && !followsUserCheck){
                    debug.log("FOLLOW_SERVICE: ERROR user exists, but followUser does not")
                    //await addUser
               }else if(!userCheck && followsUserCheck){
                    debug.log("FOLLOW_SERVICE: ERROR followUser exists, but user does not")
               }else{
                    debug.log("FOLLOW_SERVICE: neither exists")

               }
               ret.status = env.statusError;
          }
          return ret;
     },
     unfollow: async(username, followsUserUsername)=>{
          debug.log("UNFOLLOW_SERVICE: TOP")
          debug.log("UNFOLLOW_SERVICE: USERNAME " + username)
          debug.log("UNFOLLOW_SERVICE: USERNAME " + followsUserUsername)

          let ret = {};
          let userCheck = (await axios.get(env.baseUrl + '/account/' + username)).data;
          debug.log("UNFOLLOW_SERVICE: USERCHECK " + userCheck);
          let followsUserCheck = (await axios.get(env.baseUrl + '/account/' + followsUserUsername)).data;
          debug.log("UNFOLLOW_SERVICE: FOLLOWUSERCHECK " + followsUserCheck);

          if(userCheck && followsUserCheck){
               debug.log("UNFOLLOW_SERVICE: BOTH USERS EXIST")

               ret.debug  = await db.unfollow(username, userCheck, followsUserUsername, followsUserCheck);
               debug.log(out);
               ret.status = env.statusOk;
          }else{
               if(userCheck && !followsUserCheck){
                    debug.log("UNFOLLOW_SERVICE: ERROR user exists, but followUser does not")
                    // await addUser
               }else if(!userCheck && followsUserCheck){
                    debug.log("UNFOLLOW_SERVICE: ERROR followUser exists, but user does not")
               }else{
                    debug.log("UNFOLLOW_SERVICE: neither exists")

               }
               ret.status = env.statusError;
          }
          return ret;
     },
     getUserByEmail: async(email)=>{
          debug.log((JSON.stringify(await db.getUserByEmail(email))))
          return await db.getUserByEmail(email)
     },
     getOrCreateUserByUsername: async(username, option)=>{
          let ret = {}
          let email = (await axios.get(env.baseUrl + '/account/' + username)).data;
          debug.log("email" + email)

          if(email !== ""){
               debug.log("getOrCreateUserByEmail: EMAIL" + email)

               let user = await module.exports.getUserByEmail(email);
               if(user === null){
                    user = await module.exports.addUser(email)
               }

               debug.log("getOrCreateUserByEmail: USER" + user)
               if(user.followers && user.following){
                    if(option == "arr"){
                         debug.log("getOrCreateUserByEmail: ARRAY OPTION")
                         ret.user = {
                              "followers": user.followers ,
                              "following": user.following ,
                              "email": email
                         }
                    }else{
                         ret.user = {
                              "followers": user.followers.length ,
                              "following": user.following.length ,
                              "email": email
                         }
                    }


               }
               ret.status = env.statusOk;
               debug.log(ret);
               debug.log("getOrCreateUserByEmail OUTPUT: " + JSON.stringify(ret))

               return (ret);
          }else{
               ret.status = env.statusError;
               ret.error = "USER DNE"
               debug.log(ret);
               return(ret)
          }

     }
}
