import { generaMoking } from "../repository/moking.service.js";

 
export class MokingControler{

    static getMoking=(req,res)=>{
        let productos=generaMoking()

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({productos});

    }


}



