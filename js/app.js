window.onload = startPreloadChain;

const imgArr = [];
let data = null;

//------------------------------------------------
const container = document.querySelector('.container');

//--------------Load Data & sources---------------
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
    preloadPictures(data['srcImg'], imgArr, init);

}

function findPict(array){
    for (let key in array){
        if (key.includes('img')) {
            if (typeof array[key] === 'object'){
                for (let temp of array[key]) imgArr.push(temp);
            } else {
                imgArr.push(array[key]);
            }
        }
        else if (typeof array[key] === 'object') {
            findPict(array[key])
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

//----------------------INIT------------------------
function init()
{
    console.log("init")

    addElement(data.description, 'description');
}

function addElement(sectionData, sectionType){

    let sectionStruct = [];
    let sectionText = [];
    let sectionImg = [];
    let sectionBtn = null;

    //structure of section & init

    if (sectionData.text) sectionText = sectionData.text.split(/[|{}]/);

    for (let i in sectionText){
        if (sectionText[i].includes('img')){
            sectionStruct.push('img');
            sectionImg.push(sectionData[sectionText[i]]);
            sectionText[i] = "";
        }else {
            if (sectionText[i])
                sectionStruct.push('text');
        }
    }
    sectionText = sectionText.filter((n) => {return n != ""});

    if (sectionData.btn){
        sectionBtn = sectionData.btn;
        sectionStruct.push('btn');
    }

    //-----------Create DOM section element-------------

    let section = document.createElement('div')
    container.append(section);

    //tittle
    let temp = document.createElement('h1');
    temp.innerHTML = data.name;
    temp.classList.add('tittle');
    section.append(temp);

    //inner
    let inner = document.createElement('div');
    inner.classList.add('inner');
    section.append(inner);

    for (let el of sectionStruct){
        if (el === 'text'){
            temp = document.createElement('p');

            temp.classList.add("inner__text", "text");
            temp.innerHTML = sectionText.shift();

            inner.append(temp);

        }else if (el === 'img'){

            let tempSrc = data["srcImg"]+sectionImg.shift();

            temp = document.createElement('div');

            temp.classList.add("inner__img", "img");
            temp.style.backgroundImage = `url("${tempSrc}")`;
            temp.style.height = Math.floor(getImgParam(tempSrc, 'height')*0.75) + 'px'


            inner.append(temp);

        }else if (el === 'btn'){
            temp = document.createElement('button');

            temp.classList.add("btn")
            temp.innerHTML = sectionBtn;

            section.append(temp);
        }
    }

    if (sectionType == 'description'){
        section.classList.add('description-section');
        inner.classList.add('description-section__inner')

        temp = section.querySelector('.tittle');
        if (temp) temp.classList.add('description-section__tittle')

        temp = section.querySelector('.btn');
        if (temp) temp.classList.add('description-section__btn')
    }
}


//----------Get imgWidth-----------
function getImgParam(src, param){
    let tempImg = document.createElement('img');
    tempImg.src = src;

    return tempImg[param];
}