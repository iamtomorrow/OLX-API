
import { BASE_URL } from "../envs";
import sharp from "sharp";
import { Ad, AdProps } from "../models/Ad";
import { Category } from "../models/Category";
import { State } from "../models/State";
import { Request, Response } from "express";
import { User } from "../models/User";
import mongoose from "mongoose";

const handleMedia = async ( path: string ) => {
    const fileName = `${Date.now()}.jpg`;
    await sharp(path)
        .resize(300, 300)
        .toFormat("jpg")
        .toFile(`./public/media/${fileName}`);
    return fileName;
}

export const AdController = {
    getAllAds: async ( req: Request, res: Response ) => {
        const ads = await Ad.find();

        let adsList = [];
        for ( let i in ads ) {
            if (ads[i].status) {
                let category = await Category.findById(ads[i].category);
                let state = await State.findById(ads[i].state);
    
                adsList.push({
                    name: ads[i].name,
                    state: state?.name,
                    category: category?.name,
                    price: ads[i].price,
                    price_negotiable: ads[i].price_negotiable,
                    description: ads[i].description,
                    views:  ads[i].views,
                })
            }
        }

        res.json({ ads: adsList });
    },

    getAd: async ( req: Request, res: Response ) => {
        const { id } = req.query;

        if ( mongoose.Types.ObjectId.isValid( id as string ) ) {
            let ad = await Ad.findOne({ _id: id });
            let adList = [ ];
            if (ad) {                

                let matchState = await State.findOne({ _id: ad.state });
                let matchCategory = await Category.findOne({ _id: ad.category });
                if ( matchState && matchCategory ) {
                    const adState = matchState.name;
                    const adCategory = matchCategory.name;
                    const images = ad.images;

                    adList.push({
                        name: ad.name,
                        user: ad.id_user,
                        state: adState,
                        category: adCategory,
                        price: ad.price,
                        price_nogotiable: ad.price_negotiable,
                        description: ad.description,
                        views: ad.views,
                        date_created: ad.date_created,
                        images
                    })
                    res.json({ ad: adList });
                    return;
                }
            } else {
                res.json({ error: "Sorry, the ad doesn't exist. Please, provide a different id and try again." });
                return;
            } 
        } else {
            res.json({ error: "Please, make sure to provide a valid id before continuing." });
            return;
        }

        res.json({ });
    },

    createAd: async ( req: Request, res: Response ) => {
        const token = req.query?.token;
        /*  console.log( JSON.parse(JSON.stringify(req.body)) );*/
        let name = req.body?.name;
        let state = req.body?.state.toUpperCase();
        let category = req.body?.category.toLowerCase();
        let price = req.body?.price;
        let price_negotiable = req.body?.price_negotiable;
        let description= req.body?.description;

        if ( name && category && state ) {
            const matchState = await State.findOne({ name: state });
            const matchCategory = await Category.findOne({ slug: category });
            const user = await User.findOne({ token });

            if ( matchState && matchCategory && user ) {
                // let newAdd = [];

                let adImages = [];
                if ( req.files ) {
                    const files: any = req.files;
                    if ( files ) {
                        for ( let i in files ) {
                            let file = await handleMedia( files[i].path );
                            let url = `${BASE_URL}/media/${file}`;
                            adImages.push({ name: file, url, });
                        }
                    }
                }
                let newAd = new Ad();
                newAd.name = name;
                newAd.id_user = user._id.toString();
                newAd.state = matchState._id.toString();
                newAd.category = matchCategory._id.toString();
                newAd.price = price;
                newAd.price_negotiable = price_negotiable ? true : false;
                newAd.description = description;
                newAd.views = 0;
                newAd.status = 'true';
                newAd.date_created = Date();
                newAd.images = adImages;

                await newAd.save();
                res.json({ ad: newAd });
                return;
            } else {
                res.json({ error: "Sorry, some data provided is wrong or don't match with database requirements. Please, provide different values for keys and try again." });
                return;
            }
        } else {
            res.json({ error: "Please, make sure to provide enough data before continuing."});
            return;
        }
    },

    getCategories: async ( req: Request, res: Response ) => {
        const categories = await Category.find();

        res.json({ categories });
    }
}
