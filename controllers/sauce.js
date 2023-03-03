const Sauce = require('../models/Sauce')
const fs = require('fs')

/**
 *  This one will create a sauce and add it in DB
 */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    delete sauceObject._userId
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    })
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée!'})})
    .catch(error => { res.status(400).json( { error })})
}

/**
 * This one will control when you edit a sauce looking for auth then if there is a file in req ant will PUT edit
 * Will delete previous image file if edited
 */
exports.modifySauce = (req, res, next) => {

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body }

    delete sauceObject._userId
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'})
        } else {
            if(req.file) {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modifiée, image antérieure supprimée!'}))
                    .catch(error => res.status(401).json({ error }))
                })
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                .catch(error => res.status(401).json({ error }))
            }
        }
    })
    .catch((error) => {
        res.status(400).json({ error })
    })
}

 /**
 * This one will delete a sauce from DB, delete image file associated too
 */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if(sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Non authorized'})
            } else {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                    .then(() => {res.status(200).json({message: 'Sauce supprimée !'})})
                    .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => res.status(500).json({ error }))
}

/**
 *  This one will provide a GET one sauce request
 */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

/**
 * This one will provide a GET all sauces request
 */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json ({ error }))
}

/**
 *  This one will manage all around like and dislike system
 */
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

        switch(req.body.like) {
            case 1:
                if(!sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: 1 },
                            $push: { usersLiked: req.auth.userId }
                        }
                    )            
                    .then(() => res.status(200).json({message : 'Sauce likée!'}))
                    .catch(error => res.status(401).json({ error }))
                } 
            break
            case -1:
                if(!sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.auth.userId }
                        }
                    )            
                    .then(() => res.status(200).json({message : 'Sauce dislikée!'}))
                    .catch(error => res.status(401).json({ error }))
                }
            break
            case 0:
                if(sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.auth.userId }
                        }
                    )            
                    .then(() => res.status(200).json({message : 'Like retiré!'}))
                    .catch(error => res.status(401).json({ error }))
                } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.auth.userId }
                        }
                    )            
                    .then(() => res.status(200).json({message : 'Dislike retiré!'}))
                    .catch(error => res.status(401).json({ error }))
                }
            break
        }
        
    })
    .catch(error => res.status(500).json({ error }))
 
}
