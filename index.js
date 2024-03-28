const express = require('express')
const mongoose = require('mongoose')
const app = express();




async function middleware(req,res,next){
    let username  = req.body.username
    let team = req.body.team

    const ninjaExist = await Shinobi.findOne({ninjaName:username})
    const time = await Shinobi.findOne({ninjaName:username})

    // console.log(time.createdAt.getHours() + ' ' + time.createdAt.getMinutes())



    if(ninjaExist){
        
        return res.json({warning:'Ninja already Exist choose another username'})
    }
    if(username  && team){
      return   next()
    }

    
   return  res.json({warning:'you missed the username or team'})
}

async function SignupMidlleware(req, res, next) {
    let currentTeam = req.body.team;

    try {
        const teamMembers = await Shinobi.find({ team: currentTeam }); // Find all members in the team

        if (teamMembers.length < 3) {
            next(); // Proceed to signup if there's space
        } else {
            res.json({ msg: 'Members list is full' });
        }
    } catch (error) {
        console.error(error); // Handle errors
        res.status(500).json({ msg: 'Internal server error' });
    }
}

async function updateTeamMiddleware(req,res,next){

    let team = req.body.team;

    const teamMembers = await Shinobi.find({ team: team }); // Find all members in the team

    if (teamMembers.length < 3) {
        next(); // Proceed to signup if there's space
    } else {
        res.json({ msg: 'Members list is full' });
    }
}

mongoose.connect('mongodb+srv://konain7:Kaunain%4099@cluster0.rmyvhx6.mongodb.net/leafvillage')
.then(()=>console.log('leaf village connected now'))

const shinobiSchema = new mongoose.Schema({
    ninjaName:{
        type:String,
        require:true,
        unique:true
    },
    team:{
        type:Number,
        require:true
    }
},{timestamps:true}
)

const Shinobi = mongoose.model('shinobi',shinobiSchema)





app.use(express.json())



app.post('/signup',middleware,SignupMidlleware ,async(req,res)=>{
 

    let team  = req.body.team;
    let ninjaName = req.body.username
   let joiningTeam = await Shinobi.create({ninjaName,team})

    res.json({user :joiningTeam})

})
app.get('/',async(req,res)=>{
let ninjas = await Shinobi.find()

res.json({ninjas:ninjas.map((ninja)=>ninja.ninjaName)})
})

app.put('/updateTeam',updateTeamMiddleware,async(req,res)=>{
    let team = req.body.team;
    let ninja = req.body.ninja

    teamUpdata = await Shinobi.findOneAndUpdate({ ninjaName: {ninja} }, { $set: { team:team} });
    console.log(teamupdata)
    res.json({msg: `${ninja} join  Team ${team}`})

})
app.listen(3090)    