const express=require('express')
const router=express.Router();
const Subs =require('../modules/clinteModule');
const dayjs = require('dayjs')
const requireAuth=require('../middlewear/requierAuth')

router.use(requireAuth);

router.post('/add',async(req,res)=>{
    const clinte = req.body;
    try
    {
       

       
        clinte.owner = req.user.email;
        await Subs.create(clinte)
         const resp= await Subs.findOne({name:`${clinte.name}`, owner:req.user.email})
        // console.log(res)
        res.status(200).json(resp)
    }
 catch(err)
 {
    res.status(400).json(err.message)
 }
   
})
router.get('/clients',async(req,res)=>{
    const Clients=await Subs.find({owner:req.user.email})
    res.status(200).json(Clients)
    return;
})

router.patch('/updateStatus',async(req,res)=>{
    const {name,status}= req.body
    try{
        if(status === "Canceld")
        {
            const resp =  await Subs.updateOne({name:name , owner:req.user.email},{$set:{status:status,daysLeft:"0"}})
            if(resp.modifiedCount=== 1)
            {
                    const updatedDockument  = await Subs.findOne({name :`${name}`})
                        res.status(200).json(updatedDockument)
            }
        }else
        {
            
            const resp =  await Subs.updateOne({name:name},{$set:{status:status}})
            if(resp.modifiedCount=== 1)
            {
                    const updatedDockument  = await Subs.findOne({name :`${name}`})
                res.status(200).json(updatedDockument)
            }
        }
       
    }catch(err)
    {
        res.status(400).json({err})
    }
  

})
router.patch('/updateClient',async(req,res)=>{
    const client=req.body;
    
    res.status(200).json(client)
})
router.patch('/addSub',async(req,res)=>{
    try{
        const object=req.body;
        const startDate = dayjs(object.startDate)
        const endDate = dayjs(object.endDate)
        const daysleft = Math.floor(endDate.diff(startDate) / 1000 / 60 / 60 / 24)
    const dateObj = {startDate:object.startDate,endDate:object.endDate,price:object.price}
    const name = object.name
    const dbRes= await Subs.updateOne(
        { name: `${name}` , owner:req.user.email },
        {
          $push: {
            dateArray: {
              $each: [dateObj],
              $position: 0
            }
          },
          $set: { status: "Active" ,startDate:object.startDate,endDate:object.endDate, daysLeft:daysleft}
        }
      );
      
    if(dbRes.modifiedCount=== 1)
        {
                const updatedDockument  = await Subs.findOne({name :`${name}`})
            res.status(200).json(updatedDockument)
        }}
        catch(err){
            res.status(400).json({err})
        }
   
})


router.patch('/unFreezSub',async(req,res)=>{
    const {name}= req.body

    try{
        
        
        const resp =  await Subs.updateOne({name:name, owner:req.user.email},{$set:{frozenDate:0 , status:"Active" }})
        if(resp.modifiedCount=== 1)
        {
            const updatedDockument  = await Subs.findOne({name :`${name}`, owner:req.user.email})
            res.status(200).json(updatedDockument)
        }
       
    }catch(err)
    {
        res.status(400).json({err})
    }
    
  


})
router.patch('/freezSub',async(req,res)=>{
    const {name,frozenDays}= req.body

    try{
        
        
        const resp =  await Subs.updateOne({name:name, owner:req.user.email},{$set:{frozenDate:frozenDays , status:"Frozen"}})
        if(resp.modifiedCount=== 1)
        {
            const updatedDockument  = await Subs.findOne({name :`${name}`, owner:req.user.email})
            res.status(200).json(updatedDockument)
        }
       
    }catch(err)
    {
        res.status(400).json({err})
    }
    
  


})

router.get('/getMostRecent',async(req,res)=>{
    try {
        const recentObjects = await Subs.find({})
          .sort({ createdAt: -1 }) // Sort in descending order by createdAt field
          .limit(5); // Limit the results to 5 objects
        
          res.status(200).json(recentObjects) ;
      } catch (error) {
        res.status(400).json({error})
        
      }
})

router.patch('/updateClientByName', async (req, res) => {
    const receivedObject = req.body;

    try {
        const nameToUpdate = receivedObject.name;

        // Find and update the existing object with the same name
        const updatedObject = await Subs.findOneAndUpdate(
            { name: nameToUpdate, owner:req.user.email },
            receivedObject, // Replace with the received object
            { new: true } // To return the updated object
        );

        if (updatedObject) {
            res.status(200).json(updatedObject);
        } else {
            res.status(404).json({ error: 'Object not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
