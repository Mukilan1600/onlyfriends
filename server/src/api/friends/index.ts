import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import logger from '../../Logger/Logger'
import {IUser,getFriendsList} from '../../database/Models/User' 


const router = Router()

router.get("/", ensureLoggedIn({redirectTo: "/api/auth/oauth"}),async (req,res) => {
    try{
        const user = req.user as IUser
        const friendsList = await getFriendsList(user.oauthId);
        if(friendsList)
            return res.json({friends: friendsList});
        else
            throw new Error("User not found");
    }catch(err){
        logger.error(err, "api.friends.getFriendsList");
        return res.status(500).json({msg: "Internal server error"})
    }
})

export default router