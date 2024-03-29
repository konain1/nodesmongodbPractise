const express = require('express')
const mongoose = require('mongoose')
const app = express();




async function middlewareDelete(req,res,next){
    let username  = req.body.username
    let team = req.body.team

    const ninjaExist = await Shinobi.findOne({ninjaName:username})
    // const time = await Shinobi.findOne({ninjaName:username})
    
    // console.log(time.createdAt.getHours() + ' ' + time.createdAt.getMinutes())



    if(ninjaExist && ninjaExist.team == team){
        
        if(username  && team){
            return   next()
          }
    }else{
        res.json({msg:`ninja does not exits or wrong team id`})
    }
    

    
   return  res.json({warning:'you missed the username or team'})
}

async function SignupMidlleware(req, res, next) {
    let currentTeam = req.body.team;
    let username  = req.body.username


    try {
        const ninjaExist = await Shinobi.findOne({ninjaName:username})

        const teamMembers = await Shinobi.find({ team: currentTeam });

        if(ninjaExist){
        
            return res.json({warning:'Ninja already Exist choose another username'})
        }

        if (teamMembers.length < 3) {
            next(); 
        } else {
            res.json({ msg: 'Members list is full' });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({ msg: 'Internal server error' });
    }
}

async function updateTeamMiddleware(req,res,next){

    let team = req.body.team;

    const teamMembers = await Shinobi.find({ team: team }); 

  
    
    if (teamMembers.length < 3) {
        console.log(teamMembers.length)
        next(); 
    } else {
        console.log(teamMembers.length)
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



app.post('/signup',SignupMidlleware ,async(req,res)=>{
 

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

    teamUpdata = await Shinobi.findOneAndUpdate({ ninjaName: ninja }, { $set: { team:team} });
    res.json({msg: `${ninja} join  Team ${team}`})

})

app.delete('/delete',middlewareDelete,async(req,res)=>{

    let ninja = req.body.username;
    let team = req.body.team

    let ninjaExist = await Shinobi.findOneAndDelete({ninjaName:ninja})

    res.json({msg:`${ninja} has been  removed`})



})
app.listen(3090)    