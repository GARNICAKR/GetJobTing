const Location=require("../models/Location");

module.exports={
    Fcreate:(req,res)=>{
        res.render("location/create");
    },
    create:async(req,res)=>{
        const {country,state,city,address}=req.body;
        const newLocation=new Location({country,state,city,address});
        await newLocation.save();
        res.send("OK");   
    },

}
