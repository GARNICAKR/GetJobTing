const Location=require("../models/Location");

module.exports={
    Fcreate:(req,res)=>{
        res.render("location/create");
    },
    create:async(req,res)=>{
        const {state,cities,}=req.body;
        const country="México"
        const dataArray = cities.split(", ");
         const newLocation=new Location({country,state,cities:dataArray});
         await newLocation.save();
        res.send("OK");   
    },
    getLocations:async(req,res)=>{
        try {
            const locations=await Location.find()
             
        res.json(locations);
        } catch (error) {
            let data = {
                error: "Error obtner Locations",
              };
              res.send(data);
        }
    },
}
