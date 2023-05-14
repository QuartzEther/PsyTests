window.onload = startPreloadChain;

const imgArr = [];
let data = null;

function startPreloadChain(){
    console.log('startPreloadChain');
    loadData();
}

function loadData(){
    console.log('loadData');

    fetch('../data/test1.json')
        .then(response=>response.json())
        .then(result=>{
            data = result;
            return onDataPreloaded();
        })
        .catch(error=>{
            console.log(error);
        })
}

function onDataPreloaded(){
    console.log('onDataPreloaded');

    findPict(data);
    console.log(data['img_src']);

    preloadPictures(data['img_src'], imgArr, init);
}

function findPict(array){
    for (let key in array){
        if (typeof array[key] === 'object') {
            findPict(array[key])
        }
        else if (key === 'img') {
            imgArr.push(array[key]);
        }
    }
}


function preloadPictures(path ,sources, callback) {
    const images = [];
    let loadedImagesCounter = 0;
    for(let i = 0; i < sources.length; i++)
    {
        const srcName = sources[i];
        images[srcName] = new Image();
        images[srcName].onload = ()=>{
            if(++loadedImagesCounter >= sources.length)
                callback(images);
        }
        images[srcName].src = path + srcName;
    }
}


function init()
{
    console.log(123)
}