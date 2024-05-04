const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const User = require('../models/users');
const errorHandle = require('../errorHandle');

/* GET */
router.get('/', async function(req, res, next) {
    try{
        const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
        const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
        const posts = await Post.find(q).populate({
            path: 'user',
            select: 'name photo '
        }).sort(timeSort);
        if(posts.length === 0){
            res.status(200).json({
                'status': 'success',
                'message': '目前尚無狀態，新增一則貼文吧！',
                data: {
                    posts: []
                }
            });
        }else{
            res.status(200).json({
                'status': 'success',
                data: {
                    posts
                }
            }) // 方法會自動結束不用額外加上res.end
        }
    }catch(error) {
        errorHandle(res, error)
    }
});

/* POST */
router.post('/', async function(req, res, next) {
    try {
        const { user, content, tags, type, image } = req.body;
        if (content && content.trim() !== '') {
            if(image && !image.startsWith('https://')){
                return res.status(400).json({
                    message: '圖片網址必須以https開頭。'
                });
            }
            const newPost = await Post.create({
                user: user,
                content: content.trim(),
                image: image,
                tags: tags,
                type: type
            });
            res.status(200).json({
                message: '新增成功',
                posts: newPost
            });
        } else {
            // 如果內容是空的，返回錯誤信息
            res.status(400).json({
                message: '內容不可為空。'
            });
        }
    }catch(error){
        errorHandle(res, error)
    }
});

/* DELETE */
router.delete('/', async function(req, res, next) {
    try {
        await Post.deleteMany({});
        res.status(200).json({
            'status': 'success',
            data: []
        })
    }catch(error){
        errorHandle(res, error)
    }
});

/* DELETE only one*/
router.delete('/:id', async function(req, res, next) {
    const { id } = req.params;
    try{
        const deletePost = await Post.findByIdAndDelete(id);
        if(deletePost){
            res.status(200).json({
                'status': 'success',
                data: null
            })
        }else{
            errorHandle(res)
        }
    }catch(error){
        errorHandle(res, error)
    }
});

/* PATCH only one*/
router.patch('/:id', async function(req, res, next) {
    try{
        const { id } = req.params;
        const { user, content, tags, type } = req.body;
        const posts = await Post.findByIdAndUpdate({_id: id}, { user, content, tags, type }, { new: true });
        if(posts){
            res.status(200).json({
                'status': 'success',
                'data': posts
            })
        }else{
            errorHandle(res)
        }
    }catch(error){
        errorHandle(res, error)
    }
});


module.exports = router;
