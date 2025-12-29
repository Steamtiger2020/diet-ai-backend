import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json({limit:"20mb"}));
app.use(cors());

const HF_API_KEY = process.env.HF_API_KEY;

app.post("/analyze", async (req,res)=>{
    try{
        const { imageBase64 } = req.body;

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/meta-llama/Llama-3.2-11B-Vision-Instruct",
            {
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${HF_API_KEY}`,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    inputs:[{
                        role:"user",
                        content:[
                            {type:"text",text:"Analyze food. Return ONLY JSON {name,cal,p,c,dica}"},
                            {type:"image",image:imageBase64}
                        ]
                    }]
                })
            }
        );

        const data = await response.json();
        res.send(data);

    }catch(err){
        res.status(500).send({error:String(err)});
    }
});

app.listen(3000, ()=>console.log("🔥 Server rodando na porta 3000"));
