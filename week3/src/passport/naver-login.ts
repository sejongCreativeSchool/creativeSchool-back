import { Strategy as NaverStrategy } from 'passport-naver';
import Publisher, { PublisherModel } from '../models/Publisher'
import passport from 'passport';
import config from '../config/vars'


const NaverKey = {
    clientID: "dTUlMUtraxjYtujsgl2f",
    clientSecret: "DGNHkL4ZMO",
    callbackURL: `${config.server.uri}/v1/auth/naver/callback`
};  
passport.use(
    "naver-login",
    new NaverStrategy(NaverKey, async(accessToken, refreshToken, profile, done) => {
    console.log(profile);
    
      let publisher = await Publisher.findOne({publisher_id : profile.id});
      if ( !publisher ){
        try{
          console.log('New User!');
          
          let newPublisher = new Publisher({publisher_id : profile.id}) as PublisherModel;
          console.log(newPublisher);
          
          await newPublisher.save();
          return done(null, newPublisher)
        }catch(e){
          return done('error!')
        }
      }
      else {
        console.log('Old User!');
      }
      return done(null, publisher)
    })
);
  