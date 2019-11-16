const express = require("express");
const app = express();
const router = require("express").Router();
const debug = require("./debug");
const env = require("./env");
const service = require("./services");
const axios = require("axios");



let getPosts =      async(username, limit)=>{
     if(!limit){
          limit = 50
     }
     if(limit > 200){
          limit = 200;
     }
     debug.log("url : " +  env.baseUrl + "/items/" + username + "/" + limit)

     let url = env.baseUrl + "/items/" + username + "/" + limit
     debug.log("LIMIT IN GET POSTS: " + limit);
     return axios.get(url);
}


router.get('/user/:username/followers', async (req, res, next)=>{
     debug.log("INPUT: /user/:username/followers " + JSON.stringify(req.params))
     let followers = (await service.getOrCreateUserByUsername(req.params.username, "arr")).user.followers
     let temp = [];
     if(req.query.limit == undefined){
          req.query.limit = 50
     }
     if(req.query.limit > 200){
          req.query.limit = 200
     }
     for(let i = 0; i < req.query.limit &&  i < followers.length;i++){
          temp.push(followers[i]);
     }
     res.send({followers: temp, status:"OK"})
});
router.get('/user/:username/following', async (req, res, next)=>{
     debug.log("INPUT: /user/:username/following " + JSON.stringify(req.params))
     let following = (await service.getOrCreateUserByUsername(req.params.username, "arr")).user.following
     let temp = [];
     if(req.query.limit == undefined){
          req.query.limit = 50
     }
     if(req.query.limit > 200){
          req.query.limit = 200
     }
     for(let i = 0; i < req.query.limit && i < following.length;i++){
          temp.push(following[i]);
     }
     res.send({following: temp, status:"OK"})
});
router.get('/user/:username', async (req, res, next)=>{
     debug.log("INPUT: /user/:username: " + JSON.stringify(req.params));
     //debug.log("OUTPUT:" + (await service.getOrCreateUserByUsername(req.params.username)));

     res.send((await service.getOrCreateUserByUsername(req.params.username)));
});
router.get('/user/:username/posts', async (req, res, next)=>{
     debug.log("INPUT: /user/:username/posts" + JSON.stringify(req.params))
     debug.log("LIMIT: " + req.query.limit)
     res.send((await getPosts(req.params.username,req.query.limit)).data);
});


router.post('/follow', async (req, res, next)=>{
     // console.log(collection.find({email: 'test@test.cccc'}))
     debug.log("INPUT: FOLLOW_ROUTE: /follow" + JSON.stringify(req.body))

     debug.log("FOLLOW_ROUTE: top")
     let args = req.body;
     let ret = {};
     let user = req.cookies['auth'];
     let followUser = args.username;
     if(user){
          debug.log("FOLLOW_ROUTE: args.follow === undefined " + args.follow === undefined);
          debug.log("FOLLOW_ROUTE: args.follow === true " + args.follow === true);
          debug.log("FOLLOW_ROUTE: args.follow"+args.follow);

          if(args.follow === undefined || args.follow === true){
               debug.log("FOLLOW_ROUTE: FOLLOW")
               ret = await service.follow(user, followUser, true);
               debug.logIt("finised follow")
          }else{
               debug.log("FOLLOW_ROUTE: UNFOLLOWING")
               ret = await service.follow(user, followUser, false);
               debug.logIt("finised unfollow")

          }
     }else{
          debug.log("FOLLOW_ROUTE: user undefined")

          ret.status = env.statusError;
     }
     debug.log("test");
     res.send(ret)

});



module.exports = router
