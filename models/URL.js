const mongoose = require('mongoose');
const bcrypt = require ('bcrypt');

const URLSchema = mongoose.Schema({
    origin: {
        type: String,
        match: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
        trim: true,
        default: 'https://kyism.ga/shorts'
    },
    target: {
        type: String,
        match: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
        trim: true,
        required: true
    },
    mirror: {
        type: String,
        trim: true
    },
    shortURL: {
        type: String,
        trim: true
    },
    expires: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

URLSchema.pre('save', async function (next) {
    const url = this;
    if (url.isNew) {
        console.log('New url created.');
        url.mirror = await bcrypt.hash(url.target, 2);
        url.mirror = url.mirror.slice(url.mirror.length - 9);
        url.shortURL = "kyism.ga/" + url.mirror;
    }
    next();
});

/* AppSchema Methods */
// AppSchema.methods.signKey = function () {
// 	const token = jwt.sign({ _id: this["_id"], name: this['name'] }, process.env.JWT_SECRET, {});
// 	try {
// 		this.key = token;
// 	}
// 	catch (err) {
// 		console.log(err);
// 	}
// }

module.exports = mongoose.model('ShortURL', URLSchema);