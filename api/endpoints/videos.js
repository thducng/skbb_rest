const express = require('express');
const { Readable } = require("stream");
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const File = require('../models/file.model');
const Profile = require('../models/profile.model');

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

/**
 * GET /api/videos
 * @summary GET all video files
 * @tags Videos
 * @return {array<File>} 200 - Success Response
 */
router.get('/', async (req, res) => {
    const videos = await File.find({ contentType: { $in: ["video/mp4"]} }).lean();
    return res.json(videos);
});

/**
 * GET /api/videos/{id}
 * @summary GET a specific file
 * @tags Videos
 * @tags Files
 * @param {string} id.path - File id
 * @return {File} 200 - Success Response
 */
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

/**
 * A DeleteFile Argument
 * @typedef {object} DeleteFileArgs
 * @property {string} id - The profile id that owns the file or profile id of an Admin
 */

/**
 * POST /api/videos/{id}/delete
 * @summary DELETE a specific file from a profile
 * @tags Videos
 * @tags Profiles
 * @tags Files
 * @param {string} id.path - File id
 * @param {DeleteFileArgs} request.body.required - Authority Arguments
 * @return {boolean} 200 - Success Response
 */
 router.post('/:id/delete', async (req, res) => {
    let { id } = req.params

    const file = await File.findOne({ id }).lean();
    if(!file) {
        return res.status(400).json({ error: 'Invalid file id' });
    }

    const isProfile = file.profileId === req.body.id;
    
    if(isProfile) {
        await File.deleteOne({ id, profileId: req.body.id });
        return res.send(true);
    }

    const isAdmin = await Profile.findOne({ id: req.body.id, type: 'ADMIN' }).lean()
    if(isAdmin) {
        await File.deleteOne({ id, profileId: req.body.id });
        return res.send(true);
    } else {
        return res.status(400).json({ error: 'No authority' });
    }
});

/**
 * File Arguments
 * @typedef {object} FileArgs
 * @property {string} profileId.required - The date for the course start
 */

/**
 * POST /api/videos/upload
 * @summary ADD a file to a profile
 * @tags Profiles
 * @tags Files
 * @tags Videos
 * @param {FileArgs} request.body.required - Profile id to add file to
 * @param {object} file.request.required - File object to add
 * @return {File} 200 - Success Response
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: 'No file provided in the request' });
        }

        const profile = await Profile.findOne({ id: req.body.profileId }).lean();
        if (!profile) {
            return res.status(400).json({ error: 'Profile does not exists' });
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