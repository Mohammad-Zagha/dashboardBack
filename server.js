const express = require('express')
const app=express()
const websiteRoutes=require('./Routes/websiteRouts')
const userRoutes = require('./Routes/userRoutes')
const mongoose=require('mongoose')
const schedule=require('node-schedule')
const Subs=require('./modules/clinteModule')
const dayjs = require('dayjs')
const cookieParser = require('cookie-parser')
const cors=require('cors') 
require('dotenv').config();

schedule.scheduleJob('* * * * *',async()=>{
    var clients = await Subs.find({})
    if(clients.length === 0)
    {
        return;
    }
    else
    {
        clients.forEach( async (client)=>{
            let currentDate = dayjs(new Date())
            let frozenDays = client.frozenDate;
            let name = client.name
            let endDate= dayjs(client.endDate)
            let startDate = dayjs(client.startDate)
            let daysLeft = client.daysLeft

           if(client.status === "Frozen") 
            {
                if(client.frozenDate == 0)
                {
                    if(client.status === "Frozen")
                    {
                        const resp =  await Subs.updateOne({name:name},{$set:{status:"Active"}})

                    }       
                }
                    else
                    {   
                            const newEndDate = endDate.add(1,'day');
                            frozenDays -= 1;
                            
                            const resp =  await Subs.updateOne({name:name},{$set:{frozenDate:frozenDays , endDate: newEndDate.toDate(),daysLeft:daysLeft}})
                    }
            }
            else if(client.status === "Active")
            {
                daysLeft= client.daysLeft - 1
                if(daysLeft <= 0)
                {
                    daysLeft=0;
                    const resp =  await Subs.updateOne({name:name},{$set:{status:"Ended", daysLeft:daysLeft}})
                }
                else
                {
                   
                  
                    const resp =  await Subs.updateOne({name:name},{$set:{daysLeft:daysLeft}})
                   

                }
            }
        
        }
        )
        
    }

})

app.use(express.json())
app.use(cookieParser())
app.use('/home',websiteRoutes)
app.use('/log',userRoutes)
app.use(cors({
    origin:['http://http://localhost:3000'],
    credentials:true,
    
}))
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected')
    app.listen(process.env.PORT || 5000,()=>{
        console.log("listening",)
    })
})
.catch((err)=>{
    console.log(err)
})
