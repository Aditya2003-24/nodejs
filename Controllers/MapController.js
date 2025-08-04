import Location from "../Models/LocationModel.js"
import axios from "axios";

const SaveLocation = async (req,res) => {
    try {
        const { name, latitude, longitude } = req.body;
        if (!name || !latitude || !longitude) {
            return res.status(400).json({ error: "Name, latitude, and longitude are required" });
        }

        const newLocation = new Location({ name, latitude, longitude });
        await newLocation.save();

        res.json({ message: "Location saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const Map = async (req,res) => {
    try {
        const { place } = req.query;
        if (!place) {
            return res.status(400).json({ error: "Place name is required" });
        }

        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
        q: place,
        format: "json",
        addressdetails: 1,
        limit: 1
    },
    headers: {
        "User-Agent": "MyMapApp/1.0 (https://yourwebsite.com)",
        "Accept-Language": "en" 
    }
        }); 

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}


export {SaveLocation,Map}


