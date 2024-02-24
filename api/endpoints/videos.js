const express = require('express');
const { Readable } = require("stream");
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const File = require('../models/file.model');

const router = express();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

let gfs, bucket;

const conn = mongoose.connection;
conn.once('open', () => {
    // Add this line in the code
    bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'videoBucket'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('videoBucket');
});

router.get('/', async (req, res) => {
    const videos = await File.find({ contentType: { $in: ["video/mp4"]} }).lean();
    return res.json(videos);
});

router.get('/:id', async (req, res) => {
    let { id } = req.params

    const file = await File.findOne({ id }).lean();
    if(!file) {
        return res.status(400).json({ error: 'Invalid file id' });
    }

    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id))
    downloadStream.pipe(res);
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: 'No file provided in the request' });
        }

        if (!req.body.profileId) {
            return res.status(400).json({ error: 'No profile id provided in the request' });
        }
        
        let { file, body } =  req
        const exists = await File.findOne({ filename: file.originalname, profileId: body.profileId }).lean();

        if(exists) {
            bucket.delete(new mongoose.Types.ObjectId(exists.id));
        }

        let { originalname, mimetype, buffer } = file

        let uploadStream = bucket.openUploadStream(originalname)
        let readBuffer = new Readable()
        readBuffer.push(buffer)
        readBuffer.push(null)

        await new Promise((resolve, reject)=>{
            readBuffer.pipe(uploadStream)
            .on("finish", resolve("successfull"))
            .on("error" , reject("error occured while creating stream") )
        })

        if(!exists) {
            let newFile = new File({
                filename: file.originalname,
                contentType: mimetype,
                length: buffer.length,
                profileId: body.profileId
            });
            newFile.id = uploadStream.id
            let savedFile =  await newFile.save()
            if(!savedFile){
                return res.status(404).send("error occured while saving our work")
            }
        } else {
            await File.updateOne({ filename: file.originalname, profileId: body.profileId }, { id: uploadStream.id });
        }
        return res.send({ message: "file uploaded successfully"})
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error uploading file', error: err });
    }
});

module.exports = router;