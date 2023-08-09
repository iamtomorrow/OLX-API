
import { BASE_URL } from "../envs";
import sharp from "sharp";
import { Ad, AdProps } from "../models/Ad";
import { Category } from "../models/Category";
import { State } from "../models/State";
import { Request, Response } from "express";
import { User } from "../models/User";

interface FilterProps {
    category: string,
    state: string,
    q: string,
    sort: string,
    limit: number,
    offset: number
}

const handleMedia = async ( path: string ) => {
    const fileName = `${Date.now()}.jpg`;
    await sharp(path)
        .resize(800, 800)
        .toFormat("jpg")
        .toFile(`./public/media/${fileName}`);
    return fileName;
}

export const AdController = {
    getAllAds: async ( req: Request, res: Response ) => {
        let { sort='asc', limit=10, offset, category, state, keyword } = req.query;
        let filters: any = {}

        if (category) {
            let categoryMatch = await Category.findOne({ slug: category });
            if (categoryMatch) {
                filters.category = categoryMatch?._id;
            }
        }

        if (state) {
            let stateMatch = await State.findOne({ name: state });
            if (stateMatch) {
                filters.state = stateMatch?._id;
            }
        }

        if (keyword) {
            filters.name = {"$regex": keyword, "$options": "i"};
        }

        let adsList = [];

        let all = await Ad.find(filters).exec();
        let ads = await Ad.find(filters)
            .sort({ dateCreated: (sort === "asc" ? 1 : -1)})
            .skip(parseInt(offset as string))
            .limit(parseInt(limit as string))
            .exec();
        if (ads && all) {
            for ( let i in ads ) {
                if (ads[i].status) {
                    let category = await Category.findById(ads[i].category);
                    let state = await State.findById(ads[i].state);
    
                    adsList.push({
                        _id: ads[i]._id,
                        name: ads[i].name,
                        state: state?.name,
                        category: category?.name,
                        price: ads[i].price,
                        price_negotiable: ads[i].price_negotiable,
                        description: ads[i].description,
                        views:  ads[i].views,
                        images: ads[i].images
                    })
                }
            }
        } else {
            res.json({ error: "Ads not found. Please, provide a different combinations of filters and keywords and try again." });
            return;
        }
        res.json({ ads: adsList, length: all.length });
    },

    getAd: async ( req: Request, res: Response ) => {
        const { id } = req.params;

        if ( id?.length === 24 ) {
            let ad = await Ad.findById( id );
            let adList = [ ];
            if (ad) {

                if (ad?.views !== undefined) {
                    ad.views++;
                    await ad.save();
                }

                let matchCategory = await Category.findOne({ _id: ad.category });
                let matchState = await State.findOne({ _id: ad.state });

                if ( matchState && matchCategory ) {
                    const adState = matchState.name;
                    const adCategory = matchCategory.name;
                    const images = ad.images;
                    const user = await User.findById( ad.id_user );
                    if (user) {;

                        let advertiser = [ ];
                        advertiser.push({
                            name: user.name,
                            email: user.email,
                            state: adState,
                            date_created: user?.date_created
                        })
                        
                        adList.push({
                            _id: ad._id,
                            name: ad.name,
                            user: ad.id_user,
                            state: adState,
                            category: adCategory,
                            price: ad.price,
                            price_nogotiable: ad.price_negotiable,
                            description: ad.description,
                            views: ad.views,
                            date_created: ad.date_created,
                            images,
                            advertiser
                        })
                        res.json({ ad: adList });
                        return;
                    }
                } else {
                    res.json({ error: "Sorry, the data relative to categories and/or state are not matching. Please, provide a different state and/or category and try again." });
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
    },

    getUserAds: async ( req: Request, res: Response ) => {
        const { token } = req.query;

        let user = await User.find({ token });
        if (user) {
            let userId = user[0]._id;
            let ads = await Ad.findOne({ id_user: userId });
            if (ads ) {
                res.json({ ads });
                return;
            } else {
                res.json({ error: "Sorry, no ads were found. That's because you have no ads yet or maybe some internal error occur." });
                return;
            }
        }
        res.json({}) ;
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
                const supportedMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

                let adImages = [];
                if ( req.files ) {
                    const files: any = req.files;
                    if ( files ) {
                        for ( let i in files ) {
                            if (!supportedMimeTypes.includes(files[i].mimetype)) { 
                                res.json({ error: "Some files contains unsupported image format. Please, provide supported image formats and try again." });
                                return;
                            }
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
